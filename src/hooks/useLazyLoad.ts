import { useEffect, useState } from 'react';

interface UseLazyLoadOptions<T> {
  timeout?: number;
  minDuration?: number;
}

export function useLazyLoad<T>(
  fetcher: () => Promise<T>,
  options: UseLazyLoadOptions<T> = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { timeout = 300, minDuration = 500 } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      const result = await fetcher();
      const elapsed = Date.now() - startTime;
      
      if (elapsed < minDuration) {
        await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
      }
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar dados'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchData, timeout);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading, error, refetch: fetchData };
}