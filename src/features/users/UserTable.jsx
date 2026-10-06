import PropTypes from 'prop-types';
import { LABELS } from '@/constants/labels';
import { ROLE_LABELS } from '@/constants/roles';

/**
 * Table of user accounts with their role.
 * @param {object} props
 * @param {{id: number, fullName: string, email: string, role: string}[]} props.users - rows.
 */
function UserTable({ users }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">{LABELS.COLUMN_NAME}</th>
            <th scope="col">{LABELS.COLUMN_EMAIL}</th>
            <th scope="col">{LABELS.COLUMN_ROLE}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>
                <span className="badge">{ROLE_LABELS[user.role]}</span>
              </td>
            </tr>
          ))}
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
    }),
  ).isRequired,
};

export default UserTable;
