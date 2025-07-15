'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ISteamSpyGameData } from '@/types/steam';
import Link from 'next/link';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type Props = {
  gameRankedData?: ISteamSpyGameData[];
};

// Loading skeleton for table rows
const TableRowSkeleton = () => (
  <TableRow className="animate-pulse">
    <TableCell className="text-center">
      <div className="w-8 h-8 rounded-full bg-muted/20 mx-auto"></div>
    </TableCell>
    <TableCell className="p-2">
      <div className="w-[112px] h-[60px] rounded-md bg-muted/20"></div>
    </TableCell>
    <TableCell>
      <div className="w-40 h-5 bg-muted/20 rounded"></div>
    </TableCell>
    <TableCell>
      <div className="w-32 h-5 bg-muted/20 rounded"></div>
    </TableCell>
    <TableCell>
      <div className="flex gap-1">
        <div className="w-16 h-6 bg-muted/20 rounded-full"></div>
        <div className="w-20 h-6 bg-muted/20 rounded-full"></div>
      </div>
    </TableCell>
  </TableRow>
);

const TrendingGamePage = ({ gameRankedData }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const gamesPerPage = 10;
  
  // Calculate pagination
  const totalGames = gameRankedData?.length || 0;
  const totalPages = Math.ceil(totalGames / gamesPerPage);
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = gameRankedData?.slice(indexOfFirstGame, indexOfLastGame) || [];
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 300);
  };
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <TooltipProvider>
      <div className="py-8 px-4 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">
            Trending Steam Games
          </h1>
          
          <Card className="border-2 border-primary/20 shadow-lg shadow-primary/10 overflow-hidden backdrop-blur-sm bg-background/80">
            <div className="p-4 border-b border-primary/20 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstGame + 1}-{Math.min(indexOfLastGame, totalGames)} of {totalGames} games
              </div>
              <div className="text-sm font-medium bg-accent/10 px-3 py-1 rounded-full text-accent-foreground">
                Updated Daily
              </div>
            </div>
            
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b-2 border-primary/30 bg-background/50">
                  <TableHead className="w-16 text-center font-bold text-base">Rank</TableHead>
                  <TableHead className="w-32"></TableHead>
                  <TableHead className="min-w-40 font-bold text-base">Game Title</TableHead>
                  <TableHead className="font-bold text-base">Developer</TableHead>
                  <TableHead className="font-bold text-base">Genres</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Show loading skeleton when changing pages
                  Array(gamesPerPage).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
                ) : !gameRankedData ? (
                  // Show loading skeleton when initial data is loading
                  Array(gamesPerPage).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
                ) : currentGames.length === 0 ? (
                  // Show message when no games are found
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No games found
                    </TableCell>
                  </TableRow>
                ) : (
                  // Show actual game data
                  currentGames.map((game, index) => {
                    const actualIndex = indexOfFirstGame + index;
                    const isTopThree = actualIndex < 3;
                    return (
                    <TableRow 
                      key={game.appid} 
                      className={`group transition-all duration-200 hover:bg-primary/10 ${isTopThree ? 'bg-accent/5' : ''}`}
                    >
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${isTopThree ? 'bg-accent text-white font-bold' : 'bg-muted/20'}`}>
                          {actualIndex + 1}
                        </span>
                      </TableCell>
                      {game.avatarCapsule && (
                        <TableCell className="p-2">
                          <Link href={`/game/${game.appid}`} passHref>
                            <div className="overflow-hidden rounded-md border-2 border-border/50 transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-md">
                              <img
                                alt={game.name}
                                src={game.avatarCapsule}
                                width="112"
                                height="60"
                                loading={actualIndex > 9 ? 'lazy' : 'eager'}
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                          </Link>
                        </TableCell>
                      )}
                      <TableCell className="font-medium">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link 
                              href={`/game/${game.appid}`} 
                              passHref
                              className="text-foreground hover:text-primary transition-colors duration-200 hover:underline underline-offset-4"
                            >
                              {game.name}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-card border-primary/20 max-w-md">
                            <div className="space-y-1">
                              <p className="font-medium">{game.name}</p>
                              <p className="text-xs text-muted-foreground">Players: {game.owners}</p>
                              {game.price && (
                                <p className="text-xs font-semibold text-accent">
                                  {game.price === 'Free' ? 'Free to Play' : `Price: ${game.price}`}
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        <Tooltip>
                          <TooltipTrigger>
                            <span>{game.developer}</span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">Publisher: {game.publisher}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {game.genre.split(',').slice(0, 3).map((genre, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary-foreground border border-secondary/20"
                            >
                              {genre.trim()}
                            </span>
                          ))}
                          {game.genre.split(',').length > 3 && (
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="px-2 py-1 text-xs rounded-full bg-muted/20 text-muted-foreground">
                                  +{game.genre.split(',').length - 3}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="flex flex-col gap-1">
                                  {game.genre.split(',').slice(3).map((genre, idx) => (
                                    <span key={idx} className="text-xs">{genre.trim()}</span>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }))}
              </TableBody>
            </Table>
            
            {totalPages > 1 && (
              <div className="p-4 border-t border-primary/20">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)} 
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                    
                    {pageNumbers.map(number => {
                      // Show first page, last page, and pages around current page
                      if (
                        number === 1 ||
                        number === totalPages ||
                        (number >= currentPage - 1 && number <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={number}>
                            <PaginationLink
                              isActive={currentPage === number}
                              onClick={() => handlePageChange(number)}
                              className="cursor-pointer"
                            >
                              {number}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      // Show ellipsis for gaps
                      if (
                        (number === 2 && currentPage > 3) ||
                        (number === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={number}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      
                      return null;
                    })}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(currentPage + 1)} 
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TrendingGamePage;
