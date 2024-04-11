import { IAchievementsUser } from "@/types/steam";
import Image from "next/image";
import React from "react";

type Props = {
    indexGame:number;
    game: IAchievementsUser;
};

export const AchievementTableLine = ({game, indexGame}: Props) => {
  return (<>
        {game.achievements.map(achievement=>
            <li key={achievement.displayName} className="w-20 mr-6">
                <div className="relative group">
                    <Image src={achievement.achieved ? achievement.icon : achievement.icongray} 
                    className={`${!achievement.achieved && "grayscale" || "" }`} width="80" height={80} alt={achievement.name}/>
                     <p className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{achievement.description}</p>
                </div>
            </li>)
        }
  </>)
};
