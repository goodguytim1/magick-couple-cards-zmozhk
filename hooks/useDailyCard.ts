
import { useState, useEffect } from 'react';
import { Card } from '@/types';
import { StorageService } from '@/utils/storage';

export const useDailyCard = (allCards: Card[]) => {
  const [dailyCard, setDailyCard] = useState<Card | null>(null);

  useEffect(() => {
    loadDailyCard();
  }, []);

  const loadDailyCard = async () => {
    const today = new Date().toDateString();
    const savedDate = await StorageService.getDailyCardDate();

    if (savedDate === today && dailyCard) {
      // Already have today's card
      return;
    }

    // Generate new daily card
    const seed = getDaySeed(today);
    const index = seed % allCards.length;
    const card = allCards[index];
    
    setDailyCard(card);
    await StorageService.setDailyCardDate(today);
  };

  const getDaySeed = (dateString: string): number => {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  return { dailyCard, refreshDailyCard: loadDailyCard };
};
