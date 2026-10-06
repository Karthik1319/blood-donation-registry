import PropTypes from 'prop-types';
import { LABELS } from '@/constants/labels';

/**
 * A donor's main details as a label/value list.
 * @param {object} props
 * @param {{name: string, bloodGroup: string, phone: string}} props.donor - the donor.
 */
function DonorSummary({ donor }) {
  return (
    <dl className="details">
      <dt>{LABELS.COLUMN_NAME}</dt>
      <dd>{donor.name}</dd>
      <dt>{LABELS.COLUMN_BLOOD_GROUP}</dt>
      <dd>
        <span className="badge">{donor.bloodGroup}</span>
      </dd>
      <dt>{LABELS.COLUMN_PHONE}</dt>
      <dd>{donor.phone}</dd>
    </dl>
  );
}

DonorSummary.propTypes = {
  donor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    bloodGroup: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
};

export default DonorSummary;
