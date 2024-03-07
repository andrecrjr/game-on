import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { AuthOptions } from 'next-auth';
import { PROVIDER_ID } from 'next-auth-steam'
import SteamProvider from 'next-auth-steam'
import type { NextRequest } from 'next/server'

export function getAuthOptions(req: NextRequest): AuthOptions {
    return {
        providers: req
            ? [
                SteamProvider(req, {
                    clientSecret: process.env.STEAM_SECRET!,
                    callbackUrl: 'http://localhost:3000/api/auth/callback',
                }),
            ]
            : [],
        callbacks: {
            jwt({ token, account, profile }) {
                if (account?.provider === PROVIDER_ID) {
                    token.steam = profile;
                }
                return token;
            },
            session({ session, token }) {
                console.log(token, session)
                if ('steam' in token) {
                    // @ts-expect-error
                    session.user.steam = token.steam;
                    console.log("ssss",session.user)
                }
                return session;
            },
        },
    };
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: { params: { nextauth: string[] }},
) {
    // @ts-expect-error
    return NextAuth(req, res, getAuthOptions(req));
}

export {handler as GET, handler as POST}