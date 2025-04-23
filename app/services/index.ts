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
import { allSettleHandler, convertCentsToDols, imageGameSteam } from '../utils';
import {
  fetchData,
  getStatsToAchievements,
  spyRoute,
  steamKey,
  steamRoute,
} from './utils';

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
