
export function getTileUrl(_style?: string): string {
  return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
}

export interface RouteResult {
  coordinates: [number, number][]; // [lon, lat]
  distance: number; // em metros
  time: number; // em segundos
}

export async function calculateRoute(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  _mode?: string
): Promise<RouteResult> {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?geometries=geojson&overview=full`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  const route = data.routes?.[0];
  if (!route) throw new Error('No route found');

  return {
    coordinates: route.geometry.coordinates,
    distance: Math.round(route.distance),
    time: Math.round(route.duration),
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
