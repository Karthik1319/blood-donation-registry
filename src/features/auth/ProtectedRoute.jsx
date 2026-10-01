import PropTypes from 'prop-types';
import { Navigate } from 'react-router';
import Card from '@/components/ui/Card';
import LoadingMessage from '@/components/ui/LoadingMessage';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

/**
 * Shows the page only to logged-in users (and, if given, only to the allowed roles).
 * This is UX, NOT security: the API must reject requests without a valid token or role.
 * @param {object} props
 * @param {React.ReactNode} props.children - the protected page.
 * @param {string[]} [props.allowedRoles] - roles from ROLES; empty means any logged-in user.
 */
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return <LoadingMessage message={LABELS.LOADING} />;
  }
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  const isRoleAllowed = allowedRoles.length === 0 || allowedRoles.includes(user.role);
  if (!isRoleAllowed) {
    return (
      <Card title={LABELS.ACCESS_DENIED_TITLE}>
        <p>{MESSAGES.FORBIDDEN}</p>
      </Card>
    );
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
