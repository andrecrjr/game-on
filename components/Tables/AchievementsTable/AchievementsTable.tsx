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
    <div className="space-y-6">
      {achievements.map((game) => (
        <Card key={game.gameName} className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <Link
                href={`/game/${game.gameId}`}
                className="text-lg hover:text-primary transition-colors"
              >
                {game.gameName}
              </Link>
              <span className="text-sm bg-primary/10 px-3 py-1 rounded-full">
                {game.completedCount}/{game.achievements.length} completed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="carousel-container min-h-[140px]">
              <AchievementTableLine game={game} indexGame={0} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AchievementsTable;
