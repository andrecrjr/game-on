// Xbox Live and Game Pass related types

import { XboxUserData } from "@/app/services/xboxLiveService";


// Enhanced types for better integration with existing Steam types
export interface CombinedLibraryData {
  steam?: {
    mostPlayedData: any;
    mostPlayedTime: any;
    ownedGames: any[];
  } | null;
  xbox?: XboxUserData | null;
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