import { useState } from 'react';
import PropTypes from 'prop-types';
import Select from '@/components/ui/Select';
import { LABELS } from '@/constants/labels';
import { ROLE_LABELS, ROLES } from '@/constants/roles';
import ConfirmActionDialog from '@/features/shared/ConfirmActionDialog';
import { updateUser } from '@/services/userService';

/**
 * Dialog to give a user another role: a labelled dropdown of the other roles, then confirm.
 * @param {object} props
 * @param {{id: number, fullName: string, role: string}} props.user - the account to change.
 * @param {Function} props.onCancel - closes the dialog.
 * @param {Function} props.onDone - called after the role was changed.
 */
function ChangeRoleDialog({ user, onCancel, onDone }) {
  const otherRoles = Object.values(ROLES).filter((role) => role !== user.role);
  const [newRole, setNewRole] = useState(otherRoles[0]);
  const roleLabel = ROLE_LABELS[newRole];

  return (
    <ConfirmActionDialog
      title={LABELS.CHANGE_ROLE_TITLE}
      message={LABELS.changeRoleMessage(user.fullName, roleLabel)}
      confirmLabel={LABELS.CHANGE_ROLE}
      confirmingLabel={LABELS.CHANGING_ROLE}
      isDangerous={false}
      onConfirm={() => updateUser(user.id, { role: newRole })}
      successMessage={LABELS.roleChanged(user.fullName, roleLabel)}
      onCancel={onCancel}
      onDone={onDone}
    >
      <Select
        id="newRole"
        label={LABELS.NEW_ROLE}
        options={otherRoles.map((role) => ({ value: role, label: ROLE_LABELS[role] }))}
        value={newRole}
        onChange={(event) => setNewRole(event.target.value)}
      />
    </ConfirmActionDialog>
  );
}

ChangeRoleDialog.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default ChangeRoleDialog;
