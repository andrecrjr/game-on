// Xbox Live and Game Pass related types

export interface XboxUserProfile {
  id: string;
  gamertag: string;
  realName?: string;
  gamerpic: string;
  gamerScore: number;
  accountTier: string;
  xboxOneRep: string;
  preferredColor: {
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
  };
  presence?: {
    state: string;
    lastSeen?: {
      deviceType: string;
      titleName?: string;
    };
  };
}

export interface XboxGame {
  titleId: string;
  name: string;
  displayImage?: string;
  description?: string;
  publisher?: string;
  developer?: string;
  categories?: string[];
  isGamePass?: boolean;
  gamePassTier?: 'Console' | 'PC' | 'EA Play' | 'Ultimate';
  achievementStats?: {
    currentAchievements: number;
    totalAchievements: number;
    currentGamerscore: number;
    totalGamerscore: number;
  };
  lastPlayedDate?: string;
  playtimeStats?: {
    totalPlaytime: number; // in minutes
  };
  // Add new properties for ownership
  ownershipType?: 'Owned' | 'Subscription' | 'Trial';
  purchaseDate?: string;
}

export interface XboxLibraryData {
  profile: XboxUserProfile;
  gamePassGames: XboxGame[];
  ownedGames: XboxGame[]; // New field for owned games
  recentlyPlayed: XboxGame[];
  achievements: {
    totalGamerScore: number;
    totalAchievements: number;
    recentAchievements: any[];
  };
}

export interface XboxAuthTokens {
  userToken: string;
  xstsToken: string;
  uhs: string;
}

export interface GamePassCatalogItem {
  id: string;
  title: string;
  images: {
    boxart?: string;
    hero?: string;
    logo?: string;
    screenshot?: string;
  };
  description: string;
  categories: string[];
  platforms: ('Console' | 'PC' | 'Cloud')[];
  gamePassTiers: ('Console' | 'PC' | 'EA Play' | 'Ultimate')[];
  publisher: string;
  developer: string;
  releaseDate?: string;
  rating?: {
    value: number;
    count: number;
  };
}

export interface XboxAchievement {
  id: string;
  serviceConfigId: string;
  name: string;
  titleAssociations: Array<{
    name: string;
    id: number;
  }>;
  progressState: 'Achieved' | 'NotStarted' | 'InProgress';
  progression: {
    requirements: Array<{
      id: string;
      current: string;
      target: string;
    }>;
  };
  mediaAssets: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  platform: string[];
  isSecret: boolean;
  description: string;
  lockedDescription: string;
  productId: string;
  achievementType: string;
  participationType: string;
  timeWindow: {
    startDate: string;
    endDate: string;
  };
  rewards: Array<{
    name: string;
    description: string;
    value: string;
    type: string;
    valueType: string;
  }>;
  estimatedTime: string;
  deeplink: string;
  isRevoked: boolean;
  rarity: {
    currentCategory: string;
    currentPercentage: number;
  };
}

export interface XboxPresence {
  xuid: string;
  state: 'Online' | 'Away' | 'Offline';
  lastSeen?: {
    deviceType: string;
    titleId?: string;
    titleName?: string;
    placement?: string;
    state?: string;
    timestamp: string;
  };
  devices?: Array<{
    type: string;
    titles: Array<{
      id: string;
      name: string;
      placement: string;
      state: string;
      lastModified: string;
    }>;
  }>;
}

// Enhanced types for better integration with existing Steam types
export interface CombinedLibraryData {
  steam?: {
    mostPlayedData: any;
    mostPlayedTime: any;
    ownedGames: any[];
  } | null;
  xbox?: XboxLibraryData | null;
  hasXboxLinked: boolean;
  hasSteamLinked: boolean;
}

export interface CombinedGameData {
  id: string;
  name: string;
  platform: 'steam' | 'xbox';
  image?: string;
  developer?: string;
  publisher?: string;
  genres?: string[];
  categories?: string[];
  isGamePass?: boolean;
  gamePassTier?: string;
  achievements?: {
    current: number;
    total: number;
    gamerScore?: number;
  };
  lastPlayed?: string;
  playtime?: number;
  // Steam specific
  appid?: number;
  avatarCapsule?: string;
  genre?: string;
  // Xbox specific
  titleId?: string;
  displayImage?: string;
  // Ownership properties
  ownershipType?: 'Owned' | 'Subscription' | 'Trial';
  purchaseDate?: string;
} 