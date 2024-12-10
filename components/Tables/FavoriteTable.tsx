import React from 'react';

import { getAuthOptions } from '@/app/services/steamAuth';
import { convertTiming } from '@/app/utils';
import { getServerSession } from 'next-auth';
import Image from 'next/image';


const FavoriteTable = async () => {

    const session = await getServerSession(getAuthOptions(undefined));
    if(session){
    const {user} = session;
    return  (
            <section className="self-center md:self-auto">
                <h2 className='font-bold text-gray-600'>Favorite Game</h2>
                <img fetchPriority="high" className='mt-2' src={user?.gamesLibraryData && user?.gamesLibraryData.mostPlayedData.avatarHeader || ''}
                    loading="eager" alt={user?.gamesLibraryData && user?.gamesLibraryData.mostPlayedData.name || ''} width={200} height={60}/>
                <p className="text-sm mt-2">
                    <strong>{user?.gamesLibraryData && user?.gamesLibraryData.mostPlayedData.name}</strong>
                </p>
                <p className="text-sm text-gray-600" title="Time played in this game">
                    ⏲️ {user?.gamesLibraryData && convertTiming(user?.gamesLibraryData.mostPlayedTime.playtime_forever)}
                </p>
            </section>
        );
    }
};

export default FavoriteTable;