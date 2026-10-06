import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router';
import { LABELS } from '@/constants/labels';
import { NAV_ITEMS } from '@/constants/navigation';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { hasRole } from '@/utils/hasRole';

// NavLink passes isActive; the active item also gets aria-current="page" automatically.
const getLinkClass = ({ isActive }) =>
  isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link';

/**
 * Left menu built from NAV_ITEMS, showing only the items the user's role may open.
 * @param {object} props
 * @param {string} props.id - element id, referenced by the Topbar menu button.
 * @param {boolean} props.isOpen - slides the menu in on small screens.
 * @param {Function} props.onNavigate - called after a link is clicked (closes it on mobile).
 */
function Sidebar({ id, isOpen, onNavigate }) {
  const { user } = useAuth();
  // Hiding menu items is UX, NOT security; the API must enforce every rule.
  const visibleItems = NAV_ITEMS.filter((item) => hasRole(user, item.roles));

  return (
    <aside id={id} className={isOpen ? 'sidebar sidebar--open' : 'sidebar'}>
      <Link to={ROUTES.DASHBOARD} className="sidebar__brand" onClick={onNavigate}>
        {LABELS.APP_NAME}
      </Link>
      <nav aria-label={LABELS.MAIN_NAV}>
        <ul className="sidebar__list">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={getLinkClass} onClick={onNavigate}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default Sidebar;
