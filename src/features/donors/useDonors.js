import { useEffect, useState } from 'react';
import { APP_CONFIG } from '@/constants/config';
import { getDonors } from '@/services/donorService';

const EMPTY_PAGE = { content: [], totalElements: 0, totalPages: 0 };

/**
 * Loads one page of donors whenever the page or filters change.
 * Returns { donors, totalPages, isLoading, error, reload }.
 */
export function useDonors({ page, search, bloodGroup }) {
  const [donorPage, setDonorPage] = useState(EMPTY_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    // Ignore an old response that arrives after the user already changed the filters.
    let isCurrent = true;
    setIsLoading(true);
    setError('');
    const loadDonors = async () => {
      try {
        const result = await getDonors({
          page,
          size: APP_CONFIG.DONORS_PAGE_SIZE,
          search,
          bloodGroup,
        });
        if (isCurrent) {
          setDonorPage(result);
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };
    loadDonors();
    return () => {
      isCurrent = false;
    };
  }, [page, search, bloodGroup, reloadCount]);

  const reload = () => setReloadCount((count) => count + 1);

  return {
    donors: donorPage.content,
    totalPages: donorPage.totalPages,
    isLoading,
    error,
    reload,
  };
}
