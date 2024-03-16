import { IGameOwned, ISteamGamesOwned, ISteamSpyGameData } from "@/types/steam";
import { imageGameSteam } from "../utils";

const spyRoute = (process.env.STEAMSPY_ROUTE || process.env.NEXT_PUBLIC_STEAMSPY_ROUTE)

export const getMostPlayedOwnedGames = async (data:ISteamGamesOwned):Promise<{
    mostPlayedData:ISteamSpyGameData; 
    mostPlayedTime:IGameOwned;
    ownedGames:ISteamSpyGameData[] }> => {
    const mostPlayedTime:IGameOwned = data?.games?.reduce((prev, curr)=>{
        return (prev.playtime_forever > curr.playtime_forever) ? prev : curr;
    }) || []

    const ownedGames:ISteamSpyGameData[] = await Promise.all<ISteamSpyGameData>(data.games.map(game=>{
        return getGameData(game.appid)
    }))
    const mostPlayedData = await getGameData(mostPlayedTime.appid)
    const responseData = {mostPlayedData, mostPlayedTime, ownedGames}
    return responseData
}

export const getGameData = async(appid:number):Promise<ISteamSpyGameData> =>{
    
    const res = await fetch(`${spyRoute}?request=appdetails&appid=${appid}`, { next: { revalidate: 8000 } })
    const data = await res.json()
    
    return {...data, avatarCapsule:imageGameSteam(appid), avatarHeader:imageGameSteam(appid, "header")};
}
