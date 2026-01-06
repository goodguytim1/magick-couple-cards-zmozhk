
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const toggleFavorite = async (cardId: string) => {
    const newFavorites = favorites.includes(cardId)
      ? favorites.filter(id => id !== cardId)
      : [...favorites, cardId];
    
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const isFavorite = (cardId: string) => favorites.includes(cardId);

  return { favorites, toggleFavorite, isFavorite };
}
