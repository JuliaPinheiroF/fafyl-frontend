import { Coordinates, UserDTO } from '@/types';
import { request } from './api';
import { clearToken } from './tokenStore';

export interface AuthResponse {
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  locale?: Coordinates;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export async function getMe(): Promise<UserDTO | null> {
  try {
    return await request<UserDTO>('/auth/me');
  } catch {
    return null;
  }
}

export async function updateCoordinates(lat: number, lon: number): Promise<UserDTO | null> {
  try {
    return await request<UserDTO>('/auth/coordinates', {
      method: 'POST',
      body: { lat, lon },
    });
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  await clearToken();
}