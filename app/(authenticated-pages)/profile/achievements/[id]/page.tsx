import React from "react";

import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserAchievement } from "@/app/services";
import { getServerSession } from "next-auth";
import AchievementsTable from "@/components/Tables/AchievementsTable/AchievementsTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AchievementPage from "@/components/Pages/Achievements";

type Props = {
  params: {id:string}
};

export default async function AchievementsUserPage(props: Props) {
    return( 
      <AchievementPage {...props}/>
    )
}
