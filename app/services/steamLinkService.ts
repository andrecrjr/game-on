import PocketBase from 'pocketbase';
import { ISteamGamesOwned } from '@/types/steam';
import { getMostPlayedOwnedGames } from './index';

/**
 * Service for handling Steam data for linked accounts
 */
export class SteamLinkService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(process.env.POCKETBASE_URL!);
  }

  /**
   * Initialize PocketBase with admin credentials
   */
  private async initPocketBase(): Promise<void> {
    try {
      await this.pb
        .collection('_superusers')
        .authWithPassword(
          process.env.PB_ADMIN_USER!,
          process.env.PB_ADMIN_PASS!,
        );
    } catch (error) {
      return;
    }
  }

  /**
   * Get Steam credentials from PocketBase for a user
   */
  private async getSteamCredentials(userId: string): Promise<any> {
    await this.initPocketBase();

    try {
      const record = await this.pb
        .collection('linked_accounts_gameon')
        .getFirstListItem(`user_id="${userId}" && provider="steam"`);

      if (!record) {
        throw new Error('No Steam account linked to this user');
      }

      if (!record.credentials) {
        throw new Error('Steam account credentials not found');
      }

      const credentials = JSON.parse(record.credentials);

      if (!credentials.steamid && !record.provider_id) {
        throw new Error('Steam ID not found in credentials');
      }

      // Check if access token exists and is still valid
      if (credentials.access_token && credentials.expires_in) {
        // Check if token is expired (with 5 minute buffer)
        const expirationTime = new Date(record.updated).getTime() + (credentials.expires_in * 1000) - (5 * 60 * 1000);
        if (Date.now() > expirationTime) {
          console.log('Steam access token expired, attempting refresh');
          return await this.refreshSteamAccessToken(record, credentials);
        }
      }

      return {
        steamid: credentials.steamid || record.provider_id,
        profile: record.provider_data?.steam || null,
        access_token: credentials.access_token || null,
        account_data: credentials.account_data || null
      };
    } catch (error) {
      console.error('Failed to get Steam credentials:', error);
      return null;
    }
  }

  /**
   * Refresh Steam access token
   */
  private async refreshSteamAccessToken(record: any, credentials: any): Promise<any> {
    if (!credentials.refresh_token) {
      console.warn('No refresh token available for Steam account');
      return {
        steamid: credentials.steamid || record.provider_id,
        profile: record.provider_data?.steam || null,
        access_token: credentials.access_token || null,
        account_data: credentials.account_data || null
      };
    }

    try {
      // Steam doesn't have a standard OAuth2 refresh endpoint
      // This would need to be implemented based on Steam's specific OAuth flow
      // For now, we'll return the existing credentials and log the attempt
      console.log('Steam token refresh not implemented - using existing token');
      
      return {
        steamid: credentials.steamid || record.provider_id,
        profile: record.provider_data?.steam || null,
        access_token: credentials.access_token || null,
        account_data: credentials.account_data || null
      };
    } catch (error) {
      console.error('Failed to refresh Steam access token:', error);
      // Return existing credentials even if refresh fails
      return {
        steamid: credentials.steamid || record.provider_id,
        profile: record.provider_data?.steam || null,
        access_token: credentials.access_token || null,
        account_data: credentials.account_data || null
      };
    }
  }

  /**  
   * Get Steam games library for a PocketBase user
   */
  async getSteamLibraryData(userId: string) {
    try {
      const steamCredentials = await this.getSteamCredentials(userId);
      const steamId = steamCredentials?.steamid;
      if (!steamCredentials) {
        return {
          mostPlayedData: null,
          mostPlayedTime: null,
          ownedGames: [],
          steamProfile: null,
        };
      }

      // Use access token if available, otherwise fall back to API key
      let apiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;
      
      if (steamCredentials.access_token) {
        // Use OAuth access token
        apiUrl += `&access_token=${steamCredentials.access_token}`;
      } else {
        // Fall back to API key
        apiUrl += `&key=${process.env.STEAM_SECRET}`;
      }

      // Fetch the user's owned games from Steam API
      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error(`Steam API error: ${res.status} ${res.statusText}`);
      }

      const { response: gamesOwned }: { response: ISteamGamesOwned } =
        await res.json();

      if (!gamesOwned || !gamesOwned.games) {
        return {
          mostPlayedData: null,
          mostPlayedTime: null,
          ownedGames: [],
          steamProfile: steamCredentials.profile,
        };
      }

      // Get detailed game data
      const libraryData = await getMostPlayedOwnedGames(gamesOwned);

      return {
        ...libraryData,
        steamProfile: steamCredentials.profile,
      };
    } catch (error) {
      return {
        mostPlayedData: null,
        mostPlayedTime: null,
        ownedGames: [],
        steamProfile: null,
      };
    }
  }

  /**
   * Check if a user has a linked Steam account
   */
  async hasSteamLinked(userId: string): Promise<boolean> {
    try {
      await this.getSteamCredentials(userId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get Steam profile for a PocketBase user
   */
  async getSteamProfile(userId: string) {
    try {
      const steamCredentials = await this.getSteamCredentials(userId);
      return steamCredentials.profile;
    } catch (error) {
      console.error('Failed to get Steam profile:', error);
      return null;
    }
  }

  /**
   * Store Steam access token in PocketBase
   */
  async storeSteamAccessToken(userId: string, tokenData: {
    access_token: string;
    expires_in?: number;
    refresh_token?: string;
    steamid?: string;
    [key: string]: any;
  }): Promise<void> {
    await this.initPocketBase();

    try {
      const record = await this.pb
        .collection('linked_accounts_gameon')
        .getFirstListItem(`user_id="${userId}" && provider="steam"`);

      if (!record) {
        throw new Error('No Steam account linked to this user');
      }

      // Parse existing credentials
      const existingCredentials = record.credentials ? JSON.parse(record.credentials) : {};

      // Merge with new token data
      const updatedCredentials = {
        ...existingCredentials,
        ...tokenData,
        token_updated_at: new Date().toISOString(),
      };

      // Calculate expiration time if expires_in is provided
      const updateData: any = {
        credentials: JSON.stringify(updatedCredentials),
        token_updated_at: new Date().toISOString(),
      };

      if (tokenData.expires_in) {
        updateData.expires_at = new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString();
      }

      await this.pb.collection('linked_accounts_gameon').update(record.id, updateData);

      console.log('Steam access token stored successfully');
    } catch (error) {
      console.error('Failed to store Steam access token:', error);
      throw new Error('Failed to store Steam access token');
    }
  }

  /**
   * Update Steam credentials in PocketBase
   */
  async updateSteamCredentials(userId: string, credentialsUpdate: any): Promise<void> {
    await this.initPocketBase();

    try {
      const record = await this.pb
        .collection('linked_accounts_gameon')
        .getFirstListItem(`user_id="${userId}" && provider="steam"`);

      if (!record) {
        throw new Error('No Steam account linked to this user');
      }

      const existingCredentials = record.credentials ? JSON.parse(record.credentials) : {};
      const updatedCredentials = {
        ...existingCredentials,
        ...credentialsUpdate,
        updated_at: new Date().toISOString(),
      };

      await this.pb.collection('linked_accounts_gameon').update(record.id, {
        credentials: JSON.stringify(updatedCredentials),
      });

      console.log('Steam credentials updated successfully');
    } catch (error) {
      console.error('Failed to update Steam credentials:', error);
      throw new Error('Failed to update Steam credentials');
    }
  }
}

// Export singleton instance
export const steamLinkService = new SteamLinkService();
