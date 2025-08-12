import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import PocketBase from 'pocketbase';
import { ISteamAccount, ISteamGamesOwned, ISteamProfile } from '@/types/steam';
import { getCombinedLibraryData } from '../../index';

/**
 * Store Steam access token in PocketBase
 */
async function storeSteamAccessToken(steamId: string, accessToken: string, accountData: any) {
  try {
    const pb = new PocketBase(process.env.POCKETBASE_URL!);
    
    // Authenticate as admin
    await pb.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_USER!,
      process.env.PB_ADMIN_PASS!
    );
    
    // Find existing record or create new one
    let existingRecord;
    try {
      existingRecord = await pb.collection('linked_accounts_gameon')
        .getFirstListItem(`provider_id="${steamId}" && provider="steam"`);
    } catch (e) {
      // No existing record found
      existingRecord = null;
    }
    
    // Prepare the data to store
    const credentials = existingRecord?.credentials ? 
      JSON.parse(existingRecord.credentials) : {};
    
    // Add access token to credentials
    credentials.access_token = accessToken;
    credentials.account_data = accountData;
    
    const recordData = {
      ...(existingRecord || {}),
      provider_id: steamId,
      provider: 'steam',
      credentials: JSON.stringify(credentials),
      token_updated_at: new Date().toISOString(),
      is_active: true,
      is_verified: true
    };
    
    if (existingRecord) {
      // Update existing record
      await pb.collection('linked_accounts_gameon')
        .update(existingRecord.id, recordData);
    } else {
      // Create new record
      await pb.collection('linked_accounts_gameon')
        .create(recordData);
    }
  } catch (error) {
    console.error('Failed to store Steam access token:', error);
  }
}

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
    
    // Store the access token in PocketBase if available
    if (account.access_token) {
      storeSteamAccessToken(profile.steamid, account.access_token, account);
    }
  }
  return token;
};

/**
 * Steam session callback handler with Xbox integration
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

    // Get combined library data (Steam + Xbox if linked)
    const combinedData = await getCombinedLibraryData(gamesOwned, token.account.steamId);

    // Add Steam profile and combined games data to the session
    if (token.steam) {
      session.user = {
        ...session.user,
        name: token.steam.personaname,
        username: token.steam.personaname,
        steam: token.steam,
        account: token.account,
        gamesLibraryData: combinedData.steam || { mostPlayedData: null as any, mostPlayedTime: null as any, ownedGames: [] }, // Keep backward compatibility
        combinedLibraryData: combinedData, // New combined data
      };
    }

    return session;
  } catch (error) {
    // Return the session without the Steam data in case of error
    console.error('Steam session callback error:', error);
    return session;
  }
}; 