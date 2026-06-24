interface CachedLocation {
  lat: number;
  lon: number;
  timestamp: number;
}

const CACHE_KEY = 'fafyl_user_location';
const CACHE_DURATION_MS = 60 * 60 * 1000;

export function getCachedLocation(): { lat: number; lon: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedLocation = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_DURATION_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return { lat: cached.lat, lon: cached.lon };
  } catch {
    return null;
  }
}

export function setCachedLocation(lat: number, lon: number): void {
  try {
    const data: CachedLocation = { lat, lon, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* localStorage may be full or unavailable */
  }
}

export function clearCachedLocation(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}
