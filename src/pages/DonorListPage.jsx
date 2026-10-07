import { useState } from 'react';
import { Link } from 'react-router';
import AsyncContent from '@/components/ui/AsyncContent';
import PageHeader from '@/components/ui/PageHeader';
import Pagination from '@/components/ui/Pagination';
import { LABELS } from '@/constants/labels';
import { BREADCRUMBS } from '@/constants/navigation';
import { ROUTES } from '@/constants/routes';
import DonorFilters from '@/features/donors/DonorFilters';
import DonorTable from '@/features/donors/DonorTable';
import { useDonorPermissions } from '@/features/donors/useDonorPermissions';
import { useDonors } from '@/features/donors/useDonors';
import DeleteDialog from '@/features/shared/DeleteDialog';
import { deleteDonor } from '@/services/donorService';

function DonorListPage() {
  const [donorToDelete, setDonorToDelete] = useState(null);
  const { filters, changeFilter, page, setPage, donors, totalPages, isLoading, error, reload } =
    useDonors();
  const { canCreate, canEdit, canDelete } = useDonorPermissions();

  const handleDeleted = () => {
    setDonorToDelete(null);
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
      <PageHeader
        title={LABELS.DONORS_TITLE}
        breadcrumbs={[BREADCRUMBS.DASHBOARD]}
        breadcrumbLabel={LABELS.BREADCRUMB}
        actions={
          canCreate && (
            <Link to={ROUTES.DONOR_NEW} className="button button--primary">
              {LABELS.ADD_DONOR}
            </Link>
          )
        }
      />
      <DonorFilters filters={filters} onChange={changeFilter} />
      <AsyncContent
        isLoading={isLoading}
        error={error}
        isEmpty={donors.length === 0}
        loadingText={LABELS.LOADING}
        emptyText={LABELS.NO_DONORS}
        retryLabel={LABELS.RETRY}
        onRetry={reload}
      >
        <DonorTable
          donors={donors}
          canEdit={canEdit}
          canDelete={canDelete}
          onDeleteClick={setDonorToDelete}
        />
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
        <DeleteDialog
          title={LABELS.DELETE_DONOR_TITLE}
          message={LABELS.deleteDonorMessage(donorToDelete.name)}
          onDelete={() => deleteDonor(donorToDelete.id)}
          successMessage={LABELS.donorDeleted(donorToDelete.name)}
          onCancel={() => setDonorToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
    </section>
  );
}

export default DonorListPage;
