import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { ISteamAccount, ISteamGamesOwned, ISteamProfile } from '@/types/steam';
import { getMostPlayedOwnedGames } from '../../index';

/**
 * Steam JWT callback handler
 */
export const handleSteamJWT = (
  token: JWT,
  account: any,
  profile: any,
) => {
  if (account?.provider === 'steam' && profile) {
    token.steam = profile as ISteamProfile;
    token.account = account as unknown as ISteamAccount;
  }
  return token;
};

/**
 * Steam session callback handler
 */
export const handleSteamSession = async (
  session: Session,
  token: JWT & { steam?: ISteamProfile; account?: ISteamAccount },
): Promise<Session> => {
  try {
    // Ensure we have a Steam ID before making API calls
    if (!token.account?.steamId) {
      throw new Error('Steam ID not found in token');
    }

    // Fetch the user's owned games from Steam API
    const res = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_SECRET}&steamid=${token.account.steamId}`,
    );

    if (!res.ok) {
      throw new Error(`Steam API error: ${res.status} ${res.statusText}`);
    }

    const { response: gamesOwned }: { response: ISteamGamesOwned } =
      await res.json();

    // Process the games data to get most played games
    const data = await getMostPlayedOwnedGames(gamesOwned);

    // Add Steam profile and games data to the session
    if (token.steam) {
      session.user = {
        ...session.user,
        steam: token.steam,
        account: token.account,
        gamesLibraryData: data,
      };
    }

    return session;
  } catch (error) {
    // Return the session without the Steam data in case of error
    console.error('Steam session callback error:', error);
    return session;
  }
}; 