import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import AsyncContent from '@/components/ui/AsyncContent';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/ui/PageHeader';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { BREADCRUMBS } from '@/constants/navigation';
import { getDonorDetailsPath, ROUTES } from '@/constants/routes';
import DonorForm from '@/features/donors/DonorForm';
import { DONOR_INITIAL_VALUES, toDonorFormValues } from '@/features/donors/donorSchema';
import { useFetch } from '@/hooks/useFetch';
import { useNotifiedAction } from '@/hooks/useNotifiedAction';
import { createDonor, getDonorById, updateDonor } from '@/services/donorService';

// One page for both /donors/new (create) and /donors/:id/edit (edit): an :id means edit mode.
function DonorFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const runAction = useNotifiedAction();
  // Edit mode loads the donor to pre-fill the form; create mode has nothing to load.
  const fetchDonor = useCallback(() => (id ? getDonorById(id) : Promise.resolve(null)), [id]);
  const { data: donor, isLoading, error, reload } = useFetch(fetchDonor);

  const saveDonor = async (values) => {
    const save = () => (isEditMode ? updateDonor(id, values) : createDonor(values));
    const successMessage = isEditMode
      ? LABELS.donorUpdated(values.name)
      : LABELS.donorCreated(values.name);
    const { isSuccess, data: savedDonor } = await runAction(save, successMessage);
    if (isSuccess) {
      navigate(getDonorDetailsPath(savedDonor.id));
    }
  };

  const title = isEditMode ? LABELS.EDIT_DONOR_TITLE : LABELS.ADD_DONOR_TITLE;
  const donorCrumb = donor ? [{ to: getDonorDetailsPath(donor.id), label: donor.name }] : [];

  return (
    <section className="page">
      <PageHeader
        title={title}
        breadcrumbs={[BREADCRUMBS.DASHBOARD, BREADCRUMBS.DONORS, ...donorCrumb]}
        breadcrumbLabel={LABELS.BREADCRUMB}
      />
      <AsyncContent
        isLoading={isLoading}
        error={error}
        isEmpty={isEditMode && !donor}
        loadingText={LABELS.LOADING}
        emptyText={MESSAGES.NOT_FOUND}
        retryLabel={LABELS.RETRY}
        onRetry={reload}
      >
        <Card>
          <DonorForm
            // A new key resets the form's state when a different donor is loaded.
            key={donor?.id ?? 'new'}
            initialValues={donor ? toDonorFormValues(donor) : DONOR_INITIAL_VALUES}
            onSubmit={saveDonor}
            submitLabel={isEditMode ? LABELS.SAVE_DONOR : LABELS.ADD_DONOR}
            cancelTo={isEditMode ? getDonorDetailsPath(id) : ROUTES.DONORS}
          />
        </Card>
      </AsyncContent>
    </section>
  );
}

export default DonorFormPage;
