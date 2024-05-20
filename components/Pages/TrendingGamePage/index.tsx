import { getTrendingGamesRanked } from "@/app/services";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ISteamSpyGameData } from "@/types/steam";
import Link from "next/link";
import React from "react";

type Props = {
    gameRankedData?: ISteamSpyGameData[]
};

const TrendingGamePage = ({gameRankedData}: Props) => {
    
    return (<><h1>Trending Game Page</h1>
    <Table className='min-w-[700px] h-screen md:w-full'>
                <TableCaption>Games Library</TableCaption>
                <TableHeader>
                    {<TableRow>
                        <TableHead className='min-w-40'>Rank</TableHead>
                        <TableHead className='min-w-32'></TableHead>
                        <TableHead className='min-w-40'>Name</TableHead>
                        <TableHead>Game Studio</TableHead>
                        <TableHead>Genres</TableHead>
                   </TableRow>}
                </TableHeader>
                <TableBody className='overflow-x-scroll'>
                    {!!gameRankedData && gameRankedData.map((game, index)=>
                    {
                        return(
                                <TableRow key={game.appid}>
                                        <TableCell>{index + 1}</TableCell>
                                        {game.avatarCapsule && 
                                            <TableCell>
                                                <img alt={game.name} 
                                                    src={game.avatarCapsule} width="112" height={"60"} 
                                                        loading={index>9 ? "lazy" : "eager"}/>
                                            </TableCell>
                                        }
                                        <TableCell >
                                            <Link href={`/game/${game.appid}`} passHref>{game.name}</Link>
                                        </TableCell>
                                        <TableCell >{game.developer}</TableCell>
                                        <TableCell>{game.genre}</TableCell>
                                    </TableRow>
                            )
                    }
                )}
                </TableBody>
                </Table></>);
};

export default TrendingGamePage
