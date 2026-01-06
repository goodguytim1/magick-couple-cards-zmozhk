
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteCard, UserSettings } from '@/types';

const FAVORITES_KEY = '@magick_favorites';
const SETTINGS_KEY = '@magick_settings';
const DAILY_CARD_KEY = '@magick_daily_card';

export const StorageService = {
  // Favorites
  async getFavorites(): Promise<FavoriteCard[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.log('Error getting favorites:', error);
      return [];
    }
  },

  async addFavorite(cardId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const newFavorite: FavoriteCard = {
        cardId,
        timestamp: Date.now(),
      };
      favorites.push(newFavorite);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.log('Error adding favorite:', error);
    }
  },

  async removeFavorite(cardId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filtered = favorites.filter(f => f.cardId !== cardId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.log('Error removing favorite:', error);
    }
  },

  async isFavorite(cardId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(f => f.cardId === cardId);
    } catch (error) {
      console.log('Error checking favorite:', error);
      return false;
    }
  },

  // Settings
  async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : {
        darkMode: false,
        monetizationMode: 'affiliate',
      };
    } catch (error) {
      console.log('Error getting settings:', error);
      return {
        darkMode: false,
        monetizationMode: 'affiliate',
      };
    }
  },

  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  },

  // Daily Card
  async getDailyCardDate(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(DAILY_CARD_KEY);
    } catch (error) {
      console.log('Error getting daily card date:', error);
      return null;
    }
  },

  async setDailyCardDate(date: string): Promise<void> {
    try {
      await AsyncStorage.setItem(DAILY_CARD_KEY, date);
    } catch (error) {
      console.log('Error setting daily card date:', error);
    }
  },
};
