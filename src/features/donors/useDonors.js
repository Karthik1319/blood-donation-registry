import { useCallback } from 'react';
import { APP_CONFIG } from '@/constants/config';
import { useFetch } from '@/hooks/useFetch';
import { getDonors } from '@/services/donorService';

/**
 * Loads one page of donors whenever the page or filters change.
 * Returns { donors, totalPages, isLoading, error, reload }.
 */
export function useDonors({ page, search, bloodGroup }) {
  const fetchDonors = useCallback(
    () => getDonors({ page, size: APP_CONFIG.DONORS_PAGE_SIZE, search, bloodGroup }),
    [page, search, bloodGroup],
  );
  const { data, isLoading, error, reload } = useFetch(fetchDonors);

  return {
    donors: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    isLoading,
    error,
    reload,
  };
}
