import { API_BASE, request } from './api';
import { UserDTO } from '@/types';

export async function updateCapelinho(capelinhoId: number): Promise<UserDTO> {
  const response = await fetch(`${API_BASE}/auth/capelinho/${capelinhoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function getUserCapelinho(): Promise<number | null> {
  try {
    const user: UserDTO = await request('/auth/me');
    return user.capelinho;
  } catch {
    return null;
  }
}

export const CAPELINHO_IMAGES: Record<number, any> = {
  1: require('../../assets/images/curioso.png'),
  2: require('../../assets/images/triste.png'),
  3: require('../../assets/images/muitofeliz.png'),
  4: require('../../assets/images/serio.png'),
};

export function getCapelinhoImage(capelinhoId: number | null | undefined): any {
  if (!capelinhoId || !CAPELINHO_IMAGES[capelinhoId]) {
    return CAPELINHO_IMAGES[1];
  }
  return CAPELINHO_IMAGES[capelinhoId];
}
