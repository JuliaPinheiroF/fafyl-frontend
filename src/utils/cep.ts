export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isValidCep(value: string): boolean {
  return onlyDigits(value).length === 8;
}

export function looksLikeCep(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 5 || trimmed.length > 9) return false;
  return trimmed.replace(/\D/g, '').length >= 5;
}