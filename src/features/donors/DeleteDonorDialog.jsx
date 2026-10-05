import { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { LABELS } from '@/constants/labels';
import { deleteDonor } from '@/services/donorService';

/**
 * Asks for confirmation, then deletes the donor through the API.
 * @param {object} props
 * @param {{id: number, name: string}} props.donor - donor to delete.
 * @param {Function} props.onCancel - closes the dialog.
 * @param {Function} props.onDeleted - called with the donor after a successful delete.
 */
function DeleteDonorDialog({ donor, onCancel, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const confirmDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await deleteDonor(donor.id);
      onDeleted(donor);
    } catch (deleteError) {
      setError(deleteError.message);
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      title={LABELS.DELETE_DONOR_TITLE}
      message={LABELS.deleteDonorMessage(donor.name)}
      confirmLabel={LABELS.DELETE}
      confirmingLabel={LABELS.DELETING}
      cancelLabel={LABELS.CANCEL}
      onConfirm={confirmDelete}
      onCancel={onCancel}
      isConfirming={isDeleting}
      error={error}
    />
  );
}

DeleteDonorDialog.propTypes = {
  donor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onDeleted: PropTypes.func.isRequired,
};

export default DeleteDonorDialog;
