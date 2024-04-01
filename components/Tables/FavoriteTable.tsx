import React from "react";

import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { convertTiming } from "@/app/utils";
import { getServerSession } from "next-auth";
import Image from "next/image";


const FavoriteTable = async () => {

    const session = await getServerSession(getAuthOptions(undefined))

    return  (<section className="self-center md:self-auto">
                <h2 className='font-bold text-gray-200'>Favorite Game</h2>
                <Image fetchPriority="high" className='mt-2' src={session?.user?.gamesLibraryData && session?.user?.gamesLibraryData.mostPlayedData.avatarHeader || ""}
                    loading="eager" alt={session?.user?.gamesLibraryData && session?.user?.gamesLibraryData.mostPlayedData.name || ''} width={200} height={60}/>
                <p className="text-sm mt-2"><strong>{session?.user?.gamesLibraryData && session?.user?.gamesLibraryData.mostPlayedData.name}</strong></p>
                <p className="text-sm text-gray-600" title="Time played in this game">⏲️ {session?.user?.gamesLibraryData && convertTiming(session?.user?.gamesLibraryData.mostPlayedTime.playtime_forever)}</p>
            </section>);
};

export default FavoriteTable;