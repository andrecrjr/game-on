import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { AuthOptions } from 'next-auth';
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
                }
                return token;
            },
            async session({ session, token }) {
                if ('steam' in token) {
                    // @ts-expect-error
                    session.user.steam = token.steam;
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