import { IGameOwned, ISteamGamesOwned, ISteamSpyGameData } from "@/types/steam";
import { imageGameSteam } from "../utils";

export const getMostPlayedOwnedGames = async (data:ISteamGamesOwned):Promise<{mostPlayedData:ISteamSpyGameData; mostPlayedTime:IGameOwned}> => {
    
    const mostPlayedTime:IGameOwned = data?.games?.reduce((prev, curr)=>{
        return (prev.playtime_forever > curr.playtime_forever) ? prev : curr;
    }) || []
    
    const mostPlayedData = await getGameData(mostPlayedTime.appid)

    return {mostPlayedData, mostPlayedTime}
}

export const getGameData = async(appid:number):Promise<ISteamSpyGameData> =>{
    const res = await fetch(`${process.env.STEAMSPY_ROUTE}?request=appdetails&appid=${appid}`, { next: { revalidate: 8000 } })
    const data = await res.json()
    
    return {...data, avatarCapsule:imageGameSteam(appid), avatarHeader:imageGameSteam(appid, "header")};
}
