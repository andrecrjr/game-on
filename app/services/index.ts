import { IAchievementsPaginated, IAchievementsUser, IGameNewsRoot, IGameOwned, IPlayerStatsRoot, IPlayerstats, IRecentlyPlayedRoot, ISteamGamesOwned, ISteamSpyGameData, TrendingGamePageType } from "@/types/steam";
import { allSettleHandler, convertCentsToDols, imageGameSteam } from "../utils";
import { fetchData, getStatsToAchievements, spyRoute, steamKey, steamRoute } from "./utils";
import { isNull } from "util";

export const getMostPlayedOwnedGames = async (data:ISteamGamesOwned|undefined):Promise<{
    mostPlayedData:ISteamSpyGameData; 
    mostPlayedTime:IGameOwned
    ownedGames:ISteamSpyGameData[] }> => {
        if(!data){
            throw new Error("Problem to get data")
        }
        const mostPlayedTime:IGameOwned = data?.games?.reduce((prev, curr)=>{
            return (prev.playtime_forever > curr.playtime_forever) ? prev : curr;
        }) || []
        const ownedGames:ISteamSpyGameData[] = data.games && await Promise.all<ISteamSpyGameData>(data.games.map(game=>{
            return getGameData(game.appid)
        }))
        const mostPlayedData = await getGameData(mostPlayedTime.appid)
        const responseData = {mostPlayedData, mostPlayedTime, ownedGames}
        return responseData
}

export const getGameData = async(appid:number):Promise<ISteamSpyGameData> =>{
    
    const data = await fetchData<ISteamSpyGameData>(`${spyRoute}?request=appdetails&appid=${appid}`, { next: { revalidate: 8000 } })
    return {...data, 
            avatarCapsule:imageGameSteam(appid), 
            avatarHeader:imageGameSteam(appid, "header"),
            price: data.price === "0" ? "Free" : convertCentsToDols(Number(data.price)) 
        };
}

export const getAllGameData = async(appId:number, options:{getNews:boolean}={getNews:true}):Promise<{gameData:ISteamSpyGameData, 
    gameNews:IGameNewsRoot|null}> =>{
    const gameAllData= await Promise.allSettled([getGameData(appId), 
         options.getNews ?  fetchData<IGameNewsRoot>(`${steamRoute}ISteamNews/GetNewsForApp/v0002/?appid=${appId}&count=15&maxlength=1000&format=json`,  
                    { next: { revalidate: 90000 } }
                ) : null
    ])
    const data = allSettleHandler<ISteamSpyGameData,IGameNewsRoot|null>(gameAllData)
    const dataNews = options.getNews ? data[1] as IGameNewsRoot : null;
    const gameData = data[0] as ISteamSpyGameData
    return {gameNews:dataNews, gameData:gameData};
}

export const getRecentlyPlayedGames = async(steamUserId:string):Promise<IRecentlyPlayedRoot> =>{
    const data = await fetchData<IRecentlyPlayedRoot>(`${steamRoute}IPlayerService/GetRecentlyPlayedGames/v0001/?key=${steamKey}&steamid=${steamUserId}&format=json`, { next: { revalidate: 90000 } })
    return data
}

export const getUserAchievementPaginated = async (gamesOwned:ISteamSpyGameData[],
    steamUserId:string,
    pageNumber: number = 1,
    pageSize: number = 9,
    ):Promise<IAchievementsPaginated> =>{

    if(!gamesOwned){
          throw new Error("Problem to get user stats achievement")
    }
    
    const totalPages = Math.ceil(gamesOwned.length / pageSize);

    const currentPageGames = gamesOwned.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    const achievementsDataSettled = await Promise.allSettled(currentPageGames.map(async(item)=>{
        const url = `${steamRoute}ISteamUserStats/GetPlayerAchievements/v0001/?appid=${item.appid}&key=${steamKey}&steamid=${steamUserId}`
        const data = await fetchData<IPlayerStatsRoot>(url,  { next: { revalidate: 10000 }} )
        const achievementsData = await getStatsToAchievements(data.playerstats.achievements, item.appid)
        const achievementCountCompleted = achievementsData.filter(gameAchievement=>gameAchievement.achieved).length
        return {achievements:achievementsData, gameName:data.playerstats.gameName, completedCount:achievementCountCompleted, gameId:item.appid};
    }))
    
    const achievementsFullfiled = allSettleHandler(achievementsDataSettled) as IAchievementsUser[]
    return {achievements:achievementsFullfiled, currentPage:pageNumber, totalPages}
}


export const getTrendingGamesRanked = async (rank="top100in2weeks"): Promise<ISteamSpyGameData[]> =>{
    const data = await fetchData<TrendingGamePageType>(`${spyRoute}?request=${rank}`)
    console.log(data)
    const dataArr = Object.keys(data)
    const allGameTrendDataSettled = await Promise.allSettled(dataArr.map((item:string)=>{
        const data = getAllGameData(parseInt(item), {getNews:false})
        return data;
    }));
    const handledData = allSettleHandler(allGameTrendDataSettled).map(item=>item?.gameData) as ISteamSpyGameData[];
    return handledData;
}

