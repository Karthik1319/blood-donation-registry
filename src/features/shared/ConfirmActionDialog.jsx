import { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { LABELS } from '@/constants/labels';
import { useNotifiedAction } from '@/hooks/useNotifiedAction';

/**
 * "Are you sure?" dialog that runs an API action once confirmed: deleting a donor or donation,
 * disabling an account, changing a role... Success and failure are reported with a toast; on
 * failure the dialog stays open so the user can retry or cancel.
 * @param {object} props
 * @param {string} props.title - dialog heading, e.g. "Delete donor?".
 * @param {string} props.message - what will happen.
 * @param {string} props.confirmLabel - confirm button text, e.g. "Delete".
 * @param {string} props.confirmingLabel - confirm button text while the action runs.
 * @param {boolean} [props.isDangerous] - red confirm button, for destructive actions.
 * @param {Function} props.onConfirm - calls the API, e.g. () => deleteDonor(id).
 * @param {string} props.successMessage - toast text after success.
 * @param {Function} props.onCancel - closes the dialog.
 * @param {Function} props.onDone - called after success (close + refresh).
 * @param {React.ReactNode} [props.children] - extra content, e.g. a dropdown to choose a value.
 */
function ConfirmActionDialog({
  title,
  message,
  confirmLabel,
  confirmingLabel,
  isDangerous = true,
  onConfirm,
  successMessage,
  onCancel,
  onDone,
  children = null,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const runAction = useNotifiedAction();

  const confirm = async () => {
    setIsRunning(true);
    const { isSuccess } = await runAction(onConfirm, successMessage);
    if (isSuccess) {
      onDone();
    } else {
      setIsRunning(false);
    }
  };

  return (
    <ConfirmDialog
      title={title}
      message={message}
      confirmLabel={confirmLabel}
      confirmingLabel={confirmingLabel}
      confirmVariant={isDangerous ? 'danger' : 'primary'}
      cancelLabel={LABELS.CANCEL}
      onConfirm={confirm}
      onCancel={onCancel}
      isConfirming={isRunning}
    >
      {children}
    </ConfirmDialog>
  );
}

ConfirmActionDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  confirmingLabel: PropTypes.string.isRequired,
  isDangerous: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  successMessage: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default ConfirmActionDialog;
