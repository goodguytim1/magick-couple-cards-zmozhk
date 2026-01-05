
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings, Business } from '@/types';

const KEYS = {
  SETTINGS: '@magick_settings',
  FAVORITES: '@magick_favorites',
  BUSINESSES: '@magick_businesses',
};

const DEFAULT_SETTINGS: UserSettings = {
  darkMode: false,
  monetizationMode: 'affiliate',
  location: null,
};

export const StorageService = {
  async getSettings(): Promise<UserSettings> {
    try {
      console.log('[StorageService] Getting settings...');
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        console.log('[StorageService] Settings retrieved:', parsed);
        return parsed;
      }
      console.log('[StorageService] No settings found, using defaults');
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('[StorageService] Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      console.log('[StorageService] Saving settings:', settings);
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      console.log('[StorageService] Settings saved successfully');
    } catch (error) {
      console.error('[StorageService] Error saving settings:', error);
      throw error;
    }
  },

  async getFavorites(): Promise<string[]> {
    try {
      console.log('[StorageService] Getting favorites...');
      const data = await AsyncStorage.getItem(KEYS.FAVORITES);
      if (data) {
        const parsed = JSON.parse(data);
        console.log('[StorageService] Favorites retrieved:', parsed.length, 'items');
        return parsed;
      }
      console.log('[StorageService] No favorites found');
      return [];
    } catch (error) {
      console.error('[StorageService] Error getting favorites:', error);
      return [];
    }
  },

  async saveFavorites(favorites: string[]): Promise<void> {
    try {
      console.log('[StorageService] Saving favorites:', favorites.length, 'items');
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
      console.log('[StorageService] Favorites saved successfully');
    } catch (error) {
      console.error('[StorageService] Error saving favorites:', error);
      throw error;
    }
  },

  async getBusinesses(): Promise<Business[]> {
    try {
      console.log('[StorageService] Getting businesses...');
      const data = await AsyncStorage.getItem(KEYS.BUSINESSES);
      if (data) {
        const parsed = JSON.parse(data);
        console.log('[StorageService] Businesses retrieved:', parsed.length, 'items');
        return parsed;
      }
      console.log('[StorageService] No businesses found');
      return [];
    } catch (error) {
      console.error('[StorageService] Error getting businesses:', error);
      return [];
    }
  },

  async saveBusinesses(businesses: Business[]): Promise<void> {
    try {
      console.log('[StorageService] Saving businesses:', businesses.length, 'items');
      await AsyncStorage.setItem(KEYS.BUSINESSES, JSON.stringify(businesses));
      console.log('[StorageService] Businesses saved successfully');
    } catch (error) {
      console.error('[StorageService] Error saving businesses:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      console.log('[StorageService] Clearing all data...');
      await AsyncStorage.multiRemove([
        KEYS.SETTINGS,
        KEYS.FAVORITES,
        KEYS.BUSINESSES,
      ]);
      console.log('[StorageService] All data cleared successfully');
    } catch (error) {
      console.error('[StorageService] Error clearing data:', error);
      throw error;
    }
  },
};
