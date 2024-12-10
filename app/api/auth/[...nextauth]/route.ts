import { getAuthOptions } from '@/app/services/steamAuth';
import { NextRequest, NextResponse } from 'next/server';

import NextAuth from 'next-auth';
import { NextApiRequest } from 'next';

async function handler(req: NextRequest | NextApiRequest, res: NextResponse) {
  //@ts-ignore
  return NextAuth(req, res, getAuthOptions(req));
}

export { handler as GET, handler as POST };
