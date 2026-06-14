import { USE_MOCKS } from '@/config/env';
import { useState, useCallback } from 'react';

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

const GEOAPIFY_API_KEY = '0b5a3219a82049159d600f759dd39595';

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

export default function useLocationAndRoute(): UseLocationAndRouteReturn {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LocationError>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const getCurrentLocationWeb = useCallback(async (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError('location_unavailable');
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCurrentLocation(loc);
          resolve(loc);
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
    if (USE_MOCKS) {
      setCurrentLocation({ lat: -23.5505, lon: -46.6333 });
      return;
    }

    const isWeb = typeof window !== 'undefined' && navigator?.geolocation != null;

    if (isWeb) {
      try {
        setLoading(true);
        setError(null);
        await getCurrentLocationWeb();
      } catch {
        // Error already set
      } finally {
        setLoading(false);
      }
      return;
    }

    setError('location_unavailable');
    setLoading(false);
  }, [getCurrentLocationWeb]);

  const calculateRouteTo = useCallback(async (destination: { lat: number; lon: number }) => {
    if (USE_MOCKS) {
      setRoute({
        coordinates: [[destination.lon, destination.lat], [-46.6333, -23.5505]],
        distance: 5000,
        time: 900,
      });
      return;
    }

    const isWeb = typeof window !== 'undefined' && navigator?.geolocation != null;

    try {
      setLoading(true);
      setError(null);
      setRoute(null);

      if (isWeb) {
        const loc = await getCurrentLocationWeb();
        const result = await calculateRouteWeb(loc, destination);
        setRoute(result);
        setLoading(false);
        return;
      }

      setError('route_failed');
      setRoute(null);

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