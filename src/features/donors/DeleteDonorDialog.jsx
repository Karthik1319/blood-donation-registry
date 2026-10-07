import { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { LABELS } from '@/constants/labels';
import { useNotifiedAction } from '@/hooks/useNotifiedAction';
import { deleteDonor } from '@/services/donorService';

/**
 * Asks for confirmation, then deletes the donor through the API. Success and failure are
 * reported with a toast; on failure the dialog stays open so the user can retry or cancel.
 * @param {object} props
 * @param {{id: number, name: string}} props.donor - donor to delete.
 * @param {Function} props.onCancel - closes the dialog.
 * @param {Function} props.onDeleted - called with the donor after a successful delete.
 */
function DeleteDonorDialog({ donor, onCancel, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const runAction = useNotifiedAction();

  const confirmDelete = async () => {
    setIsDeleting(true);
    const { isSuccess } = await runAction(
      () => deleteDonor(donor.id),
      LABELS.donorDeleted(donor.name),
    );
    if (isSuccess) {
      onDeleted(donor);
    } else {
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
