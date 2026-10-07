import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Button from '@/components/ui/Button';
import { LABELS } from '@/constants/labels';

/**
 * The Edit link and Delete button at the end of a table row. Each one only appears if allowed.
 * @param {object} props
 * @param {boolean} props.canEdit - shows Edit.
 * @param {boolean} props.canDelete - shows Delete.
 * @param {string} props.editTo - route of the edit page.
 * @param {string} props.editLabel - screen-reader name, e.g. "Edit Ravi Kumar".
 * @param {string} props.deleteLabel - screen-reader name, e.g. "Delete Ravi Kumar".
 * @param {Function} props.onDelete - opens the delete confirmation.
 */
function RowActions({ canEdit, canDelete, editTo, editLabel, deleteLabel, onDelete }) {
  return (
    <td data-label={LABELS.COLUMN_ACTIONS}>
      <div className="table__actions">
        {canEdit && (
          <Link to={editTo} className="button button--secondary" aria-label={editLabel}>
            {LABELS.EDIT}
          </Link>
        )}
        {canDelete && (
          <Button variant="danger" onClick={onDelete} ariaLabel={deleteLabel}>
            {LABELS.DELETE}
          </Button>
        )}
      </div>
    </td>
  );
}

RowActions.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  editTo: PropTypes.string.isRequired,
  editLabel: PropTypes.string.isRequired,
  deleteLabel: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RowActions;
