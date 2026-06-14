import { USE_MOCKS } from '@/config/env';
import { API_BASE, request } from './api';

export interface HistoryEntry {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  course: {
    id: number;
    name: string;
    description: string;
    discWeights: Record<string, number>;
  };
  accessedAt: string;
}

export async function getHistory(): Promise<HistoryEntry[]> {
  if (USE_MOCKS) return [];
  try {
    return await request<HistoryEntry[]>('/auth/history');
  } catch {
    return [];
  }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
