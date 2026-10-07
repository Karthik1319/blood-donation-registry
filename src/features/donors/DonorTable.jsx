import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Button from '@/components/ui/Button';
import { LABELS } from '@/constants/labels';
import { getDonorDetailsPath, getDonorEditPath } from '@/constants/routes';

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
              <td>
                <Link to={getDonorDetailsPath(donor.id)}>{donor.name}</Link>
              </td>
              <td>
                <span className="badge">{donor.bloodGroup}</span>
              </td>
              <td>{donor.phone}</td>
              {hasActions && (
                <td className="table__actions">
                  {canEdit && (
                    <Link
                      to={getDonorEditPath(donor.id)}
                      className="button button--secondary"
                      aria-label={LABELS.editDonorAriaLabel(donor.name)}
                    >
                      {LABELS.EDIT}
                    </Link>
                  )}
                  {canDelete && (
                    <Button
                      variant="danger"
                      onClick={() => onDeleteClick(donor)}
                      ariaLabel={LABELS.deleteDonorAriaLabel(donor.name)}
                    >
                      {LABELS.DELETE}
                    </Button>
                  )}
                </td>
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
