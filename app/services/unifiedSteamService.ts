import { Session } from 'next-auth';
import { ISteamGamesOwned } from '@/types/steam';
import { getMostPlayedOwnedGames, getRecentlyPlayedGames } from './index';
import { steamLinkService } from './steamLinkService';

/**
 * Unified Steam service that works for both Steam-authenticated users
 * and PocketBase users with linked Steam accounts
 */
export class UnifiedSteamService {
  /**
   * Get Steam ID from session (works for both Steam and PocketBase users)
   */
  static getSteamId(session: any): string | null {
    // For Steam-authenticated users
    if (session?.user?.steam?.steamid) {
      return session.user.steam.steamid;
    }

    // For PocketBase users with linked Steam accounts
    if (session?.user?.combinedLibraryData?.steam?.steamProfile?.steamid) {
      return session.user.combinedLibraryData.steam.steamProfile.steamid;
    }

    return null;
  }

  /**
   * Check if user has Steam access (either authenticated or linked)
   */
  static hasSteamAccess(session: any): boolean {
    return this.getSteamId(session) !== null;
  }

  /**
   * Get Steam library data for any user type
   */
  static async getSteamLibraryData(session: any) {
    const steamId = this.getSteamId(session);
    if (!steamId) {
      return {
        mostPlayedData: null,
        mostPlayedTime: null,
        ownedGames: [],
      };
    }

    // For Steam-authenticated users, use existing session data
    if (session?.user?.steam?.steamid) {
      return session.user.gamesLibraryData || {
        mostPlayedData: null,
        mostPlayedTime: null,
        ownedGames: [],
      };
    }

    // For PocketBase users with linked Steam, use combined library data
    if (session?.user?.combinedLibraryData?.steam) {
      return session.user.combinedLibraryData.steam;
    }

    return {
      mostPlayedData: null,
      mostPlayedTime: null,
      ownedGames: [],
    };
  }

  /**
   * Get recently played games for any user type
   */
  static async getRecentlyPlayedGames(session: any) {
    const steamId = this.getSteamId(session);
    if (!steamId) {
      return null;
    }

    try {
      return await getRecentlyPlayedGames(steamId);
    } catch (error) {
      console.error('Failed to get recently played games:', error);
      return null;
    }
  }

  /**
   * Get Steam profile for any user type
   */
  static getSteamProfile(session: any) {
    // For Steam-authenticated users
    if (session?.user?.steam) {
      return session.user.steam;
    }

    // For PocketBase users with linked Steam
    if (session?.user?.combinedLibraryData?.steam?.steamProfile) {
      return session.user.combinedLibraryData.steam.steamProfile;
    }

    return null;
  }

  /**
   * Check if user can link Steam account (PocketBase users only)
   */
  static canLinkSteam(session: any): boolean {
    // Only PocketBase users can link Steam accounts
    return !!session?.user?.pocketbaseRecord && !this.hasSteamAccess(session);
  }

  /**
   * Check if user can unlink Steam account (PocketBase users with linked Steam only)
   */
  static canUnlinkSteam(session: any): boolean {
    // Only PocketBase users with linked Steam can unlink
    return !!session?.user?.pocketbaseRecord && 
           !!session?.user?.combinedLibraryData?.steam?.steamProfile;
  }

  /**
   * Get user type for display purposes
   */
  static getUserType(session: any): 'steam' | 'pocketbase' | 'pocketbase-steam' | 'unknown' {
    if (session?.user?.steam?.steamid && !session?.user?.pocketbaseRecord) {
      return 'steam';
    }
    
    if (session?.user?.pocketbaseRecord) {
      if (this.hasSteamAccess(session)) {
        return 'pocketbase-steam';
      }
      return 'pocketbase';
    }

    return 'unknown';
  }
}

// Export singleton-like static class
export const unifiedSteamService = UnifiedSteamService;