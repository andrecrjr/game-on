import React from "react";
import Column from "../Grid/Column";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/app/(authenticated)/api/auth/[...nextauth]/route";
import { getMostPlayedOwnedGames } from "@/app/services";
import { convertTiming } from "@/app/utils";
import Image from "next/image";
import Title from "../Title";

const ColumnProfile = async () => {
    const session = await getServerSession(getAuthOptions(undefined))

  const {mostPlayedData, mostPlayedTime } = await getMostPlayedOwnedGames(session?.user.ownedgames)

  return (<Column className='w-full md:w-3/12 md:pl-8 relative mb-12 md:mb-auto'>
                <section className='md:w-full flex flex-col sticky top-20'>
                    <Title tag="h1" className='text-2xl text-center text-gray-800'>{session?.user?.name}</Title>
                    <Avatar className='w-24 h-24 self-center mt-2'>
                            <AvatarImage src={session?.user?.steam.avatarfull} 
                            alt={session?.user?.username} className="hover:zoom-in-75 
                            transition-all" />
                            <AvatarFallback>{session?.user?.username}</AvatarFallback>
                    </Avatar>
                    <section className="self-center md:self-auto">
                        <h2 className='mt-8 font-bold'>Favorite Game:</h2>
                        <Image fetchPriority="high" className='mt-2' src={session?.user.ownedgames && mostPlayedData.avatarHeader || ""}
                         loading="eager" alt={ mostPlayedData.name} width={200} height={60}/>
                        <p className="text-sm text-gray-600 mt-2"><strong>{session?.user?.ownedgames && mostPlayedData.name}</strong></p>
                        <p className="text-sm text-gray-600">Time Played: {convertTiming(mostPlayedTime.playtime_forever)}</p>
                    </section>
                </section>
            </Column>);
};

export default ColumnProfile