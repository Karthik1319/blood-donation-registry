import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { LABELS } from '@/constants/labels';
import { getDonorDetailsPath, getDonorEditPath } from '@/constants/routes';
import RowActions from '@/features/shared/RowActions';

/**
 * Table of donors. The Actions column only exists when the user may edit or delete.
 * @param {object} props
 * @param {{id: number, name: string, bloodGroup: string, phone: string}[]} props.donors - rows.
 * @param {boolean} props.canEdit - shows the Edit links.
 * @param {boolean} props.canDelete - shows the Delete buttons.
 * @param {Function} props.onDeleteClick - called with the donor to delete.
 */
function DonorTable({ donors, canEdit, canDelete, onDeleteClick }) {
  const hasActions = canEdit || canDelete;

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">{LABELS.COLUMN_NAME}</th>
            <th scope="col">{LABELS.COLUMN_BLOOD_GROUP}</th>
            <th scope="col">{LABELS.COLUMN_PHONE}</th>
            {hasActions && <th scope="col">{LABELS.COLUMN_ACTIONS}</th>}
          </tr>
        </thead>
        <tbody>
          {donors.map((donor) => (
            <tr key={donor.id}>
              <td data-label={LABELS.COLUMN_NAME}>
                <Link to={getDonorDetailsPath(donor.id)}>{donor.name}</Link>
              </td>
              <td data-label={LABELS.COLUMN_BLOOD_GROUP}>
                <span className="badge">{donor.bloodGroup}</span>
              </td>
              <td data-label={LABELS.COLUMN_PHONE}>{donor.phone}</td>
              {hasActions && (
                <RowActions
                  canEdit={canEdit}
                  canDelete={canDelete}
                  editTo={getDonorEditPath(donor.id)}
                  editLabel={LABELS.editDonorAriaLabel(donor.name)}
                  deleteLabel={LABELS.deleteDonorAriaLabel(donor.name)}
                  onDelete={() => onDeleteClick(donor)}
                />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DonorTable.propTypes = {
  donors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      bloodGroup: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }),
  ).isRequired,
  canEdit: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default DonorTable;
