import React from "react";

import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserAchievement } from "@/app/services";
import { getServerSession } from "next-auth";
import AchievementsTable from "@/components/Tables/AchievementsTable/AchievementsTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: {id:string}
};

export default async function AchivementPage({params}: Props) {
  const session = await getServerSession(getAuthOptions(undefined))
  const {achievements, currentPage, totalPages} = await getUserAchievement(session?.user?.gamesLibraryData.ownedGames||[], session?.user.steam.steamid || "", parseInt(params?.id)||1)
  if(achievements.length > 0)
    return( 
      <section className="flex flex-col w-screen md:pr-6">
        <h4 className="mb-4 pl-4">Achievements - Page {currentPage}  of {totalPages}</h4>
          <section className="flex justify-between px-4 pb-4">
            <Button ><Link href={`/profile/achievements/${parseInt(params.id)-1}`}>Anterior</Link></Button>
            <Button className="self-end"><Link href={`/profile/achievements/${parseInt(params.id)+1}`}>Próximo</Link></Button>
          </section>
          <section className="px-4">
            <AchievementsTable achievements={achievements} />
          </section>
      </section>
    )
}
