import PropTypes from 'prop-types';
import { LABELS } from '@/constants/labels';
import { getTodayIsoDate } from '@/utils/dateUtils';
import { getEligibility } from '@/utils/donationEligibility';
import { formatDate } from '@/utils/formatDate';

/**
 * Banner saying whether the donor may donate today (the 90-day rule), with icon + text so color
 * is never the only signal.
 * @param {object} props
 * @param {{donationDate: string}[]} props.donations - the donor's donations.
 */
function EligibilityStatus({ donations }) {
  const { isEligible, lastDonationDate, nextEligibleDate } = getEligibility(
    donations,
    getTodayIsoDate(),
  );
  const statusText = isEligible
    ? LABELS.ELIGIBLE
    : LABELS.notEligibleUntil(formatDate(nextEligibleDate));

  return (
    <p className={isEligible ? 'eligibility eligibility--yes' : 'eligibility eligibility--no'}>
      <strong>
        <span aria-hidden="true">{isEligible ? LABELS.SUCCESS_ICON : LABELS.ERROR_ICON}</span>{' '}
        {statusText}
      </strong>
      {lastDonationDate && <span>{LABELS.lastDonation(formatDate(lastDonationDate))}</span>}
    </p>
  );
}

EligibilityStatus.propTypes = {
  donations: PropTypes.arrayOf(PropTypes.shape({ donationDate: PropTypes.string.isRequired }))
    .isRequired,
};

export default EligibilityStatus;
