import { LABELS } from '@/constants/labels';
import { PERMISSIONS } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

// Menu shown to logged-in users. An item with a `permission` is only shown to roles that have it.
export const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: LABELS.NAV_DASHBOARD },
  { to: ROUTES.DONORS, label: LABELS.NAV_DONORS, permission: PERMISSIONS.DONOR_VIEW_ALL },
];
