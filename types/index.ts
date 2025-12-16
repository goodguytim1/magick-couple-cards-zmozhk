
export interface Card {
  id: string;
  text: string;
  type: 'question' | 'mission';
  deck: 'connection' | 'datenight' | 'challenge';
  tags: string[];
  recommendationType?: string;
  businessCategories?: string[];
  mood?: string;
  intensity?: number;
  isAtHome?: boolean;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  cards: Card[];
}

export interface Business {
  id: string;
  name: string;
  category: string;
  tags: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  source: 'affiliate' | 'sponsor';
  description?: string;
  rating?: number;
}

export interface UserSettings {
  darkMode: boolean;
  monetizationMode: 'affiliate' | 'sponsor';
  location: {
    latitude: number;
    longitude: number;
    city: string;
  } | null;
}

export interface FavoriteCard {
  cardId: string;
  timestamp: number;
}
