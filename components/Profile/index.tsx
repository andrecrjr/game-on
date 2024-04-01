import React from "react";
import Column from "../Grid/Column";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { convertTiming } from "@/app/utils";
import Image from "next/image";
import Title from "../Title";
import RecentlyPlayedTable from "./RecentlyPlayedTable";

const ColumnProfile = async () => {
    const session = await getServerSession(getAuthOptions(undefined))

    return (<Column className='w-full md:w-3/12 md:pl-8 mb-12 md:mb-auto sticky top-20'>
                <section className='md:w-full flex flex-col '>
                    <Title tag="h1" className='text-2xl text-center text-gray-800'>{session?.user?.name}</Title>
                    <Avatar className='w-24 h-24 self-center mt-2'>
                            <AvatarImage src={session?.user?.steam.avatarfull} 
                            alt={session?.user?.username} className="hover:zoom-in-75 
                            transition-all" />
                            <AvatarFallback>{session?.user?.username}</AvatarFallback>
                    </Avatar>
                    <RecentlyPlayedTable />
                    <section className="self-center md:self-auto">
                        <h2 className='font-bold text-gray-200'>Favorite Game</h2>
                        <Image fetchPriority="high" className='mt-2' src={session?.user?.gamesLibraryData && session?.user?.gamesLibraryData.mostPlayedData.avatarHeader || ""}
                         loading="eager" alt={session?.user?.gamesLibraryData && session?.user?.gamesLibraryData.mostPlayedData.name || ''} width={200} height={60}/>
                        <p className="text-sm mt-2"><strong>{session?.user?.gamesLibraryData && session?.user?.gamesLibraryData.mostPlayedData.name}</strong></p>
                        <p className="text-sm text-gray-600" title="Time played in this game">⏲️ {session?.user?.gamesLibraryData && convertTiming(session?.user?.gamesLibraryData.mostPlayedTime.playtime_forever)}</p>
                    </section>
                </section>
            </Column>);
};

export default ColumnProfile