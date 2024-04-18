import { getGameData } from "@/app/services";
import React from "react";

type Props = {
  params: {id:string}
};

const GamePage = async (props:Props) => {
  const data = await getGameData(Number(props.params.id))
  console.log(data)
  return <p>{props.params.id}</p>;
};

export default GamePage