import { API_BASE } from '@/config/env';

export function resolveImageUrl(imageRef: string | undefined | null): string {
  if (!imageRef) return '';
  if (imageRef.startsWith('http://') || imageRef.startsWith('https://')) {
    return imageRef;
  }
  return `${API_BASE}/storage/${imageRef}`;
}
