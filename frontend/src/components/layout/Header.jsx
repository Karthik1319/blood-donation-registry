import { Link, NavLink } from 'react-router-dom';
import { APP_CONFIG } from '@/constants/config';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';

const NAV_ITEMS = [
  { to: ROUTES.LOGIN, label: LABELS.NAV_LOGIN },
  { to: ROUTES.REGISTER, label: LABELS.NAV_REGISTER },
];

// Top bar shown on every page: skip link, app name and main navigation.
function Header() {
  return (
    <header className="header">
      <a href="#main-content" className="skip-link">
        {LABELS.SKIP_TO_CONTENT}
      </a>
      <div className="header__inner">
        <Link to={ROUTES.HOME} className="header__brand">
          {APP_CONFIG.APP_NAME}
        </Link>
        <nav aria-label={LABELS.NAV_MAIN}>
          <ul className="header__nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className="header__link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
