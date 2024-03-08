import { IGameOwned, ISteamGamesOwned, ISteamSpyGameData } from "@/types/steam";

export const STEAM_API_ROUTE = `${process.env.STEAM_ROUTE}`
export const imageGameSteam = (appid:number, type="capsule") =>{
    if(type==="header"){
        return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`
    }
    return `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_184x69.jpg`
}

export const getMostPlayedOwnedGames = async (data:ISteamGamesOwned):Promise<{mostPlayedData:ISteamSpyGameData; mostPlayedTime:IGameOwned}> => {
    
    const mostPlayedTime:IGameOwned = data.games.reduce((prev, curr)=>{
        return (prev.playtime_forever > curr.playtime_forever) ? prev : curr;
    })
    
    const mostPlayedData = await getGameData(mostPlayedTime.appid)

    return {mostPlayedData, mostPlayedTime}
}

export const getGameData = async(appid:number):Promise<ISteamSpyGameData> =>{
    const res = await fetch(`${process.env.STEAMSPY_ROUTE}?request=appdetails&appid=${appid}`)
    const data = await res.json()
    
    return {...data, avatarCapsule:imageGameSteam(appid), avatarHeader:imageGameSteam(appid, "header")};
}

export function convertTiming(minutos:number) {
  const segundos = minutos * 60;
  const d = Math.floor(segundos / (24 * 3600));
  const hRestantes = segundos % (24 * 3600);
  const h = Math.floor(hRestantes / 3600);
  const mRestantes = hRestantes % 3600;
  const m = Math.floor(mRestantes / 60);
  const s = mRestantes % 60;

  return `${d}d ${h}h ${m}m ${s}s`;
}