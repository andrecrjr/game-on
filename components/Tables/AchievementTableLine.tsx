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
                    <Image src={achievement.achieved ? achievement.icon : achievement.icongray} loading={indexGame > 3 ? "lazy" : "eager"} width="80" height={80} alt={achievement.name}/>
                </li>)
            }
  </>)
};
