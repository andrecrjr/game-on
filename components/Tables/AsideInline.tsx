import { ISteamSpyGameData } from "@/types/steam";
import React from "react";

const AsideLine = ({children, label}:{children:React.ReactNode, label:string}) =>{
   return <li className="mb-2 pb-2 border-b-2 border-gray-500"><strong>{label}</strong>{children}</li>
}

type Props = {
    gameData: ISteamSpyGameData
};

export const AsideInline = ({gameData}: Props) => {
  return (<ul className="mb-4">
            {gameData.genre && <AsideLine label="Genre"><p className="inline pl-4">{gameData.genre}</p></AsideLine>}
            {gameData.score_rank && <li className="pb-2"><strong>Score</strong>: {gameData.score_rank}</li>}
            {gameData.developer && <AsideLine label="Developer"><p className="inline pl-4">{gameData.developer}</p></AsideLine>}
            {gameData.publisher && <AsideLine label="Publisher"><p className="inline pl-4">{gameData.publisher}</p></AsideLine>}
            {gameData.price && <AsideLine label="Current Price"><p className="inline pl-4">{gameData.price}</p></AsideLine>}
            {gameData.languages &&  <AsideLine label="Languages"><p className="inline pl-4">{gameData.languages}</p></AsideLine>}
            {gameData.owners && <AsideLine label="Number of game's owner"><p className="inline pl-4">{gameData.owners}</p></AsideLine>}
        </ul>);
};
