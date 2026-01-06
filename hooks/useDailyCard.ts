
import { useMemo } from 'react';
import { Card } from '@/types';

export function useDailyCard(allCards: Card[]) {
  const dailyCard = useMemo(() => {
    if (!allCards || allCards.length === 0) return null;
    
    // Use today's date as seed for consistent daily card
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seed % allCards.length;
    
    return allCards[index];
  }, [allCards]);

  return dailyCard;
}
