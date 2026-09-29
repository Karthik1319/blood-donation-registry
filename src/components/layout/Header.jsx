import { Link, NavLink } from 'react-router';
import Button from '@/components/ui/Button';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__inner">
        <Link to={ROUTES.HOME} className="header__brand">
          {LABELS.APP_NAME}
        </Link>
        <nav className="header__nav" aria-label="Main">
          {/* Hiding links is UX, NOT security; the API must enforce every rule. */}
          {user ? (
            <>
              <span>{user.fullName}</span>
              <Button variant="secondary" onClick={logout}>
                {LABELS.NAV_LOGOUT}
              </Button>
            </>
          ) : (
            <>
              <NavLink to={ROUTES.LOGIN} className="header__link">
                {LABELS.NAV_LOGIN}
              </NavLink>
              <NavLink to={ROUTES.REGISTER} className="header__link">
                {LABELS.NAV_REGISTER}
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
