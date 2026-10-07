import { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { LABELS } from '@/constants/labels';
import { useNotifiedAction } from '@/hooks/useNotifiedAction';

/**
 * "Are you sure?" dialog that runs a delete through the API, for any kind of record (donor,
 * donation...). Success and failure are reported with a toast; on failure the dialog stays open
 * so the user can retry or cancel.
 * @param {object} props
 * @param {string} props.title - dialog heading, e.g. "Delete donor?".
 * @param {string} props.message - what will be removed.
 * @param {Function} props.onDelete - calls the API, e.g. () => deleteDonor(id).
 * @param {string} props.successMessage - toast text after a successful delete.
 * @param {Function} props.onCancel - closes the dialog.
 * @param {Function} props.onDeleted - called after a successful delete (close + refresh).
 */
function DeleteDialog({ title, message, onDelete, successMessage, onCancel, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const runAction = useNotifiedAction();

  const confirmDelete = async () => {
    setIsDeleting(true);
    const { isSuccess } = await runAction(onDelete, successMessage);
    if (isSuccess) {
      onDeleted();
    } else {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      title={title}
      message={message}
      confirmLabel={LABELS.DELETE}
      confirmingLabel={LABELS.DELETING}
      cancelLabel={LABELS.CANCEL}
      onConfirm={confirmDelete}
      onCancel={onCancel}
      isConfirming={isDeleting}
    />
  );
}

DeleteDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  successMessage: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDeleted: PropTypes.func.isRequired,
};

export default DeleteDialog;
