
import { useState, useEffect } from 'react';
import { UserSettings } from '@/types';
import { StorageService } from '@/utils/storage';

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

  return { settings, updateSettings, isLoading };
};
