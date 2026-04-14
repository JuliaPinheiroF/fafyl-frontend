import { useState, useCallback } from 'react';
import * as ExpoLocation from 'expo-location';
import { calculateRoute, RouteResult } from '@/services/geoapifyService';

export type LocationError = 'no_permission' | 'no_internet' | 'gps_disabled' | 'location_unavailable' | 'route_failed' | null;

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

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar status da permissão
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

      // Verificar se o serviço de localização está habilitado
      const serviceEnabled = await ExpoLocation.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        setError('gps_disabled');
        setLoading(false);
        return;
      }

      // Obter localização atual
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
  }, []);

  const calculateRouteTo = useCallback(async (destination: { lat: number; lon: number }) => {
    try {
      setLoading(true);
      setError(null);
      setRoute(null);

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
  }, []);

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
