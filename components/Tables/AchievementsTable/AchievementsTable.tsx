import React from 'react';
import { AchievementTableLine } from './AchievementTableLine';
import { IAchievementsUser } from '@/types/steam';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  achievements: IAchievementsUser[];
}

const AchievementsTable = async ({ achievements }: Props) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Your Achievements</h2>
      {achievements.filter(item=>item!==null).map((game) => (
        <Card key={game.gameName} className="shadow-lg border-t-4 border-t-primary overflow-hidden transition-all duration-300 hover:shadow-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-background to-background/50">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <Link
                href={`/game/${game.gameId}`}
                className="text-xl font-bold hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                {game.gameName}
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-2 w-full sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${(game.completedCount / game.achievements.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                  {game.completedCount}/{game.achievements.length}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="carousel-container flex min-h-[314px] ">
              <AchievementTableLine game={game} indexGame={0} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AchievementsTable;
