import { AsideInline } from '@/components/Tables/AsideInline';
import { ISteamSpyGameData } from '@/types/steam';
import React from 'react';

type Props = {
  gameData: ISteamSpyGameData
};


const AsideGameGenericPage = async ({gameData}: Props) => {

  return (
    <aside className="flex flex-col justify-center items-center px-4 md:px-0">
        <h1 className="font-bold mb-4 text-ellipsis h-max">{gameData.name}</h1>
        <img className="mb-4" src={gameData.avatarHeader} width={460} height={215} alt={gameData.name} loading="eager" />
        <AsideInline gameData={gameData} />
    </aside>
  );

};

export default AsideGameGenericPage;