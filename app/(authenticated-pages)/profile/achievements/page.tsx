import React from "react";

import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
//import { getUserAchievement } from "@/app/services";
import { getServerSession } from "next-auth";

type Props = {};

export default async function AchivementPage({}: Props) {
  const session = await getServerSession(getAuthOptions(undefined))
  //const data = await getUserAchievement(session?.user.steam.steamid||"")
  //console.log(data)
  return <div>AchivementPage</div>;
}
