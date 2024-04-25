import { getAllGameData } from "@/app/services";
import Column from "@/components/Grid/Column";
import React from "react";
import AsideGameGenericPage from "./AsideGameGenericPage";
import { GameFeed } from "./GameFeed";

type Props = {
  params: {id:string}
};

const GameGenericPage = async (props: Props) => {
  const {gameData, gameNews} = await getAllGameData(Number(props.params.id))
  return (
    <>
    <Column className='md:w-8/12 '>
           <GameFeed gameNews={gameNews} />
    </Column>
     <Column className='md:w-4/12'>
           <AsideGameGenericPage gameData={gameData}/>
    </Column>
    </>
  );

};

export default GameGenericPage;