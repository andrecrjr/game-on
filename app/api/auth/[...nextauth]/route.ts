import { ISteamAccount, ISteamProfile } from '@/types/steam';
import NextAuth from 'next-auth';
import Steam from 'next-auth-steam';
import type { NextRequest } from 'next/server';

/**
 * NextAuth handler for App Router
 * This implementation follows the next-auth-steam documentation
 */
async function auth(
  req: NextRequest,
  ctx: {
    params: {
      nextauth: string[]
    }
  }
) {
  return NextAuth(req, ctx, {
    providers: [
      Steam(req, {
        clientSecret: process.env.STEAM_SECRET!,
        callbackUrl: process.env.STEAM_CALLBACK_AUTH!
      })
    ],
    callbacks: {
      async jwt({ token, account, profile }) {
        // Store the Steam profile and account info in the token
        if (account?.provider === 'steam') {
          token.steam = profile as ISteamProfile;
          token.account = account as unknown as ISteamAccount;
        }
        return token;
      },
      async session({ session, token }) {
        try {
          // Ensure we have a Steam ID before making API calls
          if (!token.account?.steamId) {
            console.error('Steam ID not found in token');
            return session;
          }

          // Fetch the user's owned games from Steam API
          const res = await fetch(
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_SECRET}&steamid=${token.account.steamId}`,
          );

          if (!res.ok) {
            throw new Error(`Steam API error: ${res.status} ${res.statusText}`);
          }

          const { response: gamesOwned } = await res.json();
          
          // Process the games data to get most played games
          const { getMostPlayedOwnedGames } = await import('@/app/services');
          const data = await getMostPlayedOwnedGames(gamesOwned);

          // Add Steam profile and games data to the session
          if (token.steam) {
            session.user = {
              ...session.user,
              steam: token.steam,
              account: token.account,
              gamesLibraryData: data
            };
          }
          
          return session;
        } catch (error) {
          console.error('Error in session callback:', error);
          // Return the session without the Steam data in case of error
          return session;
        }
      },
    },
    debug: process.env.NODE_ENV !== 'production',
    secret: process.env.NEXT_AUTH_SECRET,
  });
}

// Export the handler functions for GET and POST requests
export { auth as GET, auth as POST };
