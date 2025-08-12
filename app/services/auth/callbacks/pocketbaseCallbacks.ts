import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { IPocketBaseUser } from '@/types/pocketbase';
import { CombinedLibraryData } from '@/types/xbox';
import { steamLinkService } from '../../steamLinkService';
import { xboxLiveService } from '../../xboxLiveService';

/**
 * Get combined library data for PocketBase users (Steam + Microsoft/Xbox)
 */
const getPocketBaseCombinedLibraryData = async (
  pocketbaseUserId: string,
): Promise<CombinedLibraryData> => {
  try {
    // Fetch both Steam and Xbox data in parallel
    const [steamLibrary, xboxLibrary] = await Promise.allSettled([
      steamLinkService.getSteamLibraryData(pocketbaseUserId),
      xboxLiveService.getXboxAchievementsData(pocketbaseUserId),
    ]);

    return {
      steam:
        steamLibrary.status === 'fulfilled'
          ? steamLibrary.value
          : {
              mostPlayedData: null,
              mostPlayedTime: null,
              ownedGames: [],
            },
      xbox:
        xboxLibrary.status === 'fulfilled'
          ? xboxLibrary.value
          : {
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
  } catch (error) {
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
      // Get combined library data (including Steam + Microsoft/Xbox data if linked)
      const combinedLibraryData = await getPocketBaseCombinedLibraryData(
        token.pocketbase.pocketbaseRecord?.id || token.pocketbase.username,
      );

      session.user = {
        ...session.user,
        name: token.pocketbase.name || token.pocketbase.username, // Use username as fallback if name is not provided
        email: token.pocketbase.email,
        username: token.pocketbase.username,
        pocketbaseToken: token.pocketbase.pocketbaseToken,
        pocketbaseRecord: token.pocketbase.pocketbaseRecord,
        // Maintain backward compatibility with gamesLibraryData (Steam data)
        gamesLibraryData: combinedLibraryData.steam || {
          mostPlayedData: null,
          mostPlayedTime: null,
          ownedGames: [],
        },
        // New combined library data
        combinedLibraryData,
      };
    }

    return session;
  } catch (error) {
    console.error('PocketBase session callback error:', error);
    return session;
  }
};
