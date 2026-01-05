
import { useState, useEffect } from 'react';
import { UserSettings } from '@/types';
import { StorageService } from '@/utils/storage';
import { LocationService } from '@/utils/location';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    monetizationMode: 'affiliate',
    location: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('[useSettings] Loading settings...');
      setIsLoading(true);
      
      const saved = await StorageService.getSettings();
      console.log('[useSettings] Settings loaded:', saved);
      
      setSettings(saved);
      
      // Load location asynchronously without blocking
      if (!saved.location) {
        console.log('[useSettings] No location saved, fetching...');
        // Don't await - let it load in background
        LocationService.getCurrentLocation()
          .then((location) => {
            console.log('[useSettings] Location fetched:', location);
            const updated = { ...saved, location };
            setSettings(updated);
            StorageService.saveSettings(updated).catch((err) => {
              console.error('[useSettings] Failed to save location:', err);
            });
          })
          .catch((error) => {
            console.error('[useSettings] Failed to fetch location:', error);
            // Continue without location - app should still work
          });
      }
    } catch (error) {
      console.error('[useSettings] Error loading settings:', error);
      // Set default settings if loading fails
      setSettings({
        darkMode: false,
        monetizationMode: 'affiliate',
        location: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      console.log('[useSettings] Updating settings:', updates);
      const updated = { ...settings, ...updates };
      setSettings(updated);
      await StorageService.saveSettings(updated);
      console.log('[useSettings] Settings saved successfully');
    } catch (error) {
      console.error('[useSettings] Error updating settings:', error);
    }
  };

  const refreshLocation = async () => {
    try {
      console.log('[useSettings] Refreshing location...');
      const location = await LocationService.getCurrentLocation();
      console.log('[useSettings] Location refreshed:', location);
      await updateSettings({ location });
    } catch (error) {
      console.error('[useSettings] Error refreshing location:', error);
    }
  };

  return { settings, updateSettings, refreshLocation, isLoading };
};
