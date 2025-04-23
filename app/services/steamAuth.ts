import Steam, { PROVIDER_ID, STEAM_PROVIDER_ID } from 'next-auth-steam';
import { NextRequest } from 'next/server';
import { JWT } from 'next-auth/jwt';
import { Account, AuthOptions, Profile, Session, User } from 'next-auth';
import { getMostPlayedOwnedGames } from '.';
import { ISteamAccount, ISteamGamesOwned, ISteamProfile } from '@/types/steam';
import { AdapterUser } from 'next-auth/adapters';

/**
 * Get authentication options for NextAuth
 * @param req Optional NextRequest object from the App Router
 * @returns AuthOptions configuration for NextAuth
 */
export function getAuthOptions(req?: NextRequest): AuthOptions {
	return {
		providers: [
			Steam(req as NextRequest, {
				clientSecret: process.env.STEAM_SECRET!,
				callbackUrl: process.env.STEAM_CALLBACK_AUTH!,
			}),
		],
		callbacks: {
			async jwt({
				token,
				user,
				account,
				profile,
				trigger,
				isNewUser,
				session,
			}: {
				token: JWT;
				user: User | AdapterUser;
				account: Account | null;
				profile?: Profile | undefined;
				trigger?: 'signIn' | 'signUp' | 'update';
				isNewUser?: boolean;
				session?: any;
			}) {
				// Store the Steam profile and account info in the token
				if (account?.provider === STEAM_PROVIDER_ID && profile) {
					token.steam = profile as ISteamProfile;
					token.account = account as unknown as ISteamAccount;
				}
				return token;
			},
			async session({
				session,
				token,
			}: {
				session: Session;
				token: JWT & { steam?: ISteamProfile; account?: ISteamAccount };
			}) {
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
					return session;
				}
			},
		},
		debug: process.env.NODE_ENV !== 'production',
		secret: process.env.NEXT_AUTH_SECRET,
	};
}
