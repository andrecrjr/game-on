import { IAchievementsUser } from '@/types/steam';
import Image from 'next/image';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
    indexGame:number;
    game: IAchievementsUser;
};

export const AchievementTableLine = ({game}: Props) => {
  return (
    <>
        {game.achievements.map(
            achievement=>
                <li key={achievement.displayName} className="w-20 mr-6 relative">
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <img src={achievement.achieved ? achievement.icon : achievement.icongray} 
                              className={`${!achievement.achieved && 'grayscale contrast-50' || 'contrast-100' }`} 
                              width="80" height={80} alt={achievement.name}/>
                        </TooltipTrigger>
                         <TooltipContent>
                          <section className="p-3">
                            <p className="text-center font-bold pb-2">{achievement.achieved ? 'Unlocked' : 'Locked'}</p>
                            <p className="font-bold "> {achievement.description}</p>
                           </section>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </li>
            )
        }
    </>
  );
};
