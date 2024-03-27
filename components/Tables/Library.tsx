'use client'
import React from 'react';
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
import { useGetUserGameLibrary } from '@/app/hooks/useGetOwnedGame';
import Image from 'next/image';
import ProfileIcon from '../icons/UserProfile';
import Title from '../Title';


const LibraryTable: React.FC = () => {
    const {data} = useSession()
    const gameUser = useGetUserGameLibrary(data?.user?.ownedgames||null)
    if(!gameUser.error)
        return( <Column className='w-screen md:w-full min-h-6 md:pr-6'>
            <section className='flex ml-4 mb-8'>
                <ProfileIcon />
                <Title className='pl-2' tag="h2">Game Profile</Title>
            </section>
            <Table className='min-w-[700px] h-screen md:w-full'>
                <TableCaption>Games Library</TableCaption>
                <TableHeader>
                    {<TableRow>
                        <TableHead className='min-w-32'></TableHead>
                        <TableHead className='min-w-56'>Name</TableHead>
                        <TableHead className='min-w-32'>Game Studio</TableHead>
                        <TableHead className='w-16 md:min-w-40'>Genres</TableHead>
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
                        <TableCell>{game.genre}</TableCell>
                    </TableRow>)}
                </TableBody>
                </Table>
            </Column>);

    return <p>Loading</p>
}

export default LibraryTable;