import { getAllGameData } from "@/app/services";
import { AsideInline } from "@/components/Tables/AsideInline";
import React from "react";

type Props = {
  params: {id:string}
};


const AsideGameGenericPage = async (props: Props) => {

  const {gameData} = await getAllGameData(Number(props.params.id))
  return (
    <aside className="flex flex-col justify-center items-center">
        <h1 className="font-bold mb-4 text-ellipsis h-max">{gameData.name}</h1>
        <img className="mb-4" src={gameData.avatarHeader} width={460} height={215} alt={gameData.name} loading="eager" />
        <AsideInline gameData={gameData} />
    </aside>
  );

};

export default AsideGameGenericPage;