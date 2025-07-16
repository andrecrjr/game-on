import { NextRequest } from 'next/server';
import { Account, AuthOptions, Profile, Session, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import { ISteamAccount, ISteamProfile } from '@/types/steam';
import { handleSteamSession } from './callbacks/steamCallbacks';
import { getAzureProvider, getSteamProvider } from './providers';

/**
 * Centralized authentication service
 * Manages all authentication providers and callbacks
 */
export class AuthService {
  /**
   * Get all authentication providers
   */
  static getProviders(req?: NextRequest) {
    return [getSteamProvider(req), getAzureProvider()];
  }

  /**
   * Handle JWT token processing for all providers
   */
  static handleJWT({
    token,
    user,
    account,
    profile,
    trigger,
    isNewUser,
    session,
  }: {
    token: JWT;
    user: User | AdapterUser;
    account: Account | null;
    profile?: Profile | undefined;
    trigger?: 'signIn' | 'signUp' | 'update';
    isNewUser?: boolean;
    session?: any;
  }) {
    // Handle Steam JWT
    if (account?.provider === 'steam' && profile) {
      token.steam = profile as ISteamProfile;
      token.account = account as unknown as ISteamAccount;
    }

    // Handle Azure JWT (if needed in the future)
    // if (account?.provider === 'azure-ad' && profile) {
    //   token.azure = profile;
    //   token.account = account;
    // }

    return token;
  }

  /**
   * Handle session processing for all providers
   */
  static async handleSession({
    session,
    token,
  }: {
    session: Session;
    token: JWT & { steam?: any; account?: any };
  }) {
    // Handle Steam session
    if (token.steam) {
      return await handleSteamSession(session, token);
    }

    // Handle Azure session (if needed in the future)
    // if (token.azure) {
    //   return await handleAzureSession(session, token);
    // }

    return session;
  }

  /**
   * Get complete authentication options
   */
  static getAuthOptions(req?: NextRequest): AuthOptions {
    return {
      providers: this.getProviders(req),
      callbacks: {
        jwt: this.handleJWT,
        session: this.handleSession,
      },
      debug: process.env.NODE_ENV !== 'production',
      secret: process.env.NEXT_AUTH_SECRET,
    };
  }
}
