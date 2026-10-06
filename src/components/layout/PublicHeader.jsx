import { Link, NavLink } from 'react-router';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';

function PublicHeader() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to={ROUTES.LOGIN} className="header__brand">
          {LABELS.APP_NAME}
        </Link>
        <nav className="header__nav" aria-label={LABELS.MAIN_NAV}>
          <NavLink to={ROUTES.LOGIN} className="header__link">
            {LABELS.NAV_LOGIN}
          </NavLink>
          <NavLink to={ROUTES.REGISTER} className="header__link">
            {LABELS.NAV_REGISTER}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default PublicHeader;
