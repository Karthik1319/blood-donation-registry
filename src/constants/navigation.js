import { LABELS } from '@/constants/labels';
import { ROUTE_ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

// Sidebar menu. To add a page to the menu, add one line here.
// `roles` = who sees the item (same list RoleRoute uses); no `roles` = every logged-in user.
// `end` = only highlight on the exact path (otherwise "/" would match every page).
export const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: LABELS.NAV_DASHBOARD, end: true },
  { to: ROUTES.DONORS, label: LABELS.NAV_DONORS, roles: ROUTE_ROLES.DONORS },
  { to: ROUTES.USERS, label: LABELS.NAV_USERS, roles: ROUTE_ROLES.USERS },
];

// Breadcrumb steps for pages. The current page itself is added by PageHeader.
export const BREADCRUMBS = {
  DASHBOARD: { to: ROUTES.DASHBOARD, label: LABELS.NAV_DASHBOARD },
  DONORS: { to: ROUTES.DONORS, label: LABELS.NAV_DONORS },
};
