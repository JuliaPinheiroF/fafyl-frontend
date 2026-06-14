const env = process.env.NODE_ENV || 'test';

const API_URLS = {
  development: 'http://localhost:8080',
  test: 'http://localhost:8080',
  production: 'https://recommend-1-0.onrender.com',
};

export const API_BASE = API_URLS[env as keyof typeof API_URLS] || API_URLS.production;
export const IS_DEV = env === 'development';
export const USE_MOCKS = true;
