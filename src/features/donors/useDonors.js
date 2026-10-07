import { useCallback, useState } from 'react';
import { APP_CONFIG } from '@/constants/config';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useFetch } from '@/hooks/useFetch';
import { getDonors } from '@/services/donorService';

const INITIAL_FILTERS = { search: '', bloodGroup: '' };

/**
 * Everything the donor list needs: filter values, the current page, and that page of donors,
 * reloaded whenever the page or filters change. The search waits until typing stops.
 * Returns { filters, changeFilter, page, setPage, donors, totalPages, isLoading, error, reload }.
 */
export function useDonors() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(0);
  const search = useDebouncedValue(filters.search, APP_CONFIG.SEARCH_DEBOUNCE_MS);
  const { bloodGroup } = filters;

  const fetchDonors = useCallback(
    () => getDonors({ page, size: APP_CONFIG.DONORS_PAGE_SIZE, search, bloodGroup }),
    [page, search, bloodGroup],
  );
  const { data, isLoading, error, reload } = useFetch(fetchDonors);

  // A new filter starts again from the first page.
  const changeFilter = (name, value) => {
    setFilters((previous) => ({ ...previous, [name]: value }));
    setPage(0);
  };

  return {
    filters,
    changeFilter,
    page,
    setPage,
    donors: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    isLoading,
    error,
    reload,
  };
}
