import { getMostPlayedOwnedGames } from "@/app/services";

import { NextRequest, NextResponse } from "next/server";

export const gamesOwned = async (req: NextRequest, res:NextResponse) => {
  try {
    const ownedGames = await req.json()

    // Check for ownedGames presence directly
    if (ownedGames) {
      const data = await getMostPlayedOwnedGames(ownedGames);
      return NextResponse.json(data)
    } else {
       return  NextResponse.json({"error":true})
    }
  } catch (error) {
    return NextResponse.json({"error":true})
  }
};

export { gamesOwned as POST };