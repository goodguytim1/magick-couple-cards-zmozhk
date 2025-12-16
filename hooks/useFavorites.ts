
import { useState, useEffect } from 'react';
import { StorageService } from '@/utils/storage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await StorageService.getFavorites();
    setFavorites(favs.map(f => f.cardId));
  };

  const toggleFavorite = async (cardId: string) => {
    const isFav = favorites.includes(cardId);
    
    if (isFav) {
      await StorageService.removeFavorite(cardId);
      setFavorites(favorites.filter(id => id !== cardId));
    } else {
      await StorageService.addFavorite(cardId);
      setFavorites([...favorites, cardId]);
    }
  };

  const isFavorite = (cardId: string) => favorites.includes(cardId);

  return { favorites, toggleFavorite, isFavorite, refreshFavorites: loadFavorites };
};
