import { ISteamAccount, ISteamGamesOwned, ISteamProfile } from './steam';
import { CombinedLibraryData } from './xbox';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      email?: string;
      image?: string;
      username?: string;
      uid?: string;
      steam: ISteamProfile;
      gamesLibraryData: {
        mostPlayedData: any;
        mostPlayedTime: any;
        ownedGames: any[];
      };
      combinedLibraryData?: CombinedLibraryData;
      achievements: object;
      account: ISteamAccount;
    };
  }
}
