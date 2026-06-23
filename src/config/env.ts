const env = import.meta.env.MODE || 'development';

const API_URLS: Record<string, string> = {
  development: 'http://localhost:8080',
  test: 'http://localhost:8080',
  production: 'https://recommend-1-0.onrender.com',
};

const viteApiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
export const API_BASE = viteApiBase || API_URLS[env] || API_URLS.production;

export const IS_DEV = env === 'development';

export const USE_MOCKS =
  (import.meta.env.VITE_USE_MOCKS as string | undefined) === 'true' || false;
