
import React from "react";

import Image from "next/image";
import { getUserAchievement } from "@/app/services";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { AchievementTableLine } from "./AchievementTableLine";



const AchievementsTable = async () => {
    const session = await getServerSession(getAuthOptions(undefined))
    const data = await getUserAchievement(session?.user?.gamesLibraryData.ownedGames||[], session?.user.steam.steamid || "")

    return (
    <>
        {data.map((game, indexGame)=>{
            return (
            <section key={game.gameName}>  
            {game.gameName} - <strong>{game.completedCount}/{game.achievements.length}</strong>
            <section className=" overflow-x-scroll mb-8">
                <ul className="list-none flex w-fit">
                    <AchievementTableLine game={game} indexGame={indexGame}/>
                </ul>
            </section>
            </section>)
        })
        }
        </>
    )
};

export default AchievementsTable