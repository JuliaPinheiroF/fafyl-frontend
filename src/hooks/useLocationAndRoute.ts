import { USE_MOCKS } from '@/config/env';
import { useState, useCallback } from 'react';
import { calculateRoute } from '@/services/geoapifyService';

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
  getCurrentLocation: () => Promise<{ lat: number; lon: number }>;
  calculateRouteTo: (destination: { lat: number; lon: number }) => Promise<void>;
  clearError: () => void;
}

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

const MOCK_LOCATION = { lat: -23.5505, lon: -46.6333 };

export default function useLocationAndRoute(): UseLocationAndRouteReturn {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LocationError>(null);

  const getCurrentLocationWeb = useCallback((): Promise<{ lat: number; lon: number }> => {
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

  const getCurrentLocation = useCallback(async (): Promise<{ lat: number; lon: number }> => {
    if (USE_MOCKS) {
      setCurrentLocation(MOCK_LOCATION);
      return MOCK_LOCATION;
    }

    const loc = await getCurrentLocationWeb();
    return loc;
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

    try {
      setLoading(true);
      setError(null);
      setRoute(null);

      const loc = await getCurrentLocationWeb();
      const result = await calculateRoute(loc, destination, 'drive');
      setRoute(result);
    } catch (err: any) {
      if (
        err?.code === 'no_internet' ||
        err?.message === 'network unavailable' ||
        err instanceof TypeError
      ) {
        setError('no_internet');
      } else {
        setError('route_failed');
      }
      setRoute(null);
    } finally {
      setLoading(false);
    }
  }, [getCurrentLocationWeb]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentLocation,
    route,
    loading,
    error,
    errorMessage: error ? getErrorMessage(error) : '',
    hasPermission: USE_MOCKS || (typeof navigator !== 'undefined' && !!navigator.geolocation),
    getCurrentLocation,
    calculateRouteTo,
    clearError,
  };
}