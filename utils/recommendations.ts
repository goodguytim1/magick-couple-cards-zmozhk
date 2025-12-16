
import { Card, Business, UserSettings } from '@/types';
import { LocationService } from './location';
import { sampleBusinesses } from '@/data/content';

export interface RecommendedBusiness extends Business {
  distance: number;
  matchScore: number;
}

export const RecommendationEngine = {
  async getRecommendations(
    card: Card,
    userLocation: { latitude: number; longitude: number } | null,
    monetizationMode: 'affiliate' | 'sponsor'
  ): Promise<RecommendedBusiness[]> {
    // Skip at-home cards
    if (card.isAtHome) {
      return [];
    }

    // Get all businesses
    const businesses = sampleBusinesses;

    // Score and filter businesses
    const scored = businesses.map(business => {
      let score = 0;

      // Distance scoring (closer is better)
      const distance = userLocation
        ? LocationService.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            business.location.latitude,
            business.location.longitude
          )
        : 999;

      if (distance < 1) score += 50;
      else if (distance < 3) score += 30;
      else if (distance < 5) score += 20;
      else if (distance < 10) score += 10;

      // Tag matching
      const matchingTags = card.tags.filter(tag =>
        business.tags.includes(tag)
      );
      score += matchingTags.length * 15;

      // Category matching
      if (card.businessCategories) {
        const matchingCategories = card.businessCategories.filter(cat =>
          business.category.includes(cat)
        );
        score += matchingCategories.length * 20;
      }

      // Monetization mode weighting
      if (business.source === monetizationMode) {
        score += 25;
      }

      // Mood/intensity fit (simple heuristic)
      if (card.intensity && card.intensity >= 4) {
        if (business.tags.includes('adventure') || business.tags.includes('bold')) {
          score += 10;
        }
      }

      return {
        ...business,
        distance,
        matchScore: score,
      };
    });

    // Sort by score and return top 3
    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  },
};
