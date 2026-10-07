import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/utils/getErrorMessage';

/**
 * Runs `fetchData` (a function returning a promise) and tracks its result.
 * `fetchData` must be wrapped in useCallback, so it only changes when its inputs change;
 * every change triggers a new request.
 * Returns { data, isLoading, error, reload }.
 */
export function useFetch(fetchData) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    // Ignore an old response that arrives after the inputs already changed.
    let isCurrent = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await fetchData();
        if (isCurrent) {
          setData(result);
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      isCurrent = false;
    };
  }, [fetchData, reloadCount]);

  const reload = () => setReloadCount((count) => count + 1);

  return { data, isLoading, error, reload };
}
