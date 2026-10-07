import PropTypes from 'prop-types';
import { LABELS } from '@/constants/labels';
import { getDonationEditPath } from '@/constants/routes';
import RowActions from '@/features/shared/RowActions';
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
                <td data-label={LABELS.COLUMN_DATE}>{date}</td>
                <td data-label={LABELS.COLUMN_QUANTITY}>
                  {LABELS.quantityInMl(donation.quantity)}
                </td>
                <td data-label={LABELS.COLUMN_LOCATION}>{donation.location}</td>
                {hasActions && (
                  <RowActions
                    canEdit={canEdit}
                    canDelete={canDelete}
                    editTo={getDonationEditPath(donation.donorId, donation.id)}
                    editLabel={LABELS.editDonationAriaLabel(date)}
                    deleteLabel={LABELS.deleteDonationAriaLabel(date)}
                    onDelete={() => onDeleteClick(donation)}
                  />
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
