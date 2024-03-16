import { IGameOwned, ISteamGamesOwned, ISteamSpyGameData } from "@/types/steam"
import { useCallback, useEffect, useState } from "react"
import { getMostPlayedOwnedGames } from "../services"

type OwnedGameData = {
  mostPlayedData: ISteamSpyGameData | []; // Indicate missing data
  mostPlayedTime: IGameOwned | [];         // Indicate missing data
  ownedGames: ISteamSpyGameData[];
  error?: boolean;                          // Optional error flag
};

export const useGetOwnedGame = (ownedGames:ISteamGamesOwned):OwnedGameData =>{
    const [gameData, setGameData] = useState<OwnedGameData>({
    mostPlayedData: [],
    mostPlayedTime: [],
    ownedGames: []
})
    const getData = useCallback(async ()=>{
        try {
            if(!!ownedGames && ownedGames.games){
                const res = await fetch("api/getGameData", {
                    method:"POST", 
                      headers: { "content-type": "application/json" },
                    body:JSON.stringify(ownedGames)
                })
                const data = await res.json()
               setGameData(data)
            }
        } catch (error) {
            console.log(error)
        }
        
    }, [ownedGames])

    useEffect(()=>{
        getData()
    }, [getData])

    return gameData;
}