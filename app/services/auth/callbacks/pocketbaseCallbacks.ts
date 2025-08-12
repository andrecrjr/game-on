import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { IPocketBaseUser } from '@/types/pocketbase';
import { CombinedLibraryData } from '@/types/xbox';
import { xboxLiveService } from '../../xboxLiveService';

/**
 * Get combined library data for PocketBase users (Microsoft/Xbox only)
 */
const getPocketBaseCombinedLibraryData = async (
  pocketbaseUserId: string,
): Promise<CombinedLibraryData> => {
  try {
    console.log('pocketbaseUserId', pocketbaseUserId);
    // For PocketBase users, we only fetch Xbox data using their PocketBase ID
    const xboxLibrary =
      await xboxLiveService.getXboxAchievementsData(pocketbaseUserId);

    return {
      steam: {
        mostPlayedData: null,
        mostPlayedTime: null,
        ownedGames: [],
      },
      xbox: xboxLibrary,
    };
  } catch (error) {
    console.error('Failed to get PocketBase combined library data:', error);
    return {
      steam: {
        mostPlayedData: null,
        mostPlayedTime: null,
        ownedGames: [],
      },
      xbox: {
        profile: {
          id: '',
          gamertag: '',
          gamerpic: '',
          gamerScore: 0,
        },
        achievements: [],
        totalGamerscore: 0,
        totalAchievements: 0,
      },
    };
  }
};

/**
 * PocketBase JWT callback handler
 */
export const handlePocketBaseJWT = (
  token: JWT,
  user: IPocketBaseUser,
  account: any,
) => {
  if (account?.provider === 'pocketbase' && user) {
    token.pocketbase = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name || user.username, // Use username as fallback if name is not provided
      emailVerified: user.emailVerified,
      pocketbaseToken: user.pocketbaseToken,
      pocketbaseRecord: user.pocketbaseRecord,
    };
    token.account = account;
  }
  return token;
};

/**
 * PocketBase session callback handler
 */
export const handlePocketBaseSession = async (
  session: Session,
  token: JWT & { pocketbase?: IPocketBaseUser; account?: any },
): Promise<Session> => {
  try {
    // Add PocketBase user data to the session
    if (token.pocketbase) {
      session.user = {
        ...session.user,
        name: token.pocketbase.name || token.pocketbase.username, // Use username as fallback if name is not provided
        email: token.pocketbase.email,
        username: token.pocketbase.username,
        pocketbaseToken: token.pocketbase.pocketbaseToken,
        pocketbaseRecord: token.pocketbase.pocketbaseRecord,
        // Initialize empty game library data for ACJR users (Steam-specific)
        gamesLibraryData: {
          mostPlayedData: null,
          mostPlayedTime: null,
          ownedGames: [],
        },
        // Get combined library data (including Microsoft/Xbox data if linked)
        combinedLibraryData: await getPocketBaseCombinedLibraryData(
          token.pocketbase.pocketbaseRecord?.id || token.pocketbase.username,
        ),
      };
    }

    return session;
  } catch (error) {
    console.error('PocketBase session callback error:', error);
    return session;
  }
};
