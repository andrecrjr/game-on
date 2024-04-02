import React from "react";

import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserAchievement } from "@/app/services";
import { getServerSession } from "next-auth";

type Props = {};

export default async function AchivementPage({}: Props) {
  const session = await getServerSession(getAuthOptions(undefined))
  const data = await getUserAchievement(session?.user?.gamesLibraryData.ownedGames||[], session?.user.steam.steamid || "")
  console.log(data)
  if(data.length > 0)
  return( <section>
    <h4>Achievements</h4>
    <section>
      {data.map(game=>{
        return (<section key={game.gameName}>
          <p>{game.gameName}</p>
          
          
        </section>)
      })}
    </section>
  </section>)
}
