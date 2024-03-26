import { Session } from "next-auth";
import { IGamesOwned, ISteamAccount, ISteamGamesOwned, ISteamProfile } from "./steam";

declare module "next-auth" {
  interface Session {
    user: {
      // Propriedades existentes
      name: string;
      email?: string;
      image?: string;
      // Adicione suas propriedades personalizadas aqui
      username?: string;
      uid?: string;
      steam: ISteamProfile
      ownedgames: ISteamGamesOwned
      account: ISteamAccount
    }
  }
}