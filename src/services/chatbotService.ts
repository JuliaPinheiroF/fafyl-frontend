import { API_BASE } from '@/config/env';

export async function sendChatMessage(message: string): Promise<string> {
  const response = await fetch(`${API_BASE}/chatbot?question=${encodeURIComponent(message)}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.text();
  return data;
}
