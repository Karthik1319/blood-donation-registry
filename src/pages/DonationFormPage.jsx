import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import AsyncContent from '@/components/ui/AsyncContent';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/ui/PageHeader';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { BREADCRUMBS } from '@/constants/navigation';
import { getDonorDetailsPath } from '@/constants/routes';
import DonationForm from '@/features/donations/DonationForm';
import { DONATION_INITIAL_VALUES, toDonationFormValues } from '@/features/donations/donationSchema';
import { useFetch } from '@/hooks/useFetch';
import { useNotifiedAction } from '@/hooks/useNotifiedAction';
import { createDonation, getDonorDonations, updateDonation } from '@/services/donationService';
import { getDonorById } from '@/services/donorService';
import { formatDate } from '@/utils/formatDate';

// One page for both /donors/:id/donations/new and /donors/:id/donations/:donationId/edit.
function DonationFormPage() {
  const { id: donorId, donationId } = useParams();
  const isEditMode = Boolean(donationId);
  const navigate = useNavigate();
  const runAction = useNotifiedAction();
  const fetchDonor = useCallback(() => getDonorById(donorId), [donorId]);
  // The donor's donations are needed anyway for the 90-day check; edit mode finds its row there.
  const fetchDonations = useCallback(() => getDonorDonations(donorId), [donorId]);
  const donorRequest = useFetch(fetchDonor);
  const donationsRequest = useFetch(fetchDonations);
  const donor = donorRequest.data;
  // Memoized so the form's Zod schema isn't rebuilt on every render.
  const donations = useMemo(() => donationsRequest.data ?? [], [donationsRequest.data]);
  const donation = donations.find((d) => d.id === Number(donationId));
  const detailsPath = getDonorDetailsPath(donorId);

  const retryLoading = () => {
    donorRequest.reload();
    donationsRequest.reload();
  };

  const saveDonation = async (values) => {
    const save = () =>
      isEditMode ? updateDonation(donationId, values) : createDonation(donorId, values);
    const date = formatDate(values.donationDate);
    const message = isEditMode ? LABELS.donationUpdated(date) : LABELS.donationCreated(date);
    const { isSuccess } = await runAction(save, message);
    if (isSuccess) {
      navigate(detailsPath);
    }
  };

  const title = isEditMode ? LABELS.EDIT_DONATION_TITLE : LABELS.ADD_DONATION_TITLE;
  const donorCrumb = donor ? [{ to: detailsPath, label: donor.name }] : [];

  return (
    <section className="page">
      <PageHeader
        title={title}
        breadcrumbs={[BREADCRUMBS.DASHBOARD, BREADCRUMBS.DONORS, ...donorCrumb]}
        breadcrumbLabel={LABELS.BREADCRUMB}
      />
      <AsyncContent
        isLoading={donorRequest.isLoading || donationsRequest.isLoading}
        error={donorRequest.error || donationsRequest.error}
        isEmpty={!donor || (isEditMode && !donation)}
        loadingText={LABELS.LOADING}
        emptyText={MESSAGES.NOT_FOUND}
        retryLabel={LABELS.RETRY}
        onRetry={retryLoading}
      >
        <Card>
          <DonationForm
            initialValues={donation ? toDonationFormValues(donation) : DONATION_INITIAL_VALUES}
            donations={donations}
            editingId={donation?.id}
            onSubmit={saveDonation}
            submitLabel={isEditMode ? LABELS.SAVE_DONATION : LABELS.ADD_DONATION}
            cancelTo={detailsPath}
          />
        </Card>
      </AsyncContent>
    </section>
  );
}

export default DonationFormPage;
