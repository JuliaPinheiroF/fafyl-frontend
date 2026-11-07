const ENV = process.env.EXPO_PUBLIC_ENV || 'production';

const API_URLS = {
  development: 'https://recommend-1-0.onrender.com',
  local: 'http://localhost:8080',
  production: 'https://recommend-1-0.onrender.com',
};

const API_OVERRIDE = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE =
  API_OVERRIDE || API_URLS[ENV as keyof typeof API_URLS] || API_URLS.production;
export const IS_DEV = ENV === 'development' || ENV === 'local';
