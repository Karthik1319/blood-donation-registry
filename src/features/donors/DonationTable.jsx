import PropTypes from 'prop-types';
import { LABELS } from '@/constants/labels';
import { formatDate } from '@/utils/formatDate';

/**
 * Table of one donor's donations.
 * @param {object} props
 * @param {{id: number, donationDate: string, quantity: number, location: string}[]} props.donations
 *   - rows, newest first (the API sorts them).
 */
function DonationTable({ donations }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">{LABELS.COLUMN_DATE}</th>
            <th scope="col">{LABELS.COLUMN_QUANTITY}</th>
            <th scope="col">{LABELS.COLUMN_LOCATION}</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td>{formatDate(donation.donationDate)}</td>
              <td>{LABELS.quantityInMl(donation.quantity)}</td>
              <td>{donation.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DonationTable.propTypes = {
  donations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      donationDate: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default DonationTable;
