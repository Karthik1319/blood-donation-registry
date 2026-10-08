import PropTypes from 'prop-types';
import { LABELS } from '@/constants/labels';
import ConfirmActionDialog from '@/features/shared/ConfirmActionDialog';
import { updateUser } from '@/services/userService';

/**
 * Confirms disabling an active account (red, destructive) or enabling a disabled one.
 * @param {object} props
 * @param {{id: number, fullName: string, enabled: boolean}} props.user - the account to change.
 * @param {Function} props.onCancel - closes the dialog.
 * @param {Function} props.onDone - called after the change.
 */
function ChangeStatusDialog({ user, onCancel, onDone }) {
  const isDisabling = user.enabled;
  const name = user.fullName;

  return (
    <ConfirmActionDialog
      title={isDisabling ? LABELS.DISABLE_USER_TITLE : LABELS.ENABLE_USER_TITLE}
      message={isDisabling ? LABELS.disableUserMessage(name) : LABELS.enableUserMessage(name)}
      confirmLabel={isDisabling ? LABELS.DISABLE : LABELS.ENABLE}
      confirmingLabel={isDisabling ? LABELS.DISABLING : LABELS.ENABLING}
      isDangerous={isDisabling}
      onConfirm={() => updateUser(user.id, { enabled: !isDisabling })}
      successMessage={isDisabling ? LABELS.userDisabled(name) : LABELS.userEnabled(name)}
      onCancel={onCancel}
      onDone={onDone}
    />
  );
}

ChangeStatusDialog.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default ChangeStatusDialog;
