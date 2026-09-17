import { API_BASE } from '@/config/env';
import { getToken, saveToken } from './tokenStore';

export interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

async function fetchJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (response.status === 204) return undefined as T;
  return response.json();
}

async function tryRefreshToken(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return false;
    const data = await response.json();
    if (!data?.token) return false;
    await saveToken(data.token as string);
    return true;
  } catch {
    return false;
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    return await fetchJson<T>(path, options);
  } catch (err: any) {
    if (options.auth !== false && err?.message === 'HTTP 401') {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return await fetchJson<T>(path, options);
      }
      await saveToken(null);
    }
    throw err;
  }
}

function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export { API_BASE, buildQuery };