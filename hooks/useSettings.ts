
import { useState, useEffect } from 'react';
import { UserSettings } from '@/types';
import { StorageService } from '@/utils/storage';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    monetizationMode: 'affiliate',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await StorageService.getSettings();
    setSettings(saved);
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    await StorageService.saveSettings(updated);
  };

  return { settings, updateSettings };
};
