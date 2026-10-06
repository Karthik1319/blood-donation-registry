import { useCallback } from 'react';
import { useParams } from 'react-router';
import AsyncContent from '@/components/ui/AsyncContent';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/ui/PageHeader';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { BREADCRUMBS } from '@/constants/navigation';
import DonationTable from '@/features/donors/DonationTable';
import DonorSummary from '@/features/donors/DonorSummary';
import { useFetch } from '@/hooks/useFetch';
import { getDonorById, getDonorDonations } from '@/services/donorService';

function DonorDetailsPage() {
  const { id } = useParams();
  const fetchDonor = useCallback(() => getDonorById(id), [id]);
  const fetchDonations = useCallback(() => getDonorDonations(id), [id]);
  const donorRequest = useFetch(fetchDonor);
  const donationsRequest = useFetch(fetchDonations);
  const donor = donorRequest.data;
  const donations = donationsRequest.data ?? [];

  return (
    <section className="page">
      <PageHeader
        title={donor?.name ?? LABELS.DONOR_DETAILS_TITLE}
        breadcrumbs={[BREADCRUMBS.DASHBOARD, BREADCRUMBS.DONORS]}
        breadcrumbLabel={LABELS.BREADCRUMB}
      />
      <AsyncContent
        isLoading={donorRequest.isLoading}
        error={donorRequest.error}
        isEmpty={!donor}
        loadingText={LABELS.LOADING}
        emptyText={MESSAGES.NOT_FOUND}
        retryLabel={LABELS.RETRY}
        onRetry={donorRequest.reload}
      >
        <Card title={LABELS.DONOR_DETAILS_TITLE} titleAs="h2" isWide>
          {donor && <DonorSummary donor={donor} />}
        </Card>
        {/* The child list for this parent: GET /donors/:id/donations */}
        <Card title={LABELS.DONATIONS_TITLE} titleAs="h2" isWide>
          <AsyncContent
            isLoading={donationsRequest.isLoading}
            error={donationsRequest.error}
            isEmpty={donations.length === 0}
            loadingText={LABELS.LOADING}
            emptyText={LABELS.NO_DONATIONS}
            retryLabel={LABELS.RETRY}
            onRetry={donationsRequest.reload}
          >
            <DonationTable donations={donations} />
          </AsyncContent>
        </Card>
      </AsyncContent>
    </section>
  );
}

export default DonorDetailsPage;
