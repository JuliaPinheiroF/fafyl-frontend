import { Platform } from 'react-native';

const GEOAPIFY_API_KEY = '0b5a3219a82049159d600f759dd39595';

const TILE_URL_TEMPLATE = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;

export function getTileUrl(style: string = 'osm-bright'): string {
  return TILE_URL_TEMPLATE.replace('osm-bright', style);
}

export interface RouteResult {
  coordinates: [number, number][]; // [lon, lat]
  distance: number; // em metros
  time: number; // em segundos
}

export async function calculateRoute(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  mode: 'drive' | 'walk' | 'bicycle' = 'drive'
): Promise<RouteResult> {
  const waypoints = `${origin.lat},${origin.lon}|${destination.lat},${destination.lon}`;
  const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=${mode}&apiKey=${GEOAPIFY_API_KEY}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  // Extrair coordenadas da rota
  let coordinates: [number, number][] = [];
  const geometry = data.features?.[0]?.geometry;
  
  if (geometry?.type === 'MultiLineString' && Array.isArray(geometry.coordinates)) {
    coordinates = geometry.coordinates[0] || [];
  } else if (geometry?.type === 'LineString' && Array.isArray(geometry.coordinates)) {
    coordinates = geometry.coordinates;
  }
  
  // Extrair distância e tempo
  const properties = data.features?.[0]?.properties || {};
  const distance = properties.distance || 0;
  const time = properties.time || 0;

  return {
    coordinates,
    distance,
    time,
  };
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

export function formatTime(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hours}h ${mins}min`;
  }
  if (seconds >= 60) {
    return `${Math.round(seconds / 60)} min`;
  }
  return `${Math.round(seconds)} seg`;
}

export function convertToLatLng(coords: [number, number][]): { latitude: number; longitude: number }[] {
  return coords.map(([lon, lat]) => ({ latitude: lat, longitude: lon }));
}
