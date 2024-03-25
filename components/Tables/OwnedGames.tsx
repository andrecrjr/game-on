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
import { useGetOwnedGame } from '@/app/hooks/useGetOwnedGame';
import Image from 'next/image';


const OwnedGameTable: React.FC = () => {
    const {data} = useSession()
    const gameUser = useGetOwnedGame(data?.user?.ownedgames)
    if(!gameUser.error)
        return( <Column className='mr-8 min-h-6'>
            <h2>Owned games</h2>
            <Table >
                <TableCaption>Owned Games</TableCaption>
                <TableHeader>
                    {<TableRow>
                        <TableHead className='w-28'></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead >Developer</TableHead>
                        <TableHead className="text-right w-[100px]">Current Price</TableHead>
                    </TableRow>}
                </TableHeader>
                <TableBody>
                    
                    {gameUser?.ownedGames.map(game=><TableRow key={game.appid}>
                        {game.avatarCapsule && <TableCell ><Image alt={game.name} 
                                src={game.avatarCapsule} width="112" height={"60"}></Image></TableCell>}
                        <TableCell >{game.name}</TableCell>
                        <TableCell >{game.developer}</TableCell>
                        <TableCell className="text-right">{game.price === "0" ? "Free Game" : game.price}</TableCell>
                    </TableRow>)}
                </TableBody>
                </Table>
            </Column>);

    return <p>Loading</p>
}

export default OwnedGameTable;