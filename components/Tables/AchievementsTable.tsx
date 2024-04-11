
import React from "react";


import { AchievementTableLine } from "./AchievementTableLine";
import { IAchievementsUser } from "@/types/steam";

interface Props {
    achievements: IAchievementsUser[]
}

const AchievementsTable = async ({achievements}:Props) => {

    return (
    <>
        {achievements.map((game, indexGame)=>{
            return (
            <section key={game.gameName}>  
            {game.gameName} - <strong>{game.completedCount}/{game.achievements.length}</strong>
            <section className="overflow-x-scroll overflow-y-hidden h-[100px] mb-8">
                <ul className="list-none flex w-fit ">
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