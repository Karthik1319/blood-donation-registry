import { useCallback } from 'react';
import { Link, useParams } from 'react-router';
import AsyncContent from '@/components/ui/AsyncContent';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/ui/PageHeader';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { BREADCRUMBS } from '@/constants/navigation';
import { getDonorEditPath } from '@/constants/routes';
import DonorDonations from '@/features/donations/DonorDonations';
import DonorSummary from '@/features/donors/DonorSummary';
import { useDonorPermissions } from '@/features/donors/useDonorPermissions';
import { useFetch } from '@/hooks/useFetch';
import { getDonorById } from '@/services/donorService';

function DonorDetailsPage() {
  const { id } = useParams();
  const { canEdit } = useDonorPermissions();
  const fetchDonor = useCallback(() => getDonorById(id), [id]);
  const { data: donor, isLoading, error, reload } = useFetch(fetchDonor);

  return (
    <section className="page">
      <PageHeader
        title={donor?.name ?? LABELS.DONOR_DETAILS_TITLE}
        breadcrumbs={[BREADCRUMBS.DASHBOARD, BREADCRUMBS.DONORS]}
        breadcrumbLabel={LABELS.BREADCRUMB}
        actions={
          canEdit &&
          donor && (
            <Link to={getDonorEditPath(donor.id)} className="button button--primary">
              {LABELS.EDIT}
            </Link>
          )
        }
      />
      <AsyncContent
        isLoading={isLoading}
        error={error}
        isEmpty={!donor}
        loadingText={LABELS.LOADING}
        emptyText={MESSAGES.NOT_FOUND}
        retryLabel={LABELS.RETRY}
        onRetry={reload}
      >
        <Card title={LABELS.DONOR_DETAILS_TITLE} titleAs="h2" isWide>
          {donor && <DonorSummary donor={donor} />}
        </Card>
        <DonorDonations donorId={id} />
      </AsyncContent>
    </section>
  );
}

export default DonorDetailsPage;
