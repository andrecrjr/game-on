import { IAchievementGameUser, IAchievementStatsUser, IGameSchemaRoot } from "@/types/steam"

export const spyRoute = (process.env.STEAMSPY_ROUTE || process.env.NEXT_PUBLIC_STEAMSPY_ROUTE)
export const steamRoute = (process.env.STEAM_ROUTE || process.env.NEXT_PUBLIC_STEAM_ROUTE)
export const steamKey = (process.env.STEAM_SECRET||process.env.NEXT_PUBLIC_STEAM_SECRET)


export async function fetchData<G>(url:string , params?:object):Promise<G>{
    const res = await fetch(url, params)
    const data = await res.json() as Promise<G>
    return data
}


export async function getStatsToAchievements(achievementData:IAchievementStatsUser[], 
                                                gameId:number):Promise<IAchievementGameUser[]>{
    const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=${steamKey}&appid=${gameId}&l=english&format=json`

    const data = await fetchData<IGameSchemaRoot>(url, { next: { revalidate: 10000 }})
    const achievements = data.game.availableGameStats.achievements.map((gameSchema)=>{
        const {unlocktime, achieved} = achievementData.filter(game=> game.apiname === gameSchema.name)[0]
        return {...gameSchema, unlocktime, achieved}

    }).filter(item=>item!==undefined)
    return achievements
}