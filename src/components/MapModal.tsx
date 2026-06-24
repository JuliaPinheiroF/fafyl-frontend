import React, { useEffect, useRef } from 'react';
import { IoClose, IoAlertCircle, IoLocation } from 'react-icons/io5';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useLocationAndRoute from '@/hooks/useLocationAndRoute';
import { formatDistance, formatTime } from '@/services/geoapifyService';

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const originIcon = L.divIcon({
  className: '',
  html: '<div style="width:20px;height:20px;border-radius:50%;background:#2196F3;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const destIcon = L.divIcon({
  className: '',
  html: '<div style="display:flex;align-items:center;justify-content:center"><svg width="28" height="28" viewBox="0 0 24 24"><path fill="#FF0000" d="M12 3C7.58 3 4 6.58 4 11c0 5.25 7 10 8 10s8-4.75 8-10c0-4.42-3.58-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  destination: {
    lat: number;
    lon: number;
    name: string;
    collegeName: string;
  };
}

export default function MapModal({ visible, onClose, destination }: MapModalProps) {
  const {
    currentLocation,
    route,
    loading,
    error,
    errorMessage,
    calculateRouteTo,
  } = useLocationAndRoute();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const originMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (visible && destination.lat !== 0 && destination.lon !== 0) {
      calculateRouteTo({ lat: destination.lat, lon: destination.lon });
    }
  }, [visible, destination, calculateRouteTo]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!visible || !container) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      return;
    }

    const map = L.map(container, {
      center: [destination.lat, destination.lon],
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer(TILE_URL, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    const observer = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [visible, destination.lat, destination.lon]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (originMarkerRef.current) {
      map.removeLayer(originMarkerRef.current);
      originMarkerRef.current = null;
    }

    if (currentLocation) {
      originMarkerRef.current = L.marker([currentLocation.lat, currentLocation.lon], { icon: originIcon }).addTo(map);
    }
  }, [currentLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (destMarkerRef.current) {
      map.removeLayer(destMarkerRef.current);
      destMarkerRef.current = null;
    }

    destMarkerRef.current = L.marker([destination.lat, destination.lon], { icon: destIcon }).addTo(map);
  }, [destination.lat, destination.lon]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (route && route.coordinates.length > 0) {
      const latlngs: [number, number][] = route.coordinates.map(([lon, lat]) => [lat, lon]);
      routeLineRef.current = L.polyline(latlngs, { color: '#010080', weight: 5 }).addTo(map);

      const allPoints: L.LatLngExpression[] = [
        ...(currentLocation ? [[currentLocation.lat, currentLocation.lon] as L.LatLngExpression] : []),
        [destination.lat, destination.lon] as L.LatLngExpression,
        ...latlngs.map((ll) => ll as L.LatLngExpression),
      ];
      if (allPoints.length > 0) {
        map.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50] });
      }
    } else if (currentLocation) {
      const bounds = L.latLngBounds([
        [currentLocation.lat, currentLocation.lon],
        [destination.lat, destination.lon],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([destination.lat, destination.lon], 14);
    }
  }, [route, currentLocation, destination.lat, destination.lon]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 pt-4 pb-4 border-b border-[#EEE]">
        <button className="p-2 cursor-pointer bg-transparent border-none" onClick={onClose}>
          <IoClose size={28} color="#010080" />
        </button>
        <span className="text-lg font-bold text-[#010080]">Rota até o campus</span>
        <div className="w-11" />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 relative min-h-0">
          <div ref={mapContainerRef} className="absolute inset-0" />

          {loading && !route && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-[#010080] border-t-transparent rounded-full animate-spin" />
                <span className="mt-4 text-base text-[#666]">Carregando rota...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-white z-10">
              <IoAlertCircle size={64} color="#666" />
              <span className="mt-5 text-base text-[#666] text-center mb-6">{errorMessage}</span>
              <button
                className="bg-[#010080] px-6 py-3 rounded-[25px] cursor-pointer border-none"
                onClick={() => calculateRouteTo({ lat: destination.lat, lon: destination.lon })}
              >
                <span className="text-[#FFD700] text-base font-bold">Tentar novamente</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-4 border-t border-[#EEE]">
          <div className="flex items-center mb-3">
            <IoLocation size={18} color="#010080" />
            <span className="ml-2 text-sm text-[#666]">Destino</span>
            <span className="flex-1 ml-2 text-sm font-bold text-[#010080] truncate">
              {destination.collegeName}
            </span>
          </div>

          {route && (
            <div className="flex justify-around pt-3 border-t border-[#EEE]">
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-[#666] mb-1">Distância</span>
                <span className="text-lg font-bold text-[#010080]">
                  {formatDistance(route.distance)}
                </span>
              </div>
              <div className="w-px bg-[#EEE]" />
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-[#666] mb-1">Tempo</span>
                <span className="text-lg font-bold text-[#010080]">
                  {formatTime(route.time)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
