import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import Button from '@/components/ui/Button';
import { LABELS } from '@/constants/labels';
import { NAV_ITEMS } from '@/constants/navigation';
import { ROLE_LABELS } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/utils/hasPermission';

/** Menu for a logged-in user: the links their role allows, their name/role and Logout. */
function UserNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Hiding menu items is UX, NOT security; the API must enforce every rule.
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(user, item.permission),
  );

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
    <nav className="header__nav" aria-label={LABELS.MAIN_NAV}>
      {visibleItems.map((item) => (
        <NavLink key={item.to} to={item.to} className="header__link" end>
          {item.label}
        </NavLink>
      ))}
      <span className="header__user">
        {user.fullName} <span className="badge">{ROLE_LABELS[user.role]}</span>
      </span>
      <Button
        variant="secondary"
        onClick={handleLogout}
        isLoading={isLoggingOut}
        loadingText={LABELS.NAV_LOGGING_OUT}
      >
        {LABELS.NAV_LOGOUT}
      </Button>
    </nav>
  );
}

export default UserNav;
