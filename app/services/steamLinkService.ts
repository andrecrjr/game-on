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

      if (!credentials.steamid) {
        throw new Error('Steam ID not found in credentials');
      }

      return {
        steamid: credentials.steamid,
        profile: record.provider_data?.steam || null,
      };
    } catch (error) {
      return null;
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

      // Fetch the user's owned games from Steam API
      const res = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_SECRET}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`,
      );

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
}

// Export singleton instance
export const steamLinkService = new SteamLinkService();
