import { NextRequest } from 'next/server';
import Steam, { STEAM_PROVIDER_ID } from 'next-auth-steam';
import { ISteamAccount, ISteamProfile } from '@/types/steam';

/**
 * Steam authentication provider configuration
 */
export const getSteamProvider = (req?: NextRequest) => {
  return Steam(req as NextRequest, {
    clientSecret: process.env.STEAM_SECRET!,
    callbackUrl: process.env.STEAM_CALLBACK_AUTH!,
  });
};

/**
 * Steam provider constants
 */
export const STEAM_PROVIDER = {
  id: STEAM_PROVIDER_ID,
  name: 'Steam',
} as const;

/**
 * Steam JWT callback handler
 */
export const handleSteamJWT = (
  token: any,
  account: any,
  profile: any,
) => {
  if (account?.provider === STEAM_PROVIDER_ID && profile) {
    token.steam = profile as ISteamProfile;
    token.account = account as unknown as ISteamAccount;
  }
  return token;
}; 