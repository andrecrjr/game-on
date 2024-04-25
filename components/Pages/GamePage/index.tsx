import { getAllGameData } from "@/app/services";
import { AsideInline } from "@/components/Tables/AsideInline";
import React from "react";

type Props = {
  params: {id:string}
};



const GameGenericPage = async (props: Props) => {
  const {gameData} = await getAllGameData(Number(props.params.id))
  return (
    <></>
  );

};

export default GameGenericPage;