
import React from "react";


import { AchievementTableLine } from "./AchievementTableLine";
import { IAchievementsUser } from "@/types/steam";

interface Props {
    achievements: IAchievementsUser[]
}

const AchievementsTable = async ({achievements}:Props) => {

    return (
    <>
        {achievements.map(
            (game, indexGame)=>{
                return (
                    <section key={game.gameName} >  
                        <p>{game.gameName}</p><span className="font-bold"> - {game.completedCount}/{game.achievements.length}</span>
                        <section className="overflow-hidden h-[100px] mb-8  overflow-x-scroll">
                            <ul className="list-none flex w-fit">
                                <AchievementTableLine game={game} indexGame={indexGame}/>
                            </ul>
                        </section>
                    </section>)
                }   
            )
        }
        </>
    )
};

export default AchievementsTable