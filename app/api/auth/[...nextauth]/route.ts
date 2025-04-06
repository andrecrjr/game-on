import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { getAuthOptions } from '@/app/services/steamAuth';

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
  return NextAuth(req, ctx, getAuthOptions(req))
}

// Export the handler functions for GET and POST requests
export { auth as GET, auth as POST };
