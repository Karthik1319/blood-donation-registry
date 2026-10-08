import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import { LABELS } from '@/constants/labels';
import { ROLE_LABELS } from '@/constants/roles';

/**
 * Table of user accounts with role, status and admin actions. The logged-in admin's own row has
 * no actions (the server refuses self-changes too, so nobody can lock themselves out).
 * @param {object} props
 * @param {{id: number, fullName: string, email: string, role: string, enabled: boolean}[]} props.users
 * @param {number} props.currentUserId - id of the logged-in admin.
 * @param {Function} props.onChangeRole - called with the user whose role should change.
 * @param {Function} props.onChangeStatus - called with the user to disable or enable.
 */
function UserTable({ users, currentUserId, onChangeRole, onChangeStatus }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">{LABELS.COLUMN_NAME}</th>
            <th scope="col">{LABELS.COLUMN_EMAIL}</th>
            <th scope="col">{LABELS.COLUMN_ROLE}</th>
            <th scope="col">{LABELS.COLUMN_STATUS}</th>
            <th scope="col">{LABELS.COLUMN_ACTIONS}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <tr key={user.id}>
                <td data-label={LABELS.COLUMN_NAME}>{user.fullName}</td>
                <td data-label={LABELS.COLUMN_EMAIL}>{user.email}</td>
                <td data-label={LABELS.COLUMN_ROLE}>
                  <span className="badge">{ROLE_LABELS[user.role]}</span>
                </td>
                <td data-label={LABELS.COLUMN_STATUS}>
                  <span className={user.enabled ? 'badge' : 'badge badge--muted'}>
                    {user.enabled ? LABELS.STATUS_ACTIVE : LABELS.STATUS_DISABLED}
                  </span>
                </td>
                <td data-label={LABELS.COLUMN_ACTIONS}>
                  {isSelf ? (
                    <span className="badge badge--muted">{LABELS.YOU}</span>
                  ) : (
                    <div className="table__actions">
                      <Button
                        variant="secondary"
                        onClick={() => onChangeRole(user)}
                        ariaLabel={LABELS.changeRoleAriaLabel(user.fullName)}
                      >
                        {LABELS.CHANGE_ROLE}
                      </Button>
                      <Button
                        variant={user.enabled ? 'danger' : 'secondary'}
                        onClick={() => onChangeStatus(user)}
                        ariaLabel={
                          user.enabled
                            ? LABELS.disableUserAriaLabel(user.fullName)
                            : LABELS.enableUserAriaLabel(user.fullName)
                        }
                      >
                        {user.enabled ? LABELS.DISABLE : LABELS.ENABLE}
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      enabled: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  currentUserId: PropTypes.number.isRequired,
  onChangeRole: PropTypes.func.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
};

export default UserTable;
