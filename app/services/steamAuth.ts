import { NextApiRequest } from 'next';
import { AuthOptions } from 'next-auth';
import SteamProvider from 'next-auth-steam';

import { PROVIDER_ID } from 'next-auth-steam';
import { getMostPlayedOwnedGames } from '.';
import { ISteamGamesOwned } from '@/types/steam';

export function getAuthOptions(req: NextApiRequest|undefined): AuthOptions {
    
    return {
        providers: req
            ? [
                SteamProvider(req, {
                    clientSecret: process.env.STEAM_SECRET!,
                    callbackUrl: process.env.STEAM_CALLBACK_AUTH!,
                }),
            ]
            : [
            ],
        callbacks: {
            async jwt({ token, account, profile }) {
                if (account?.provider === PROVIDER_ID) {
                    token.steam = profile;
                    token.account = account;
                }
                return token;
            },
            async session({ session, token }) {
                // @ts-expect-error
                const res = await fetch(` https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_SECRET}&steamid=${token.account.steamId}`);
                const {response:gamesOwned}:{response:ISteamGamesOwned} = await res.json();
                const data = await getMostPlayedOwnedGames(gamesOwned);
                if ('steam' in token) {
                    // @ts-expect-error
                    session.user.steam = token.steam;
                    // @ts-expect-error
                    session.user.account = token.account;
                    session.user.gamesLibraryData = data;
                }
                return session;
            },
        },
        debug:process.env.NODE_ENV !== 'production',
        secret: process.env.NEXT_AUTH_SECRET
    };
}