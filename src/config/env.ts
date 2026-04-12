const ENV = process.env.EXPO_PUBLIC_ENV || 'production';

const API_URLS = {
  development: 'http://localhost:8080',
  production: 'https://recommend-1-0.onrender.com',
};

export const API_BASE = API_URLS[ENV as keyof typeof API_URLS];
export const IS_DEV = ENV === 'development';
