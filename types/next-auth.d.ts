import {
  IGameOwned,
  ISteamAccount,
  ISteamProfile,
  ISteamSpyGameData,
} from './steam';

declare module 'next-auth' {
  interface Session {
    user: {
      // Propriedades existentes
      name: string;
      email?: string;
      image?: string;
      // Adicione suas propriedades personalizadas aqui
      username?: string;
      uid?: string;
      steam: ISteamProfile;
      gamesLibraryData: {
        mostPlayedData: ISteamSpyGameData;
        mostPlayedTime: IGameOwned;
        ownedGames: ISteamSpyGameData[];
      };
      achievements: object;
      account: ISteamAccount;
    };
  }
}
