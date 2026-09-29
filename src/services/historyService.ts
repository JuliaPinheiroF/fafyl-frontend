import { request } from './api';

export interface HistoryEntry {
  id: number;
  course: {
    id: number;
    name: string;
    description: string;
    discWeights?: Record<string, number>;
  };
  accessedAt: string;
}

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    return await request<HistoryEntry[]>('/auth/history');
  } catch {
    return [];
  }
}

export async function addHistory(courseId: number): Promise<void> {
  try {
    await request(`/auth/history?idCourse=${courseId}`, { method: 'POST' });
  } catch {
    // best effort: falha de rede/401 não deve quebrar o fluxo do quiz
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
