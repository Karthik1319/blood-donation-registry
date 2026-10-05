import { Link, NavLink } from 'react-router';
import UserNav from '@/components/layout/UserNav';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header__inner">
        <Link to={ROUTES.DASHBOARD} className="header__brand">
          {LABELS.APP_NAME}
        </Link>
        {user ? (
          <UserNav />
        ) : (
          <nav className="header__nav" aria-label={LABELS.MAIN_NAV}>
            <NavLink to={ROUTES.LOGIN} className="header__link">
              {LABELS.NAV_LOGIN}
            </NavLink>
            <NavLink to={ROUTES.REGISTER} className="header__link">
              {LABELS.NAV_REGISTER}
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
