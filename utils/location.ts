
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
}

const JACKSONVILLE_FALLBACK: LocationData = {
  latitude: 30.3322,
  longitude: -81.6557,
  city: 'Jacksonville, FL',
};

export const LocationService = {
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.log('Error requesting location permission:', error);
      return false;
    }
  },

  async getCurrentLocation(): Promise<LocationData> {
    try {
      const hasPermission = await this.requestPermission();
      
      if (!hasPermission) {
        console.log('Location permission denied, using fallback');
        return JACKSONVILLE_FALLBACK;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const city = geocode[0]?.city || 'Unknown';
      const region = geocode[0]?.region || '';

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        city: `${city}, ${region}`,
      };
    } catch (error) {
      console.log('Error getting location, using fallback:', error);
      return JACKSONVILLE_FALLBACK;
    }
  },

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  },
};
