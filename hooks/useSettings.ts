
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

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await StorageService.getSettings();
    setSettings(saved);
    
    // Load location if not set
    if (!saved.location) {
      const location = await LocationService.getCurrentLocation();
      const updated = { ...saved, location };
      setSettings(updated);
      await StorageService.saveSettings(updated);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    await StorageService.saveSettings(updated);
  };

  const refreshLocation = async () => {
    const location = await LocationService.getCurrentLocation();
    await updateSettings({ location });
  };

  return { settings, updateSettings, refreshLocation };
};
