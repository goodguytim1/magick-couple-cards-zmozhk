
export interface RecommendedBusiness {
  id: string;
  name: string;
  category: string;
  distance?: number;
  source: 'affiliate' | 'sponsor';
}

export class RecommendationEngine {
  static getRecommendations(
    card: any,
    monetizationMode: string
  ): RecommendedBusiness[] {
    // Return empty array - recommendations disabled for now
    // This prevents crashes while keeping the interface intact
    return [];
  }
}
