import React from "react";
import Column from "../Grid/Column";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/app/(authenticated)/api/auth/[...nextauth]/route";
import { getMostPlayedOwnedGames } from "@/app/services";
import { convertTiming } from "@/app/utils";
import Image from "next/image";

const ColumnProfile = async () => {
    const session = await getServerSession(getAuthOptions(undefined))

  const {mostPlayedData, mostPlayedTime } = await getMostPlayedOwnedGames(session?.user.ownedgames)

  return (<Column className='w-full md:w-3/12 md:pl-8 relative'>
                <section className='md:w-full flex flex-col sticky top-20'>
                <h1 className='text-2xl text-center text-gray-800'>{session?.user?.name}</h1>
                <Avatar className='w-24 h-24 self-center mt-2'>
                        <AvatarImage src={session?.user?.steam.avatarfull} 
                         alt={session?.user?.username} className="hover:zoom-in-75 
                         transition-all" />
                        <AvatarFallback>{session?.user?.username}</AvatarFallback>
                    </Avatar>
                <h2 className='mt-8 font-bold'>Favorite Game:</h2>
                <Image className='mt-2' src={session?.user.ownedgames && mostPlayedData.avatarHeader || ""} alt={ mostPlayedData.name} width={200} height={60}/>
                <p className="text-sm text-gray-600 mt-2"><strong>{session?.user?.ownedgames && mostPlayedData.name}</strong></p>
                <p className="text-sm text-gray-600">Time Played: {convertTiming(mostPlayedTime.playtime_forever)}</p>
                </section>
            </Column>);
};

export default ColumnProfile