import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/app/services/steamAuth';

// Define the type for the context object, including params
interface RouteContext {
  params: Promise<{
    nextauth: string[]; // Or string, depending on your dynamic route
  }>;
}
/**
 * NextAuth handler for App Router
 * This implementation follows the next-auth-steam documentation
 */
async function auth(
  req: NextRequest,
  ctx: RouteContext,
) {
  
  return NextAuth(req, ctx, getAuthOptions(req));
}

// Export the handler functions for GET and POST requests
export { auth as GET, auth as POST };
