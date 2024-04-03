import React from "react";

import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserAchievement } from "@/app/services";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

type Props = {};

export default async function AchivementPage({}: Props) {
  const session = await getServerSession(getAuthOptions(undefined))
  const data = await getUserAchievement(session?.user?.gamesLibraryData.ownedGames||[], session?.user.steam.steamid || "")
  console.log(data)
  if(data.length > 0)
  return( <section className="overflow-hidden">
    <h4 className="mb-4">Achievements</h4>

    <section className="overflow-hidden pr-6">
      {data.map((game, indexGame)=>{
        return (
        <section key={game.gameName}>  
         <Link href={`/game/${game.gameId}`}>{game.gameName}</Link> - <strong>{game.completedCount}/{game.achievements.length}</strong>
        <section className="overflow-x-scroll mb-8">
          <ul className="list-none flex w-fit">{game.achievements.map(achievement=>
            <li key={achievement.displayName} className="w-20 mr-6">
              <Image src={achievement.achieved ? achievement.icon : achievement.icongray} loading={indexGame > 3 ? "lazy" : "eager"} width="80" height={80} alt={achievement.name}/>
            </li>)
          }
          </ul>
        </section>
        </section>)
      })}
    </section>
  </section>)
}
