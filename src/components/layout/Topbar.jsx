import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import Button from '@/components/ui/Button';
import { LABELS } from '@/constants/labels';
import { ROLE_LABELS } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

/**
 * Top bar of the dashboard: menu button (small screens), user name with role, Logout.
 * @param {object} props
 * @param {string} props.sidebarId - id of the sidebar the menu button opens.
 * @param {boolean} props.isSidebarOpen - whether the sidebar is open (for aria-expanded).
 * @param {Function} props.onMenuClick - opens the sidebar.
 */
function Topbar({ sidebarId, isSidebarOpen, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__menu-button"
        aria-label={LABELS.OPEN_MENU}
        aria-controls={sidebarId}
        aria-expanded={isSidebarOpen}
        onClick={onMenuClick}
      >
        <span aria-hidden="true">{LABELS.MENU_ICON}</span>
      </button>
      <div className="topbar__user">
        <span>{user.fullName}</span>
        <span className="badge">{ROLE_LABELS[user.role]}</span>
        <Button
          variant="secondary"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          loadingText={LABELS.NAV_LOGGING_OUT}
        >
          {LABELS.NAV_LOGOUT}
        </Button>
      </div>
    </header>
  );
}

Topbar.propTypes = {
  sidebarId: PropTypes.string.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

export default Topbar;
