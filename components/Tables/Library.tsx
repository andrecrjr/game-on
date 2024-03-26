'use client'
import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Column from '../Grid/Column';
import { useSession } from 'next-auth/react';
import { getMostPlayedOwnedGames } from '@/app/services';
import { useGetUserGameLibrary } from '@/app/hooks/useGetOwnedGame';
import Image from 'next/image';


const LibraryTable: React.FC = () => {
    const {data} = useSession()
    const gameUser = useGetUserGameLibrary(data?.user?.ownedgames||null)
    if(!gameUser.error)
        return( <Column className='w-screen md:w-full min-h-6'>
            <h2>Games Library</h2>
            <Table className='w-[650px] md:w-full'>
                <TableCaption>Games Library</TableCaption>
                <TableHeader>
                    {<TableRow>
                        <TableHead className='w-28'></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead >Game Studio</TableHead>
                        <TableHead className="text-right w-[150px]">Current Price</TableHead>
                    </TableRow>}
                </TableHeader>
                <TableBody className='overflow-x-scroll'>
                    {gameUser?.ownedGames.map(game=><TableRow key={game.appid}>
                        {game.avatarCapsule && <TableCell >
                            <Image alt={game.name} 
                                src={game.avatarCapsule} width="112" height={"60"}>
                            </Image>
                        </TableCell>}
                        <TableCell >{game.name}</TableCell>
                        <TableCell >{game.developer}</TableCell>
                        <TableCell className="text-right">{game.price === "0" ? "Free Game" : game.price}</TableCell>
                    </TableRow>)}
                </TableBody>
                </Table>
            </Column>);

    return <p>Loading</p>
}

export default LibraryTable;