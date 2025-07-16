import {
  Calendar,
  Clock,
  Gamepad2,
  Play,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/services/steamAuth';
import Column from '@/components/Grid/Column';
import ProfileIcon from '@/components/icons/UserProfile';
import Title from '@/components/Title';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Loading skeleton for table rows
const TableRowSkeleton = () => (
  <TableRow className="animate-pulse">
    <TableCell className="text-center">
      <div className="w-12 h-12 rounded-lg bg-muted/20 mx-auto"></div>
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

const LibraryTable: React.FC = async () => {
  const session = await getServerSession(getAuthOptions(undefined));

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Loading your gaming profile...
          </p>
        </div>
      </div>
    );
  }

  const games = session.user?.gamesLibraryData?.ownedGames || [];
  const totalGames = games.length;

  return (
    <TooltipProvider>
      <Column className="w-screen md:w-full min-h-6 md:pr-6">
        {/* Enhanced Header Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between ml-4 mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ProfileIcon />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            <div>
              <Title className="pl-2" tag="h2">
                {session.user?.name || 'Gamer Profile'}
              </Title>
              <p className="text-sm text-muted-foreground ml-2">
                Steam ID: {session.user?.steam?.steamid || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex space-x-4">
            <Card className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{totalGames} Games</span>
              </div>
            </Card>
            <Card className="px-4 py-2 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Library</span>
              </div>
            </Card>
          </div>
        </section>

        {/* Enhanced Table Container */}
        <Card className="border-2 border-primary/20 shadow-lg shadow-primary/10 overflow-hidden backdrop-blur-sm bg-background/80">
          <div className="p-4 border-b border-primary/20 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Your Steam Library • {totalGames} games owned
            </div>
            <div className="text-sm font-medium bg-accent/10 px-3 py-1 rounded-full text-accent-foreground flex items-center space-x-1">
              <Play className="w-3 h-3" />
              <span>Ready to Play</span>
            </div>
          </div>

          <Table className="min-w-[700px] h-screen md:w-full">
            <TableHeader>
              <TableRow className="border-b-2 border-primary/30 bg-background/50">
                <TableHead className="w-16 text-center font-bold text-base">
                  #
                </TableHead>
                <TableHead className="w-32"></TableHead>
                <TableHead className="min-w-40 font-bold text-base">
                  Game Title
                </TableHead>
                <TableHead className="font-bold text-base">Developer</TableHead>
                <TableHead className="font-bold text-base">Genres</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-x-scroll">
              {games.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <div className="space-y-2">
                      <Gamepad2 className="w-12 h-12 mx-auto text-muted-foreground/50" />
                      <p className="text-lg font-medium">
                        No games in your library
                      </p>
                      <p className="text-sm">Start building your collection!</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                games.map((game, index) => (
                  <TableRow
                    key={game.appid}
                    className="group transition-all duration-200 hover:bg-primary/10 hover:shadow-md"
                  >
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/20 group-hover:bg-primary/20 transition-colors duration-200">
                        {index + 1}
                      </span>
                    </TableCell>
                    {game.avatarCapsule && (
                      <TableCell className="p-2">
                        <Link href={`/game/${game.appid}`} passHref>
                          <div className="overflow-hidden rounded-md border-2 border-border/50 transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-lg group-hover:scale-105">
                            <img
                              alt={game.name}
                              src={game.avatarCapsule}
                              width="112"
                              height="60"
                              loading={index > 9 ? 'lazy' : 'eager'}
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
                            className="text-foreground hover:text-primary transition-colors duration-200 hover:underline underline-offset-4 font-semibold"
                          >
                            {game.name}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-card border-primary/20 max-w-md"
                        >
                          <div className="space-y-2">
                            <p className="font-medium">{game.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Gamepad2 className="w-3 h-3" />
                              <span>Your Library</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>Ready to Play</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{game.developer}</span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Developer Studio</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {game.genre
                          .split(',')
                          .slice(0, 3)
                          .map((genre, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary-foreground border border-secondary/20 hover:bg-secondary/20 transition-colors duration-200"
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
                                {game.genre
                                  .split(',')
                                  .slice(3)
                                  .map((genre, idx) => (
                                    <span key={idx} className="text-xs">
                                      {genre.trim()}
                                    </span>
                                  ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Footer Stats */}
          {games.length > 0 && (
            <div className="p-4 border-t border-primary/20 bg-gradient-to-r from-background/50 to-primary/5">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Gamepad2 className="w-4 h-4" />
                    <span>{totalGames} games in library</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>Collection Value</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </Column>
    </TooltipProvider>
  );
};

export default LibraryTable;
