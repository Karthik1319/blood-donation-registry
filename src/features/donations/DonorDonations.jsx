import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import AsyncContent from '@/components/ui/AsyncContent';
import Card from '@/components/ui/Card';
import { LABELS } from '@/constants/labels';
import { CRUD_PERMISSIONS } from '@/constants/roles';
import { getDonationNewPath } from '@/constants/routes';
import DonationTable from '@/features/donations/DonationTable';
import EligibilityStatus from '@/features/donations/EligibilityStatus';
import ConfirmActionDialog from '@/features/shared/ConfirmActionDialog';
import { useCrudPermissions } from '@/hooks/useCrudPermissions';
import { useFetch } from '@/hooks/useFetch';
import { deleteDonation, getDonorDonations } from '@/services/donationService';
import { formatDate } from '@/utils/formatDate';

/**
 * A donor's donation history (the child list of GET /donors/:id/donations) with the 90-day
 * eligibility banner and Add / Edit / Delete, each shown only if the user's role allows it.
 * @param {object} props
 * @param {string|number} props.donorId - the donor whose donations are shown.
 */
function DonorDonations({ donorId }) {
  const { canCreate, canEdit, canDelete } = useCrudPermissions(CRUD_PERMISSIONS.DONATION);
  const [donationToDelete, setDonationToDelete] = useState(null);
  const fetchDonations = useCallback(() => getDonorDonations(donorId), [donorId]);
  const { data, isLoading, error, reload } = useFetch(fetchDonations);
  const donations = data ?? [];

  const handleDeleted = () => {
    setDonationToDelete(null);
    reload();
  };

  return (
    <Card title={LABELS.DONATIONS_TITLE} titleAs="h2" isWide>
      <AsyncContent
        isLoading={isLoading}
        error={error}
        loadingText={LABELS.LOADING}
        retryLabel={LABELS.RETRY}
        onRetry={reload}
      >
        <div className="section-toolbar">
          <EligibilityStatus donations={donations} />
          {canCreate && (
            <Link to={getDonationNewPath(donorId)} className="button button--primary">
              {LABELS.ADD_DONATION}
            </Link>
          )}
        </div>
        {/* Empty state handled here so the toolbar (and Add donation) still shows. */}
        {donations.length === 0 ? (
          <p className="empty-message">{LABELS.NO_DONATIONS}</p>
        ) : (
          <DonationTable
            donations={donations}
            canEdit={canEdit}
            canDelete={canDelete}
            onDeleteClick={setDonationToDelete}
          />
        )}
      </AsyncContent>
      {donationToDelete && (
        <ConfirmActionDialog
          title={LABELS.DELETE_DONATION_TITLE}
          message={LABELS.deleteDonationMessage(formatDate(donationToDelete.donationDate))}
          confirmLabel={LABELS.DELETE}
          confirmingLabel={LABELS.DELETING}
          onConfirm={() => deleteDonation(donationToDelete.id)}
          successMessage={LABELS.donationDeleted(formatDate(donationToDelete.donationDate))}
          onCancel={() => setDonationToDelete(null)}
          onDone={handleDeleted}
        />
      )}
    </Card>
  );
}

DonorDonations.propTypes = {
  donorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default DonorDonations;
