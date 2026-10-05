import PropTypes from 'prop-types';
import { Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import AccessDeniedPage from '@/pages/AccessDeniedPage';

/**
 * Parent route that only lets the given roles through; others see the 403 page.
 * Must be placed inside ProtectedRoute, so a user is always logged in here.
 * This is UX, NOT security: the API must check the role on every request.
 * @param {object} props
 * @param {string[]} props.allowedRoles - roles from ROLES that may open the child pages.
 */
function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();
  return allowedRoles.includes(user.role) ? <Outlet /> : <AccessDeniedPage />;
}

RoleRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleRoute;
