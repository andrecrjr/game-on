import PocketBase from 'pocketbase';

// Xbox Live API constants
const XBOX_USER_AUTH_URL = 'https://user.auth.xboxlive.com/user/authenticate';
const XBOX_XSTS_AUTH_URL = 'https://xsts.auth.xboxlive.com/xsts/authorize';
const XBOX_ACHIEVEMENTS_URL = 'https://achievements.xboxlive.com';

export interface XboxUserProfile {
  id: string;
  gamertag: string;
  realName?: string;
  gamerpic: string;
  gamerScore: number;
}

export interface XboxAchievement {
  id: string;
  name: string;
  description: string;
  gamerscore: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  rarityPercentage?: number;
}

export interface XboxUserData {
  profile: XboxUserProfile;
  achievements: XboxAchievement[];
  totalGamerscore: number;
  totalAchievements: number;
}

export class XboxLiveService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(process.env.POCKETBASE_URL!);
    this.pb.autoCancellation(false);
  }

  /**
   * Initialize PocketBase admin authentication
   */
  private async initPocketBase() {
    try {
      await this.pb
        .collection('_superusers')
        .authWithPassword(process.env.PB_ADMIN_USER!, process.env.PB_ADMIN_PASS!);
    } catch (error) {
      console.error('Failed to authenticate with PocketBase:', error);
      throw new Error('PocketBase authentication failed');
    }
  }

  /**
   * Get Microsoft credentials from PocketBase for a user
   */
  private async getMicrosoftCredentials(steamId: string): Promise<any> {
    await this.initPocketBase();
    
    try {
      const record = await this.pb
        .collection('linked_accounts_gameon')
        .getFirstListItem(`user_id="${steamId}" && provider="microsoft"`);
      
      if (!record) {
        throw new Error('No Microsoft account linked to this user');
      }

      if (!record.credentials) {
        throw new Error('Microsoft account credentials not found');
      }

      const credentials = JSON.parse(record.credentials);
      
      if (!credentials.access_token) {
        throw new Error('Microsoft access token not found');
      }

      // credentials.expires_in is always 40 minutes so we need to check if the record is older than 40
      // but my server is in UTC+2 so we need to add 2 hours to the date
      const fortyMinutesAgo = new Date(Date.now() - 40 * 60 * 1000 + 2 * 60 * 60 * 1000);
      if (new Date(record.updated) < fortyMinutesAgo) {
        return credentials;
      }
      console.log("not refreshing token");

      // Always refresh token to ensure it's fresh
      return await this.refreshAccessToken(record, credentials);
    } catch (error) {
      console.error('Failed to get Microsoft credentials:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Microsoft account not linked or expired');
    }
  }

  /**
   * Refresh Microsoft access token
   */
  private async refreshAccessToken(record: any, credentials: any): Promise<any> {
    if (!credentials.refresh_token) {
      throw new Error('No refresh token available');
    }

    const params = new URLSearchParams({
      client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      refresh_token: credentials.refresh_token,
      grant_type: 'refresh_token',
    });

    try {
      const response = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Token refresh failed:', errorData);
        throw new Error(`Failed to refresh token: ${response.status}`);
      }

      const newTokenData = await response.json();
      
      // Update credentials in PocketBase
      const updatedCredentials = {
        ...credentials,
        access_token: newTokenData.access_token,
        expires_in: newTokenData.expires_in,
      };

      if (newTokenData.refresh_token) {
        updatedCredentials.refresh_token = newTokenData.refresh_token;
      }

      await this.pb.collection('linked_accounts_gameon').update(record.id, {
        credentials: JSON.stringify(updatedCredentials),
        expires_at: new Date(Date.now() + (newTokenData.expires_in - 300) * 1000).toISOString(),
        token_updated_at: new Date().toISOString(),
      });

      return updatedCredentials;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Authenticate with Xbox Live using Microsoft access token
   */
  private async authenticateWithXboxLive(accessToken: string): Promise<{ userToken: string; xstsToken: string; uhs: string; xuid: string }> {
    // Step 1: Get Xbox User Token
    const userAuthResponse = await fetch(XBOX_USER_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-xbl-contract-version': '1',
      },
      body: JSON.stringify({
        Properties: {
          AuthMethod: 'RPS',
          SiteName: 'user.auth.xboxlive.com',
          RpsTicket: `d=${accessToken}`,
        },
        RelyingParty: 'http://auth.xboxlive.com',
        TokenType: 'JWT',
      }),
    });

    if (!userAuthResponse.ok) {
      const errorText = await userAuthResponse.text();
      console.error('Xbox User Auth error:', errorText);
      throw new Error(`Xbox User Auth failed: ${userAuthResponse.status}`);
    }

    const userAuthData = await userAuthResponse.json();
    const userToken = userAuthData.Token;

    // Step 2: Get XSTS Token
    const xstsResponse = await fetch(XBOX_XSTS_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-xbl-contract-version': '1',
      },
      body: JSON.stringify({
        Properties: {
          SandboxId: 'RETAIL',
          UserTokens: [userToken],
        },
        RelyingParty: 'http://xboxlive.com',
        TokenType: 'JWT',
      }),
    });

    if (!xstsResponse.ok) {
      const errorData = await xstsResponse.json();
      console.error('XSTS Auth error:', errorData);
      
      if (errorData.XErr === 2148916233) {
        throw new Error('This Microsoft account is not linked to an Xbox Live account');
      } else if (errorData.XErr === 2148916235) {
        throw new Error('Xbox Live account from a region where Xbox Live is not available');
      }
      
      throw new Error(`XSTS Auth failed: ${xstsResponse.status}`);
    }

    const xstsData = await xstsResponse.json();
    const xstsToken = xstsData.Token;
    const uhs = xstsData.DisplayClaims.xui[0].uhs;
    const xuid = xstsData.DisplayClaims.xui[0].xid;

    return { userToken, xstsToken, uhs, xuid };
  }

  /**
   * Get Xbox user profile
   */
  private async getXboxProfile(xstsToken: string, uhs: string): Promise<XboxUserProfile> {
    const profileSettings = [
      'Gamertag',
      'RealName', 
      'GameDisplayPicRaw',
      'Gamerscore',
    ].join(',');

    const response = await fetch(
      `https://profile.xboxlive.com/users/me/profile/settings?settings=${profileSettings}`, 
      {
        headers: {
          'Authorization': `XBL3.0 x=${uhs};${xstsToken}`,
          'x-xbl-contract-version': '2',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Xbox Profile error:', errorText);
      throw new Error(`Failed to get Xbox profile: ${response.status}`);
    }

    const profileData = await response.json();
    const settings = profileData.profileUsers[0].settings;

    return {
      id: profileData.profileUsers[0].id,
      gamertag: settings.find((s: any) => s.id === 'Gamertag')?.value || 'Unknown',
      realName: settings.find((s: any) => s.id === 'RealName')?.value,
      gamerpic: settings.find((s: any) => s.id === 'GameDisplayPicRaw')?.value || '',
      gamerScore: parseInt(settings.find((s: any) => s.id === 'Gamerscore')?.value || '0'),
    };
  }

  /**
   * Get user's achievements
   */
  private async getUserAchievements(xstsToken: string, uhs: string, xuid: string): Promise<XboxAchievement[]> {
    const response = await fetch(`${XBOX_ACHIEVEMENTS_URL}/users/xuid(${xuid})/achievements`, {
      headers: {
        'Authorization': `XBL3.0 x=${uhs};${xstsToken}`,
        'x-xbl-contract-version': '2',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to get achievements: ${response.status}`);
      return [];
    }

    const achievementsData = await response.json();
    
    return achievementsData.achievements?.map((achievement: any) => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      gamerscore: achievement.gamerscore || 0,
      isUnlocked: achievement.progressState === 'Achieved',
      unlockedDate: achievement.progressState === 'Achieved' ? achievement.progressedAt : undefined,
      rarityPercentage: achievement.rarity?.currentCategory === 'Rare' ? achievement.rarity?.currentPercentage : undefined,
    })) || [];
  }

  /**
   * Get complete Xbox achievements data for a user
   */
  async getXboxAchievementsData(steamId: string): Promise<XboxUserData | null> {
    try {
      // Get Microsoft credentials from PocketBase
      const credentials = await this.getMicrosoftCredentials(steamId);
      
      // Authenticate with Xbox Live
      const { xstsToken, uhs, xuid } = await this.authenticateWithXboxLive(credentials.access_token);
      
      // Get Xbox profile and achievements in parallel
      const [profile, achievements] = await Promise.all([
        this.getXboxProfile(xstsToken, uhs),
        this.getUserAchievements(xstsToken, uhs, xuid),
      ]);

      const totalGamerscore = achievements.reduce((sum, achievement) => sum + achievement.gamerscore, 0);
      const totalAchievements = achievements.length;

      return {
        profile,
        achievements,
        totalGamerscore,
        totalAchievements,
      };
    } catch (error) {
      console.error('Failed to get Xbox achievements data:', error);
      
      // Re-throw specific credential errors for better error handling upstream
      if (error instanceof Error) {
        if (error.message.includes('No Microsoft account linked') ||
            error.message.includes('Microsoft account credentials not found') ||
            error.message.includes('Microsoft access token not found')) {
          throw error;
        }
      }
      
      return null;
    }
  }

  /**
   * Check if user has Xbox account linked
   */
  async hasXboxAccountLinked(steamId: string): Promise<boolean> {
    try {
      await this.initPocketBase();
      const record = await this.pb
        .collection('linked_accounts_gameon')
        .getFirstListItem(`user_id="${steamId}" && provider="microsoft"`);
      
      return !!record && record.is_active;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const xboxLiveService = new XboxLiveService(); 