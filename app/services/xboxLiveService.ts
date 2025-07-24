import PocketBase from 'pocketbase';

// Xbox Live API constants
const XBOX_USER_AUTH_URL = 'https://user.auth.xboxlive.com/user/authenticate';
const XBOX_XSTS_AUTH_URL = 'https://xsts.auth.xboxlive.com/xsts/authorize';
const XBOX_PROFILE_URL = 'https://profile.xboxlive.com';
const XBOX_ACHIEVEMENTS_URL = 'https://achievements.xboxlive.com';

// Game Pass API endpoints (using the Game Pass API from the web search results)
const GAME_PASS_API_BASE = 'https://catalog.gamepass.com/sigls/v2';

// Rate limiting constants
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds between retries

export interface XboxUserProfile {
  id: string;
  gamertag: string;
  realName?: string;
  gamerpic: string;
  gamerScore: number;

  presence?: {
    state: string;
    lastSeen?: {
      deviceType: string;
      titleName?: string;
    };
  };
}

export interface XboxGame {
  titleId: string;
  name: string;
  displayImage?: string;
  description?: string;
  publisher?: string;
  developer?: string;
  categories?: string[];
  isGamePass?: boolean;
  gamePassTier?: 'Console' | 'PC' | 'EA Play' | 'Ultimate';
  achievementStats?: {
    currentAchievements: number;
    totalAchievements: number;
    currentGamerscore: number;
    totalGamerscore: number;
  };
  lastPlayedDate?: string;
  playtimeStats?: {
    totalPlaytime: number; // in minutes
  };
  // Add new properties for ownership
  ownershipType?: 'Owned' | 'Subscription' | 'Trial';
  purchaseDate?: string;
}

export interface XboxLibraryData {
  profile: XboxUserProfile;
  ownedGames: XboxGame[]; // New field for owned games
}

export class XboxLiveService {
  private pb: PocketBase;
  private tokenCache: Map<string, { tokens: any; expiry: number }> = new Map();
  private lastRequestTime: number = 0;
  private requestQueue: Promise<any> = Promise.resolve();

  constructor() {
    console.log(process.env.POCKETBASE_URL);
    this.pb = new PocketBase(process.env.POCKETBASE_URL!);
    this.pb.autoCancellation(false);
  }

  /**
   * Rate-limited fetch with retry logic
   */
  private async rateLimitedFetch(url: string, options: RequestInit = {}, retryCount = 0): Promise<Response> {
    // Queue requests to avoid rate limiting
    return this.requestQueue = this.requestQueue.then(async () => {
      // Ensure minimum delay between requests
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
      }

      try {
        this.lastRequestTime = Date.now();
        const response = await fetch(url, options);

        // Handle rate limiting
        if (response.status === 429) {
          if (retryCount < MAX_RETRIES) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * (retryCount + 1);
            
            console.log(`Rate limited, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            return this.rateLimitedFetch(url, options, retryCount + 1);
          } else {
            throw new Error('Rate limit exceeded, max retries reached');
          }
        }

        return response;
      } catch (error) {
        if (retryCount < MAX_RETRIES && this.isRetryableError(error)) {
          console.log(`Request failed, retrying in ${RETRY_DELAY}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return this.rateLimitedFetch(url, options, retryCount + 1);
        }
        throw error;
      }
    });
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    return error.code === 'ECONNRESET' || 
           error.code === 'ETIMEDOUT' || 
           error.message?.includes('timeout') ||
           error.message?.includes('network');
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
      
      if (!record || !record.credentials) {
        throw new Error('No Microsoft account linked');
      }

      const credentials = JSON.parse(record.credentials);
      
      // Check if token is expired and refresh if needed
      if (record.expires_at && new Date(record.expires_at) <= new Date()) {
        return await this.refreshAccessToken(record, credentials);
      }

      return credentials;
    } catch (error) {
      console.error('Failed to get Microsoft credentials:', error);
      throw new Error('Microsoft account not linked or expired');
    }
  }

  /**
   * Refresh Microsoft access token with retry logic
   */
  private async refreshAccessToken(record: any, credentials: any, retryCount = 0): Promise<any> {
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
      const response = await this.rateLimitedFetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Token refresh failed:', errorData);
        
        // If refresh token is invalid and we haven't retried, try once more
        if (response.status === 400 && retryCount === 0) {
          console.log('Retrying token refresh...');
          return await this.refreshAccessToken(record, credentials, retryCount + 1);
        }
        
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
        expires_at: new Date(Date.now() + (newTokenData.expires_in - 300) * 1000).toISOString(), // 5 min buffer
        token_updated_at: new Date().toISOString(),
      });

      return updatedCredentials;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Authenticate with Xbox Live using Microsoft access token with caching and rate limiting
   */
  private async authenticateWithXboxLive(accessToken: string, steamId: string): Promise<{ userToken: string; xstsToken: string; uhs: string; xuid: string }> {
    // Check cache first
    const cached = this.tokenCache.get(steamId);
    if (cached && Date.now() < cached.expiry) {
      return cached.tokens;
    }

    // Step 1: Get Xbox User Token with rate limiting
    const userAuthResponse = await this.rateLimitedFetch(XBOX_USER_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-xbl-contract-version': '1',
      },
      body: JSON.stringify({
        Properties: {
          AuthMethod: 'RPS',
          SiteName: 'user.auth.xboxlive.com',
          RpsTicket: `d=${accessToken}`, // 'd=' prefix required for Microsoft tokens
        },
        RelyingParty: 'http://auth.xboxlive.com',
        TokenType: 'JWT',
      }),
    });

    if (!userAuthResponse.ok) {
      const errorText = await userAuthResponse.text();
      console.error('Xbox User Auth error:', errorText);
      
      // Parse rate limit error
      if (userAuthResponse.status === 429) {
        throw new Error('Xbox Live API rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`Xbox User Auth failed: ${userAuthResponse.status}`);
    }

    const userAuthData = await userAuthResponse.json();
    const userToken = userAuthData.Token;

    // Step 2: Get XSTS Token with rate limiting
    const xstsResponse = await this.rateLimitedFetch(XBOX_XSTS_AUTH_URL, {
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
      
      // Handle specific Xbox Live error codes
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

    const tokens = { userToken, xstsToken, uhs, xuid };
    
    // Cache tokens for 20 minutes
    this.tokenCache.set(steamId, {
      tokens,
      expiry: Date.now() + (20 * 60 * 1000)
    });

    return tokens;
  }

  /**
   * Get Xbox user profile with enhanced error handling and rate limiting
   */
  private async getXboxProfile(xstsToken: string, uhs: string): Promise<XboxUserProfile> {
    // Request specific profile settings we need
    const profileSettings = [
      'Gamertag',
      'RealName', 
      'GameDisplayPicRaw',
      'Gamerscore',
      'AccountTier',
      'XboxOneRep',
      'PreferredColor'
    ].join(',');

    const response = await this.rateLimitedFetch(
      `${XBOX_PROFILE_URL}/users/me/profile/settings?settings=${profileSettings}`, 
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
      
      // Try to parse rate limit info
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.limitType === 'Rate') {
          throw new Error(`Xbox Profile API rate limited. Max ${errorData.maxRequests} requests per ${errorData.periodInSeconds} seconds.`);
        }
      } catch (parseError) {
        // If we can't parse it, just use the original error
      }
      
      throw new Error(`Failed to get Xbox profile: ${response.status}`);
    }

    const profileData = await response.json();
    const settings = profileData.profileUsers[0].settings;

    // Map Xbox profile settings to our interface
    const profile: XboxUserProfile = {
      id: profileData.profileUsers[0].id,
      gamertag: settings.find((s: any) => s.id === 'Gamertag')?.value || 'Unknown',
      realName: settings.find((s: any) => s.id === 'RealName')?.value,
      gamerpic: settings.find((s: any) => s.id === 'GameDisplayPicRaw')?.value || '',
      gamerScore: parseInt(settings.find((s: any) => s.id === 'Gamerscore')?.value || '0'),
    };

    return profile;
  }

  /**
   * Alternative method to get Xbox profile using different endpoint
   */
  private async getXboxProfileAlternative(xstsToken: string, uhs: string, xuid: string): Promise<XboxUserProfile> {
    try {
      // Try the alternative profile endpoint
      const response = await this.rateLimitedFetch(
        `${XBOX_PROFILE_URL}/users/xuid(${xuid})/profile/settings?settings=Gamertag,RealName,GameDisplayPicRaw,Gamerscore,AccountTier,XboxOneRep,PreferredColor`,
        {
          headers: {
            'Authorization': `XBL3.0 x=${uhs};${xstsToken}`,
            'x-xbl-contract-version': '2',
            'Accept': 'application/json',
          },
        }
      );

      if (response.ok) {
        const profileData = await response.json();
        console.log("Alternative profile response:", profileData);
        
        const settings = profileData.profileUsers[0].settings;
        
        return {
          id: profileData.profileUsers[0].id,
          gamertag: settings.find((s: any) => s.id === 'Gamertag')?.value || 'Unknown',
          realName: settings.find((s: any) => s.id === 'RealName')?.value,
          gamerpic: settings.find((s: any) => s.id === 'GameDisplayPicRaw')?.value || '',
          gamerScore: parseInt(settings.find((s: any) => s.id === 'Gamerscore')?.value || '0'),
        };
      }
    } catch (error) {
      console.warn('Alternative profile method failed:', error);
    }
    
    // Fallback to basic profile if alternative fails
    return {
      id: xuid,
      gamertag: 'Unknown',
      gamerpic: '',
      gamerScore: 0,
    };
  }

  /**
   * Get Game Pass games using the official API approach from web search results
   */
  private async getGamePassGames(xstsToken?: string, uhs?: string): Promise<XboxGame[]> {
    try {
      // Try to fetch from the Game Pass catalog API
      // This is a fallback implementation since the official API requires special developer access
      
      // Method 1: Try the unofficial Game Pass API mentioned in search results
      try {
        const gamePassResponse = await this.rateLimitedFetch(`${GAME_PASS_API_BASE}?market=US&language=en-US`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        console.log("gamePassResponse", gamePassResponse);

        if (gamePassResponse.ok) {
          const gamePassData = await gamePassResponse.json();
          
          // Process the Game Pass catalog data
          return this.processGamePassCatalog(gamePassData);
        }
      } catch (error) {
        console.warn('Failed to fetch from Game Pass catalog API:', error);
      }

      // Method 2: Return sample data for demonstration
      return this.getSampleGamePassGames();
      
    } catch (error) {
      console.error('Failed to fetch Game Pass games:', error);
      return this.getSampleGamePassGames();
    }
  }

  /**
   * Process Game Pass catalog data into our format
   */
  private processGamePassCatalog(catalogData: any): XboxGame[] {
    if (!catalogData || !Array.isArray(catalogData)) {
      return this.getSampleGamePassGames();
    }

    return catalogData.slice(0, 20).map((item: any) => ({
      titleId: item.id || `gp-${Date.now()}-${Math.random()}`,
      name: item.title || item.name || 'Unknown Game',
      displayImage: item.images?.boxart || item.images?.hero || item.image,
      description: item.description || '',
      publisher: item.publisher || 'Unknown Publisher',
      developer: item.developer || item.publisher || 'Unknown Developer',
      categories: item.categories || item.genres || [],
      isGamePass: true,
      gamePassTier: this.determineGamePassTier(item.platforms),
    }));
  }

  /**
   * Determine Game Pass tier based on available platforms
   */
  private determineGamePassTier(platforms: string[] = []): 'Console' | 'PC' | 'EA Play' | 'Ultimate' {
    if (!platforms || platforms.length === 0) return 'Ultimate';
    
    const hasConsole = platforms.some(p => p.toLowerCase().includes('console') || p.toLowerCase().includes('xbox'));
    const hasPC = platforms.some(p => p.toLowerCase().includes('pc') || p.toLowerCase().includes('windows'));
    
    if (hasConsole && hasPC) return 'Ultimate';
    if (hasPC) return 'PC';
    if (hasConsole) return 'Console';
    
    return 'Ultimate';
  }

  /**
   * Get sample Game Pass games for demonstration
   */
  private getSampleGamePassGames(): XboxGame[] {
    return [
      {
        titleId: 'forza-horizon-5',
        name: 'Forza Horizon 5',
        displayImage: 'https://store-images.s-microsoft.com/image/apps.18270.14537704372270848.6ecb6038-5426-409a-8660-158d1eb64fb0.40200692-5c9d-469d-97b8-1607d7bb90bb',
        description: 'Your Ultimate Horizon Adventure awaits in Mexico',
        publisher: 'Microsoft Studios',
        developer: 'Playground Games',
        categories: ['Racing', 'Adventure'],
        isGamePass: true,
        gamePassTier: 'Ultimate',
      },
      {
        titleId: 'halo-infinite',
        name: 'Halo Infinite',
        displayImage: 'https://store-images.s-microsoft.com/image/apps.56101.13727851868390641.c9cc5f66-aff8-406c-af6b-440838730be0.68796707-d6e9-4241-8f03-9e9c3b695d2d',
        description: 'Master Chief returns in the biggest Halo adventure yet',
        publisher: 'Microsoft Studios',
        developer: '343 Industries',
        categories: ['Shooter', 'Action'],
        isGamePass: true,
        gamePassTier: 'Ultimate',
      },
      {
        titleId: 'flight-simulator',
        name: 'Microsoft Flight Simulator',
        displayImage: 'https://store-images.s-microsoft.com/image/apps.31864.13727851868390641.c9cc5f66-aff8-406c-af6b-440838730be0.23b4d741-2514-4537-8d26-cabe1f7a3da1',
        description: 'From light planes to wide-body jets, fly highly detailed aircraft',
        publisher: 'Microsoft Studios',
        developer: 'Asobo Studio',
        categories: ['Simulation'],
        isGamePass: true,
        gamePassTier: 'PC',
      },
    ];
  }

  /**
   * Get user's achievements summary with better error handling and rate limiting
   */
  private async getAchievementsSummary(xstsToken: string, uhs: string, xuid: string): Promise<any> {
    try {
      const response = await this.rateLimitedFetch(`${XBOX_ACHIEVEMENTS_URL}/users/xuid(${xuid})/achievements`, {
        headers: {
          'Authorization': `XBL3.0 x=${uhs};${xstsToken}`,
          'x-xbl-contract-version': '2',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Failed to get achievements summary: ${response.status}`);
        return {
          totalGamerScore: 0,
          totalAchievements: 0,
          recentAchievements: [],
        };
      }

      const achievementsData = await response.json();
      return {
        totalGamerScore: achievementsData.totalGamerscore || 0,
        totalAchievements: achievementsData.totalAchievements || 0,
        recentAchievements: achievementsData.achievements?.slice(0, 5) || [],
      };
    } catch (error) {
      console.error('Failed to get achievements summary:', error);
      return {
        totalGamerScore: 0,
        totalAchievements: 0,
        recentAchievements: [],
      };
    }
  }

  /**
   * Get user's owned games from Xbox API
   */
  private async getUserOwnedGames(xstsToken: string, uhs: string, xuid: string): Promise<XboxGame[]> {
    const LIBRARY_URL = `https://titlehub.xboxlive.com/users/xuid(${xuid})/titles?maxItems=100`;
    
    console.log("LIBRARY_URL", LIBRARY_URL);
    try {
      const response = await this.rateLimitedFetch(LIBRARY_URL, {
        headers: {
          'Authorization': `XBL3.0 x=${uhs};${xstsToken}`,
          'x-xbl-contract-version': '3',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Xbox Library error:', errorText);
        return [];
      }

      const libraryData = await response.json();
      return this.processOwnedGames(libraryData.titles);
    } catch (error) {
      console.error('Failed to get owned games:', error);
      return [];
    }
  }

  /**
   * Process owned games data
   */
  private processOwnedGames(titles: any[]): XboxGame[] {
    return titles
      .filter(title => title.titleType === "Game")
      .map(title => ({
        titleId: title.titleId,
        name: title.name,
        displayImage: title.displayImage,
        lastPlayedDate: title.titleHistory?.lastTimePlayed,
        playtimeStats: {
          totalPlaytime: title.stats?.minutesPlayed || 0
        },
        achievementStats: title.achievement && {
          currentAchievements: title.achievement.currentAchievements,
          totalAchievements: title.achievement.totalAchievements,
          currentGamerscore: title.achievement.currentGamerscore,
          totalGamerscore: title.achievement.totalGamerscore,
        },
        ownershipType: this.determineOwnershipType(title),
        purchaseDate: title.purchaseDate
      }));
  }

  /**
   * Determine ownership type
   */
  private determineOwnershipType(title: any): 'Owned' | 'Subscription' | 'Trial' {
    if (title.serviceConfigId === 'XboxGamePass') return 'Subscription';
    if (title.titleHistory?.hasTrial) return 'Trial';
    return 'Owned';
  }

  /**
   * Get recently played games from Xbox API
   */
  private async getRecentlyPlayedGames(xstsToken: string, uhs: string, xuid: string): Promise<XboxGame[]> {
    const RECENT_URL = `https://titlehub.xboxlive.com/users/xuid(${xuid})/titles?sort=lastPlayed&order=descending&maxItems=10`;
    
    try {
      const response = await this.rateLimitedFetch(RECENT_URL, {
        headers: {
          'Authorization': `XBL3.0 x=${uhs};${xstsToken}`,
          'x-xbl-contract-version': '3',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Recently Played error:', errorText);
        return [];
      }

      const recentData = await response.json();
      return this.processOwnedGames(recentData.titles);
    } catch (error) {
      console.error('Failed to get recently played games:', error);
      return [];
    }
  }

  /**
   * Get complete Xbox library data for a user
   */
  async getXboxLibraryData(steamId: string): Promise<XboxLibraryData | null> {
    try {
      // Get Microsoft credentials from PocketBase
      const credentials = await this.getMicrosoftCredentials(steamId);
      
        // Authenticate with Xbox Live
        const { xstsToken, uhs, xuid } = await this.authenticateWithXboxLive(credentials.access_token, steamId);
        console.log("xuid", xuid);
      
        // Get Xbox profile - try alternative method if first fails
        let profile: XboxUserProfile;
        try {
          profile = await this.getXboxProfile(xstsToken, uhs);
          console.log("profile", profile);
          
        } catch (error) {
          console.warn("Primary profile method failed, trying alternative:", error);
          // Try alternative method with the XUID from authentication
          profile = await this.getXboxProfileAlternative(xstsToken, uhs, xuid);
        }
      
              // Get all data in parallel
        const [ownedGames] = await Promise.all([
          this.getUserOwnedGames(xstsToken, uhs, xuid),
        ]);

        return {
          profile,
          ownedGames, // Added owned games
        };
    } catch (error) {
      console.error('Failed to get Xbox library data:', error);
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

  /**
   * Clear token cache for a user (useful for logout or re-authentication)
   */
  clearTokenCache(steamId: string): void {
    this.tokenCache.delete(steamId);
  }

  /**
   * Get cached Xbox profile if available
   */
  getCachedProfile(steamId: string): XboxUserProfile | null {
    const cached = this.tokenCache.get(steamId);
    return cached ? cached.tokens.profile || null : null;
  }

  /**
   * Get cached XUID if available
   */
  getCachedXuid(steamId: string): string | null {
    const cached = this.tokenCache.get(steamId);
    return cached ? cached.tokens.xuid || null : null;
  }

  /**
   * Reset rate limiting state (useful for testing)
   */
  resetRateLimit(): void {
    this.lastRequestTime = 0;
    this.requestQueue = Promise.resolve();
  }
}

// Export singleton instance
export const xboxLiveService = new XboxLiveService(); 