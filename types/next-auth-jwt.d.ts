import { ISteamAccount, ISteamProfile } from './steam';

declare module 'next-auth/jwt' {
  interface JWT {
    steam?: ISteamProfile;
    account?: ISteamAccount;
  }
}