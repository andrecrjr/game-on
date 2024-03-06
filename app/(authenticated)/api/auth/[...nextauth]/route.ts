import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { PROVIDER_ID } from 'next-auth-steam'
import SteamProvider from 'next-auth-steam'

const handler = (req:NextApiRequest, res:NextApiResponse) =>{
    console.log(req)
  return NextAuth(req, res, {
    providers: [
      SteamProvider(req, {
        clientSecret: process.env.STEAM_SECRET!,
        callbackUrl: 'http://localhost:3000/api/auth/callback/steam'
      })
    ],
    secret:process.env.NEXT_AUTH_SECRET,
    debug:true
  })

} 

export {handler as GET, handler as POST}