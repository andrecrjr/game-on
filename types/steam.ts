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
  steamId: '76561198287998371'
}

export interface ISteamSpyGameData {
  avatar?:string;
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
