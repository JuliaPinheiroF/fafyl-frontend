import { API_BASE } from '@/config/env';

export async function sendChatMessage(message: string): Promise<string> {
  // Endpoint em desenvolvimento
  // const response = await fetch(`${API_BASE}/model/chat`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ message }),
  // });
  // if (!response.ok) throw new Error(`HTTP ${response.status}`);
  // const data = await response.json();
  // return data.reply;

  return 'tem que ver isso ai';
}
