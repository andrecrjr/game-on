import { getAuthOptions } from '@/app/services/steamAuth';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';


async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: { params: { nextauth: string[] }},
) {
    
    return NextAuth(req, res, getAuthOptions(req));
}

export {handler as GET, handler as POST}