import { useState } from 'react';
import Alert from '@/components/ui/Alert';
import AsyncContent from '@/components/ui/AsyncContent';
import Pagination from '@/components/ui/Pagination';
import { APP_CONFIG } from '@/constants/config';
import { LABELS } from '@/constants/labels';
import { PERMISSIONS } from '@/constants/roles';
import DeleteDonorDialog from '@/features/donors/DeleteDonorDialog';
import DonorFilters from '@/features/donors/DonorFilters';
import DonorTable from '@/features/donors/DonorTable';
import { useDonors } from '@/features/donors/useDonors';
import { useAuth } from '@/hooks/useAuth';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { hasPermission } from '@/utils/hasPermission';

const INITIAL_FILTERS = { search: '', bloodGroup: '' };

function DonorListPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(0);
  const [donorToDelete, setDonorToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const search = useDebouncedValue(filters.search, APP_CONFIG.SEARCH_DEBOUNCE_MS);
  const { donors, totalPages, isLoading, error, reload } = useDonors({
    page,
    search,
    bloodGroup: filters.bloodGroup,
  });
  // Hiding Delete is UX, NOT security; the API must reject deletes from non-admins.
  const canDelete = hasPermission(user, PERMISSIONS.DONOR_DELETE);

  const changeFilter = (name, value) => {
    setFilters((previous) => ({ ...previous, [name]: value }));
    setPage(0);
  };

  const handleDeleted = (donor) => {
    setDonorToDelete(null);
    setSuccessMessage(LABELS.donorDeleted(donor.name));
    // Deleting the only row on a later page would leave an empty page, so step back one.
    const isLastRowOnPage = donors.length === 1 && page > 0;
    if (isLastRowOnPage) {
      setPage(page - 1);
    } else {
      reload();
    }
  };

  return (
    <section className="page">
      <h1 className="page__title">{LABELS.DONORS_TITLE}</h1>
      <DonorFilters filters={filters} onChange={changeFilter} />
      <Alert message={successMessage} variant="success" />
      <AsyncContent
        isLoading={isLoading}
        error={error}
        isEmpty={donors.length === 0}
        loadingText={LABELS.LOADING}
        emptyText={LABELS.NO_DONORS}
        retryLabel={LABELS.RETRY}
        onRetry={reload}
      >
        <DonorTable donors={donors} canDelete={canDelete} onDeleteClick={setDonorToDelete} />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          statusText={LABELS.pageStatus(page + 1, totalPages)}
          previousLabel={LABELS.PREVIOUS}
          nextLabel={LABELS.NEXT}
          ariaLabel={LABELS.PAGINATION}
        />
      </AsyncContent>
      {donorToDelete && (
        <DeleteDonorDialog
          donor={donorToDelete}
          onCancel={() => setDonorToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
    </section>
  );
}

export default DonorListPage;
