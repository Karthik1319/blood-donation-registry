export const ROUTES = {
  DASHBOARD: '/',
  DONORS: '/donors',
  DONOR_NEW: '/donors/new',
  DONOR_DETAILS: '/donors/:id',
  DONOR_EDIT: '/donors/:id/edit',
  USERS: '/users',
  LOGIN: '/login',
  REGISTER: '/register',
};

/** Builds the real URL of a donor's details page, e.g. /donors/7. */
export function getDonorDetailsPath(id) {
  return `/donors/${id}`;
}

/** Builds the real URL of a donor's edit page, e.g. /donors/7/edit. */
export function getDonorEditPath(id) {
  return `/donors/${id}/edit`;
}
