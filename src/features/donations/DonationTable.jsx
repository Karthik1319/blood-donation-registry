import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Button from '@/components/ui/Button';
import { LABELS } from '@/constants/labels';
import { getDonationEditPath } from '@/constants/routes';
import { formatDate } from '@/utils/formatDate';

/**
 * Table of one donor's donations. The Actions column only exists when the user may edit or delete.
 * @param {object} props
 * @param {{id: number, donorId: number, donationDate: string, quantity: number, location: string}[]}
 *   props.donations - rows, newest first (the API sorts them).
 * @param {boolean} props.canEdit - shows the Edit links.
 * @param {boolean} props.canDelete - shows the Delete buttons.
 * @param {Function} props.onDeleteClick - called with the donation to delete.
 */
function DonationTable({ donations, canEdit, canDelete, onDeleteClick }) {
  const hasActions = canEdit || canDelete;

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">{LABELS.COLUMN_DATE}</th>
            <th scope="col">{LABELS.COLUMN_QUANTITY}</th>
            <th scope="col">{LABELS.COLUMN_LOCATION}</th>
            {hasActions && <th scope="col">{LABELS.COLUMN_ACTIONS}</th>}
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => {
            const date = formatDate(donation.donationDate);
            return (
              <tr key={donation.id}>
                <td>{date}</td>
                <td>{LABELS.quantityInMl(donation.quantity)}</td>
                <td>{donation.location}</td>
                {hasActions && (
                  <td className="table__actions">
                    {canEdit && (
                      <Link
                        to={getDonationEditPath(donation.donorId, donation.id)}
                        className="button button--secondary"
                        aria-label={LABELS.editDonationAriaLabel(date)}
                      >
                        {LABELS.EDIT}
                      </Link>
                    )}
                    {canDelete && (
                      <Button
                        variant="danger"
                        onClick={() => onDeleteClick(donation)}
                        ariaLabel={LABELS.deleteDonationAriaLabel(date)}
                      >
                        {LABELS.DELETE}
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

DonationTable.propTypes = {
  donations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      donorId: PropTypes.number.isRequired,
      donationDate: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
    }),
  ).isRequired,
  canEdit: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default DonationTable;
