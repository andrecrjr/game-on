import { IAchievementsUser } from "@/types/steam";
import Image from "next/image";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
    indexGame:number;
    game: IAchievementsUser;
};

export const AchievementTableLine = ({game}: Props) => {
  return (
    <>
        {game.achievements.map(
            achievement=>
                <li key={achievement.displayName} className="w-20 mr-6">
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Image src={achievement.achieved ? achievement.icon : achievement.icongray} 
                            className={`${!achievement.achieved && "grayscale" || "" }`} width="80" height={80} alt={achievement.name}/>
                        </TooltipTrigger>
                         <TooltipContent className="duration-75">
                           <p className="font-bold"> {achievement.description}</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </li>
            )
        }
    </>
  )
};
