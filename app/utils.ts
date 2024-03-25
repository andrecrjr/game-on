import { IGameOwned, ISteamGamesOwned, ISteamSpyGameData } from "@/types/steam";

export const STEAM_API_ROUTE = `${process.env.STEAM_ROUTE}`
export const imageGameSteam = (appid:number, type="capsule") =>{
    if(type==="header"){
        return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`
    }
    return `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_184x69.jpg`
}

export function convertTiming(minutos:number) {
  const segundos = minutos * 60;
  const d = Math.floor(segundos / (24 * 3600));
  const hRestantes = segundos % (24 * 3600);
  const h = Math.floor(hRestantes / 3600);
  const mRestantes = hRestantes % 3600;
  const m = Math.floor(mRestantes / 60);
  const s = mRestantes % 60;

  return `${d}d ${h}h ${m}m`;
}

export function convertCentsToDols(cents:number) {
  const dolares = (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
  return dolares;
}