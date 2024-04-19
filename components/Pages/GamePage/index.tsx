import { getAllGameData } from "@/app/services";
import React from "react";

type Props = {
  params: {id:string}
};


const GameGenericPage = async (props: Props) => {
  const {gameData, gameNews} = await getAllGameData(Number(props.params.id))
  // news for game https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=105600&count=15&maxlength=300&format=json
  console.log(gameData)
  console.log(gameNews.appnews)
  return <section>index</section>;
};

export default GameGenericPage;