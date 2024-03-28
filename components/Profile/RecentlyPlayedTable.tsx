import { getAuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { getRecentlyPlayedGames } from '@/app/services';
import { convertTiming } from '@/app/utils';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import * as React from 'react';


export default async function RecentlyPlayedTable () {
    const session= await getServerSession(getAuthOptions(undefined))
    const {response} = await getRecentlyPlayedGames(session?.user.steam.steamid||"")

    if (response.total_count > 0) {
     return (
        <section className='mt-10 self-center  w-[200px] md:w-full'>
            <h3 className='mb-3 font-bold text-gray-200'>Recently Played Game</h3>
            <section className='flex flex-col'>
                {response.total_count > 0 && response.games.map(item=>{
                    return (
                        <section className='grid grid-cols-recentPlayed grid-rows-1 mb-2 gap-x-3' key={item.appid}>
                            <Image 
                                src={`https://media.steampowered.com/steamcommunity/public/images/apps/${item.appid}/${item.img_icon_url}.jpg`}
                                    alt={item.name} width={32} height={32} />
                            <p className='text-sm font-bold'>{item.name}</p>
                            <p className='text-sm col-start-2 row-start-2 text-gray-600'>
                                Last weeks: {convertTiming(item.playtime_2weeks)}
                            </p>
                        </section>
                    )
                })}
            </section>
        </section>
  );}
  return null
}
