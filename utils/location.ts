
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
      console.log('[LocationService] Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[LocationService] Permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('[LocationService] Error requesting location permission:', error);
      return false;
    }
  },

  async getCurrentLocation(): Promise<LocationData> {
    try {
      console.log('[LocationService] Getting current location...');
      
      // Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      console.log('[LocationService] Services enabled:', servicesEnabled);
      
      if (!servicesEnabled) {
        console.log('[LocationService] Location services disabled, using fallback');
        return JACKSONVILLE_FALLBACK;
      }

      const hasPermission = await this.requestPermission();
      
      if (!hasPermission) {
        console.log('[LocationService] Location permission denied, using fallback');
        return JACKSONVILLE_FALLBACK;
      }

      console.log('[LocationService] Fetching position...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 0,
      });

      console.log('[LocationService] Position received:', location.coords);

      // Try to get city name, but don't fail if geocoding fails
      let city = 'Unknown';
      let region = '';
      
      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        city = geocode[0]?.city || 'Unknown';
        region = geocode[0]?.region || '';
        console.log('[LocationService] Geocoded to:', city, region);
      } catch (geocodeError) {
        console.error('[LocationService] Geocoding failed:', geocodeError);
        // Continue with Unknown city rather than crashing
      }

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        city: region ? `${city}, ${region}` : city,
      };
    } catch (error) {
      console.error('[LocationService] Error getting location, using fallback:', error);
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
