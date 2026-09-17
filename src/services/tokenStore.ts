import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@fafyl/token';

let currentToken: string | null = null;
const listeners = new Set<(token: string | null) => void>();

export async function loadStoredToken(): Promise<string | null> {
  try {
    currentToken = await AsyncStorage.getItem(TOKEN_KEY);
    return currentToken;
  } catch {
    return null;
  }
}

export async function saveToken(token: string | null): Promise<void> {
  currentToken = token;
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // storage indisponível: token permanece apenas em memória
  }
  listeners.forEach((cb) => cb(currentToken));
}

export function getToken(): string | null {
  return currentToken;
}

export function subscribeToToken(cb: (token: string | null) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export async function clearToken(): Promise<void> {
  await saveToken(null);
}