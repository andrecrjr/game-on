import React from "react";

import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserAchievement } from "@/app/services";
import { getServerSession } from "next-auth";
import AchievementsTable from "@/components/Tables/AchievementsTable";

type Props = {};

export default async function AchivementPage({}: Props) {
  const session = await getServerSession(getAuthOptions(undefined))
  const data = await getUserAchievement(session?.user?.gamesLibraryData.ownedGames||[], session?.user.steam.steamid || "")

  if(data.length > 0)
  return( <section>
    <h4 className="mb-4">Achievements</h4>
    <section className="pr-6 overflow-x-hidden max-w-auto">
      <AchievementsTable />
    </section>
  </section>)
}
