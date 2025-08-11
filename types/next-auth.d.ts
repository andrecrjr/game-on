import { ISteamAccount, ISteamGamesOwned, ISteamProfile } from './steam';
import { CombinedLibraryData } from './xbox';
import { IPocketBaseUser } from './pocketbase';

declare module 'next-auth' {
  interface Session {
    user: {
      // Common properties for all user types
      name: string;
      email?: string;
      image?: string;
      
      // Steam-specific properties
      username?: string;
      uid?: string;
      steam?: ISteamProfile;
      gamesLibraryData?: {
        mostPlayedData: any;
        mostPlayedTime: any;
        ownedGames: any[];
      };
      combinedLibraryData?: CombinedLibraryData;
      achievements?: object;
      account?: ISteamAccount;
      
      // PocketBase-specific properties
      pocketbaseToken?: string;
      pocketbaseRecord?: any;
    };
  }
}
