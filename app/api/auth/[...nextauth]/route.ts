import { getMostPlayedOwnedGames } from '@/app/services';
import { ISteamGamesOwned } from '@/types/steam';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { AuthOptions, getServerSession } from 'next-auth';
import { PROVIDER_ID } from 'next-auth-steam'
import SteamProvider from 'next-auth-steam'
import type { NextRequest } from 'next/server'


export function getAuthOptions(req: NextApiRequest|undefined): AuthOptions {
    
    return {
        providers: req
            ? [
                SteamProvider(req, {
                    clientSecret: process.env.STEAM_SECRET!,
                    callbackUrl: 'http://localhost:3000/api/auth/callback',
                }),
            ]
            : [
            ],
        
        callbacks: {
            async jwt({ token, account, profile }) {
                if (account?.provider === PROVIDER_ID) {
                    token.steam = profile;
                    token.account = account
                }
                return token;
            },
            async session({ session, token }) {
                // @ts-expect-error
                const res = await fetch(` https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_SECRET}&steamid=${token.account.steamId}`)
                const {response:gamesOwned}:{response:ISteamGamesOwned} = await res.json()
                const data = await getMostPlayedOwnedGames(gamesOwned)
                if ('steam' in token) {
                    // @ts-expect-error
                    session.user.steam = token.steam;
                    // @ts-expect-error
                    session.user.account = token.account
                    session.user.gamesLibraryData = data
                }
                return session;
            },
        },
        debug:process.env.NODE_ENV !== "production",
        secret: process.env.NEXT_AUTH_SECRET
    };
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: { params: { nextauth: string[] }},
) {
    
    return NextAuth(req, res, getAuthOptions(req));
}

export {handler as GET, handler as POST}