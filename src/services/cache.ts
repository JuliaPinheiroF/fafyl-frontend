const store = new Map<string, { promise: Promise<unknown>; expiresAt: number }>();

export function cached<T>(key: string, factory: () => Promise<T>, ttlMs = 5 * 60_000): Promise<T> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && hit.expiresAt > now) return hit.promise as Promise<T>;

  const promise = factory().catch((err) => {
    store.delete(key);
    throw err;
  });
  store.set(key, { promise, expiresAt: now + ttlMs });
  return promise;
}

export function clearCache() {
  store.clear();
}