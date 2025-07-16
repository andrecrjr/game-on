import { NextRequest } from 'next/server';
import { AuthOptions } from 'next-auth';
import { AuthService } from './auth';

/**
 * Get authentication options for NextAuth
 * @param req Optional NextRequest object from the App Router
 * @returns AuthOptions configuration for NextAuth
 */
export function getAuthOptions(req?: NextRequest): AuthOptions {
  return AuthService.getAuthOptions(req);
}

// Re-export for backward compatibility
export { AuthService } from './auth';
