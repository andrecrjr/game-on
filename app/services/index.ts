import {
  IAchievementsPaginated,
  IAchievementsUser,
  IGameNewsRoot,
  IGameOwned,
  IPlayerStatsRoot,
  IRecentlyPlayedRoot,
  ISteamGamesOwned,
  ISteamSpyGameData,
  TrendingGamePageType,
} from '@/types/steam';
import {
  CombinedGameData,
  CombinedLibraryData,
  XboxLibraryData,
} from '@/types/xbox';
import { allSettleHandler, convertCentsToDols, imageGameSteam } from '../utils';
import {
  fetchData,
  getStatsToAchievements,
  spyRoute,
  steamKey,
  steamRoute,
} from './utils';
import { xboxLiveService } from './xboxLiveService';

const safeFetchData = async <T>(
  url: string,
  options?: object,
): Promise<T | null> => {
  try {
    return await fetchData<T>(url, options);
  } catch (error) {
    return null;
  }
};

export const getGameData = async (
  appid: number,
): Promise<ISteamSpyGameData> => {
  const data = await safeFetchData<ISteamSpyGameData>(
    `${spyRoute}?request=appdetails&appid=${appid}`,
    {
      next: { revalidate: 8000 },
    },
  );
  if (!data) throw new Error(`Game data not found for appid: ${appid}`);

  return {
    ...data,
    avatarCapsule: imageGameSteam(appid),
    avatarHeader: imageGameSteam(appid, 'header'),
    price: data.price === '0' ? 'Free' : convertCentsToDols(Number(data.price)),
  };
};

export const getMostPlayedOwnedGames = async (
  data: ISteamGamesOwned | undefined,
): Promise<{
  mostPlayedData: ISteamSpyGameData;
  mostPlayedTime: IGameOwned;
  ownedGames: ISteamSpyGameData[];
}> => {
  if (!data || !data.games) {
    throw new Error('Invalid or missing game data.');
  }

  const mostPlayedTime = data.games.reduce((prev, curr) =>
    prev.playtime_forever > curr.playtime_forever ? prev : curr,
  );

  const ownedGames = await Promise.all(
    data.games.map((game) => getGameData(game.appid)),
  );

  const mostPlayedData = await getGameData(mostPlayedTime.appid);

  return { mostPlayedData, mostPlayedTime, ownedGames };
};

/**
 * Get combined library data including both Steam and Xbox games
 */
export const getCombinedLibraryData = async (
  steamData: ISteamGamesOwned | undefined,
  steamId: string,
): Promise<CombinedLibraryData> => {
  const [steamLibrary, xboxLibrary, hasXboxLinked] = await Promise.allSettled([
    steamData ? getMostPlayedOwnedGames(steamData) : Promise.resolve(null),
    xboxLiveService.getXboxLibraryData(steamId),
    xboxLiveService.hasXboxAccountLinked(steamId),
  ]);

  return {
    steam: steamLibrary.status === 'fulfilled' ? steamLibrary.value : undefined,
    xbox: xboxLibrary.status === 'fulfilled' ? xboxLibrary.value : undefined,
    hasXboxLinked:
      hasXboxLinked.status === 'fulfilled' ? hasXboxLinked.value : false,
    hasSteamLinked: !!steamData && !!steamData.games,
  };
};

/**
 * Normalize games from different platforms into a common format
 */
export const normalizeGamesData = (
  combinedData: CombinedLibraryData,
): CombinedGameData[] => {
  const games: CombinedGameData[] = [];

  // Add Steam games
  if (combinedData.steam?.ownedGames) {
    games.push(
      ...combinedData.steam.ownedGames.map(
        (game): CombinedGameData => ({
          id: `steam-${game.appid}`,
          name: game.name,
          platform: 'steam',
          image: game.avatarCapsule,
          developer: game.developer,
          publisher: game.publisher,
          genres: game.genre?.split(',').map((g: string) => g.trim()),
          appid: game.appid,
          avatarCapsule: game.avatarCapsule,
          genre: game.genre,
        }),
      ),
    );
  }

  // Add Xbox Game Pass games
  if (combinedData.xbox?.gamePassGames) {
    games.push(
      ...combinedData.xbox.gamePassGames.map(
        (game): CombinedGameData => ({
          id: `xbox-gp-${game.titleId}`,
          name: game.name,
          platform: 'xbox',
          image: game.displayImage || '',
          developer: game.developer,
          publisher: game.publisher,
          categories: game.categories,
          isGamePass: game.isGamePass,
          gamePassTier: game.gamePassTier,
          achievements: game.achievementStats
            ? {
                current: game.achievementStats.currentAchievements,
                total: game.achievementStats.totalAchievements,
                gamerScore: game.achievementStats.currentGamerscore,
              }
            : undefined,
          lastPlayed: game.lastPlayedDate,
          playtime: game.playtimeStats?.totalPlaytime,
          titleId: game.titleId,
          displayImage: game.displayImage,
          ownershipType: game.ownershipType,
          purchaseDate: game.purchaseDate,
        }),
      ),
    );
  }

  // Add Xbox owned games
  if (combinedData.xbox?.ownedGames) {
    games.push(
      ...combinedData.xbox.ownedGames.map(
        (game): CombinedGameData => ({
          id: `xbox-owned-${game.titleId}`,
          name: game.name,
          platform: 'xbox',
          image: game.displayImage || '',
          developer: game.developer,
          publisher: game.publisher,
          categories: game.categories,
          isGamePass: game.isGamePass,
          gamePassTier: game.gamePassTier,
          achievements: game.achievementStats
            ? {
                current: game.achievementStats.currentAchievements,
                total: game.achievementStats.totalAchievements,
                gamerScore: game.achievementStats.currentGamerscore,
              }
            : undefined,
          lastPlayed: game.lastPlayedDate,
          playtime: game.playtimeStats?.totalPlaytime,
          titleId: game.titleId,
          displayImage: game.displayImage,
          ownershipType: game.ownershipType,
          purchaseDate: game.purchaseDate,
        }),
      ),
    );
  }

  return games;
};

// Função para obter dados completos do jogo e notícias (opcional)
export const getAllGameData = async (
  appId: number,
  options: { getNews: boolean } = { getNews: true },
): Promise<{ gameData: ISteamSpyGameData; gameNews: IGameNewsRoot | null }> => {
  const [gameDataResult, gameNewsResult] = await Promise.allSettled([
    getGameData(appId),
    options.getNews
      ? safeFetchData<IGameNewsRoot>(
          `${steamRoute}ISteamNews/GetNewsForApp/v0002/?appid=${appId}&count=15&maxlength=1000&format=json`,
          { next: { revalidate: 90000 } },
        )
      : Promise.resolve(null),
  ]);

  const gameData =
    gameDataResult.status === 'fulfilled' ? gameDataResult.value : null;
  const gameNews =
    gameNewsResult.status === 'fulfilled' ? gameNewsResult.value : null;

  if (!gameData)
    throw new Error(`Failed to retrieve game data for appId: ${appId}`);

  return { gameData, gameNews };
};

export const getRecentlyPlayedGames = async (
  steamUserId: string,
): Promise<IRecentlyPlayedRoot> => {
  const data = await safeFetchData<IRecentlyPlayedRoot>(
    `${steamRoute}IPlayerService/GetRecentlyPlayedGames/v0001/?key=${steamKey}&steamid=${steamUserId}&format=json`,
    { next: { revalidate: 90000 } },
  );

  if (!data) {
    throw new Error(
      `Failed to fetch recently played games for user ID: ${steamUserId}`,
    );
  }

  return data;
};

export const getUserAchievementPaginated = async (
  gamesOwned: ISteamSpyGameData[],
  steamUserId: string,
  pageNumber = 1,
  pageSize = 9,
): Promise<IAchievementsPaginated> => {
  if (!gamesOwned || gamesOwned.length === 0) {
    throw new Error('No owned games found.');
  }

  const totalPages = Math.ceil(gamesOwned.length / pageSize);
  const currentPageGames = gamesOwned.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize,
  );

  const achievementsDataSettled = await Promise.allSettled(
    currentPageGames.map(async (item) => {
      const url = `${steamRoute}ISteamUserStats/GetPlayerAchievements/v0001/?appid=${item.appid}&key=${steamKey}&steamid=${steamUserId}`;
      const data = await safeFetchData<IPlayerStatsRoot>(url, {
        next: { revalidate: 10000 },
      });
      if (!data) return null;

      const achievementsData = await getStatsToAchievements(
        data.playerstats.achievements,
        item.appid,
      );
      const completedCount = achievementsData.filter(
        (ach) => ach.achieved,
      ).length;

      return {
        achievements: achievementsData,
        gameName: data.playerstats.gameName,
        completedCount,
        gameId: item.appid,
      };
    }),
  );

  const achievements = allSettleHandler(
    achievementsDataSettled,
  ) as IAchievementsUser[];

  return { achievements, currentPage: pageNumber, totalPages };
};

export const getTrendingGamesRanked = async (
  rank = 'top100in2weeks',
): Promise<ISteamSpyGameData[]> => {
  const data = await safeFetchData<TrendingGamePageType>(
    `${spyRoute}?request=${rank}`,
  );
  if (!data) throw new Error('Failed to fetch trending games.');

  const appIds = Object.keys(data).map(Number);

  const gameDataSettled = await Promise.allSettled(
    appIds.map((appid) => getAllGameData(appid, { getNews: false })),
  );

  return allSettleHandler(gameDataSettled).map(
    (result) => result?.gameData,
  ) as ISteamSpyGameData[];
};

// Export Xbox service for external use
export { xboxLiveService };
