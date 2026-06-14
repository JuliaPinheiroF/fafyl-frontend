import React, { useEffect, useRef } from 'react';
import { IoClose, IoAlertCircle, IoLocation } from 'react-icons/io5';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useLocationAndRoute from '@/hooks/useLocationAndRoute';
import { formatDistance, formatTime } from '@/services/geoapifyService';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const originIcon = L.divIcon({
  className: 'origin-marker',
  html: '<div style="width: 20px; height: 20px; border-radius: 50%; background: #2196F3; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const destIcon = L.divIcon({
  className: 'dest-marker',
  html: '<div style="display: flex; align-items: center; justify-content: center;"><svg width="28" height="28" viewBox="0 0 24 24"><path fill="#FF0000" d="M12 3C7.58 3 4 6.58 4 11c0 5.25 7 10 8 10s8-4.75 8-10c0-4.42-3.58-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const tileUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=0b5a3219a82049159d600f759dd39595`;

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

function MapBoundsUpdater({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (coords.length === 1) {
      map.setView(coords[0], 14);
    }
  }, [coords, map]);
  return null;
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

  useEffect(() => {
    if (visible && destination.lat !== 0 && destination.lon !== 0) {
      calculateRouteTo({ lat: destination.lat, lon: destination.lon });
    }
  }, [visible, destination]);

  const originPos: [number, number] | null = currentLocation
    ? [currentLocation.lat, currentLocation.lon]
    : null;

  const destPos: [number, number] = [destination.lat, destination.lon];

  const routeLatLngs: [number, number][] = route
    ? route.coordinates.map(([lon, lat]) => [lat, lon])
    : [];

  const defaultCenter: [number, number] = originPos || destPos;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-[#F5F5F5] z-[9999] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-4 bg-white border-b border-[#EEE]">
        <button className="p-2 cursor-pointer bg-transparent border-none" onClick={onClose}>
          <IoClose size={28} color="#010080" />
        </button>
        <span className="text-lg font-bold text-[#010080]">Rota até o campus</span>
        <div className="w-11" />
      </div>

      <div className="flex-1">
        {loading && !route ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-[#010080] border-t-transparent rounded-full animate-spin" />
              <span className="mt-4 text-base text-[#666]">Carregando rota...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col justify-center items-center p-10">
            <IoAlertCircle size={64} color="#666" />
            <span className="mt-5 text-base text-[#666] text-center mb-6">{errorMessage}</span>
            <button
              className="bg-[#010080] px-6 py-3 rounded-[25px] cursor-pointer border-none"
              onClick={() => calculateRouteTo({ lat: destination.lat, lon: destination.lon })}
            >
              <span className="text-[#FFD700] text-base font-bold">Tentar novamente</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 relative">
            <MapContainer
              center={defaultCenter}
              zoom={14}
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
            >
              <TileLayer url={tileUrl} maxZoom={19} minZoom={1} />
              {originPos && <Marker position={originPos} icon={originIcon} />}
              <Marker position={destPos} icon={destIcon} />
              {routeLatLngs.length > 0 && (
                <Polyline positions={routeLatLngs} color="#010080" weight={5} />
              )}
              <MapBoundsUpdater
                coords={[
                  ...(originPos ? [originPos] : []),
                  destPos,
                  ...routeLatLngs,
                ]}
              />
            </MapContainer>

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
        )}
      </div>
    </div>
  );
}
