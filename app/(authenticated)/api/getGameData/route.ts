import { getMostPlayedOwnedGames } from "@/app/services";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res:NextResponse) => {
  try {
    const ownedGames = await req.json()

    // Check for ownedGames presence directly
    if (ownedGames) {
      const data = await getMostPlayedOwnedGames(ownedGames);
      console.log(data);
      return NextResponse.json(data)
    } else {
      // Handle empty ownedGames scenario
       return  NextResponse.json({"error":true})
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({"error":true})
  }
};

export default POST;