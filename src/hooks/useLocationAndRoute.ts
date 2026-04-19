import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

export type LocationError = 'no_permission' | 'no_internet' | 'gps_disabled' | 'location_unavailable' | 'route_failed' | null;

export interface RouteResult {
  coordinates: [number, number][];
  distance: number;
  time: number;
}

export interface UseLocationAndRouteReturn {
  currentLocation: { lat: number; lon: number } | null;
  route: RouteResult | null;
  loading: boolean;
  error: LocationError;
  errorMessage: string;
  hasPermission: boolean;
  getCurrentLocation: () => Promise<void>;
  calculateRouteTo: (destination: { lat: number; lon: number }) => Promise<void>;
  clearError: () => void;
}

export default function useLocationAndRoute(): UseLocationAndRouteReturn {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LocationError>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const getErrorMessage = (err: LocationError): string => {
    switch (err) {
      case 'no_permission':
        return 'Localização não permitida. Ative nas configurações.';
      case 'no_internet':
        return 'Sem conexão com a internet. Verifique sua rede.';
      case 'gps_disabled':
        return 'GPS desabilitado. Ative para ver a rota.';
      case 'location_unavailable':
        return 'Não foi possível obter sua localização.';
      case 'route_failed':
        return 'Não foi possível calcular a rota. Tente novamente.';
      default:
        return 'Erro desconhecido.';
    }
  };

  const getCurrentLocationWeb = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError('location_unavailable');
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          resolve();
        },
        (err) => {
          if (err.code === 1) {
            setError('no_permission');
          } else {
            setError('location_unavailable');
          }
          reject(err);
        },
        { enableHighAccuracy: true }
      );
    });
  }, []);

  const calculateRouteWeb = async (origin: { lat: number; lon: number }, destination: { lat: number; lon: number }): Promise<RouteResult> => {
    const GEOAPIFY_API_KEY = '0b5a3219a82049159d600f759dd39595';
    const waypoints = `${origin.lat},${origin.lon}|${destination.lat},${destination.lon}`;
    const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    let coordinates: [number, number][] = [];
    const geometry = data.features?.[0]?.geometry;

    if (geometry?.type === 'MultiLineString' && Array.isArray(geometry.coordinates)) {
      coordinates = geometry.coordinates[0] || [];
    } else if (geometry?.type === 'LineString' && Array.isArray(geometry.coordinates)) {
      coordinates = geometry.coordinates;
    }

    const properties = data.features?.[0]?.properties || {};
    return {
      coordinates,
      distance: properties.distance || 0,
      time: properties.time || 0,
    };
  };

  const getCurrentLocation = useCallback(async () => {
    if (Platform.OS === 'web') {
      try {
        setLoading(true);
        setError(null);
        await getCurrentLocationWeb();
      } catch {
        // Error already set in getCurrentLocationWeb
      } finally {
        setLoading(false);
      }
      return;
    }

    // Mobile implementation using expo-location
    const ExpoLocation = await import('expo-location');
    
    try {
      setLoading(true);
      setError(null);

      const { status } = await ExpoLocation.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          setHasPermission(false);
          setError('no_permission');
          setLoading(false);
          return;
        }
      }
      setHasPermission(true);

      const serviceEnabled = await ExpoLocation.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        setError('gps_disabled');
        setLoading(false);
        return;
      }

      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High,
      });

      setCurrentLocation({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
    } catch (err: any) {
      const errorCode = err?.code || err?.message;
      if (errorCode === 'no_internet' || errorCode === 'network unavailable') {
        setError('no_internet');
      } else {
        setError('location_unavailable');
      }
    } finally {
      setLoading(false);
    }
  }, [getCurrentLocationWeb]);

  const calculateRouteTo = useCallback(async (destination: { lat: number; lon: number }) => {
    try {
      setLoading(true);
      setError(null);
      setRoute(null);

      if (Platform.OS === 'web') {
        await getCurrentLocationWeb();
        if (!currentLocation) {
          // Try one more time after setting
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (!currentLocation) {
          setError('location_unavailable');
          setLoading(false);
          return;
        }
        
        const result = await calculateRouteWeb(currentLocation, destination);
        setRoute(result);
        setLoading(false);
        return;
      }

      // Mobile implementation
      const ExpoLocation = await import('expo-location');

      const { status } = await ExpoLocation.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          setHasPermission(false);
          setError('no_permission');
          setLoading(false);
          return;
        }
      }
      setHasPermission(true);

      const serviceEnabled = await ExpoLocation.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        setError('gps_disabled');
        setLoading(false);
        return;
      }

      const position = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High,
      });
      
      const location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      setCurrentLocation(location);

      const { calculateRoute } = await import('@/services/geoapifyService');
      const result = await calculateRoute(location, destination, 'drive');
      setRoute(result);

    } catch (err: any) {
      const errorCode = err?.code || err?.message;
      if (errorCode === 'no_internet' || errorCode === 'network unavailable' || err instanceof TypeError) {
        setError('no_internet');
      } else {
        setError('route_failed');
      }
      setRoute(null);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, getCurrentLocationWeb]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentLocation,
    route,
    loading,
    error,
    errorMessage: error ? getErrorMessage(error) : '',
    hasPermission: hasPermission ?? false,
    getCurrentLocation,
    calculateRouteTo,
    clearError,
  };
}