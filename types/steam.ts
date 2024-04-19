export interface ISteamGamesOwned {
  game_count: number
  games: IGameOwned[]
}

export interface IGameOwned {
  appid: number
  playtime_forever: number
  playtime_windows_forever: number
  playtime_mac_forever: number
  playtime_linux_forever: number
  rtime_last_played: number
  playtime_disconnected: number
}

export interface ISteamProfile {
  steamid: string
  communityvisibilitystate: number
  profilestate: number
  personaname: string
  commentpermission: number
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  avatarhash: string
  lastlogoff: number
  personastate: number
  realname: string
  primaryclanid: string
  timecreated: number
  personastateflags: number
  loccountrycode: string
  locstatecode: string
}

export interface ISteamAccount {
  provider: 'steam',
  type: 'oauth',
  providerAccountId: '76561198287998371',
  id_token: 'fc469798-2929-48d0-8f72-1faec90958d0',
  access_token: '06471b3e-cc06-47f5-91ab-0dfa0a7d23e2',
  steamId: '1'
}

export interface ISteamSpyGameData {
  avatarCapsule?:string;
  avatarHeader?:string
  appid: number
  name: string
  developer: string
  publisher: string
  score_rank: string
  positive: number
  negative: number
  userscore: number
  owners: string
  average_forever: number
  average_2weeks: number
  median_forever: number
  median_2weeks: number
  price: string
  initialprice: string
  discount: string
  ccu: number
  languages: string
  genre: string
  tags: ISteamSpyTags
}

export interface ISteamSpyTags {
  "Free to Play": number
  "Card Game": number
  Anime: number
  Strategy: number
  Multiplayer: number
  "Trading Card Game": number
  Singleplayer: number
  "Turn-Based": number
  Competitive: number
  Casual: number
  RPG: number
  Memes: number
  "Great Soundtrack": number
  "Online Co-Op": number
  Action: number
  Adventure: number
  Simulation: number
  "Massively Multiplayer": number
  "Psychological Horror": number
  MMORPG: number
}

// Player Stats Type
export interface IPlayerStatsRoot {
  playerstats: IPlayerstats
}

export interface IPlayerstats {
  steamID: string
  gameName: string
  stats?: IStat[]
  achievements: IAchievementStatsUser[]
  success?: boolean
  appId?:number
}

export interface IStat {
  name: string
  value: number
}

export interface IAchievementStatsUser {
  apiname: string
  achieved: number
  unlocktime: number
}

// User Recently Played
export interface IRecentlyPlayedRoot {
  response: IRecentlyPlayed
}

export interface IRecentlyPlayed {
  total_count: number
  games: IGameRecentlyPlayed[]
}

export interface IGameRecentlyPlayed {
  appid: number
  name: string
  playtime_2weeks: number
  playtime_forever: number
  img_icon_url: string
  playtime_windows_forever: number
  playtime_mac_forever: number
  playtime_linux_forever: number
  playtime_deck_forever: number
}

export interface IGameSchemaRoot {
  game: GameSchema
}

export interface GameSchema {
  gameName: string
  gameVersion: string
  availableGameStats: AvailableGameStatsSchema
}

export interface AvailableGameStatsSchema {
  achievements: IAchievementGame[]
  stats: StatsGame[]
}

export interface IAchievementGame {
  name: string
  defaultvalue: number
  displayName: string
  hidden: number
  description: string
  icon: string
  icongray: string
}

export interface StatsGame {
  name: string
  defaultvalue: number
  displayName: string
}
// Achievement User Data 'https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=252950&key=key&steamid=user'
export interface IAchievementsUser {
    achievements: IAchievementGameUser[]
    gameName: string;
    gameId:number;
    completedCount: number;
}

export interface IAchievementGameUser extends IAchievementGame {
 unlocktime:number; 
 achieved:number;
}

export interface IAchievementsPaginated {
  achievements: IAchievementsUser[];
  currentPage: number;
  totalPages: number;
}

// Game News  https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=105600&count=15&maxlength=300&format=json
export interface IGameNewsRoot {
  appnews: Appnews
}

export interface Appnews {
  appid: number
  newsitems: Newsitem[]
  count: number
}

export interface Newsitem {
  gid: string
  title: string
  url: string
  is_external_url: boolean
  author: string
  contents: string
  feedlabel: string
  date: number
  feedname: string
  feed_type: number
  appid: number
  tags?: string[]
}
