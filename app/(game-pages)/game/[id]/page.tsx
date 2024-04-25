import GameGenericPage from "@/components/Pages/GamePage";
import React from "react";

type Props = {
  params: {id:string}
};

const GamePage = async (props:Props) => {
  
  return (
    <>
    <GameGenericPage {...props} />
    </>
    )
};

export default GamePage