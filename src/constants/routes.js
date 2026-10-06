export const ROUTES = {
  DASHBOARD: '/',
  DONORS: '/donors',
  DONOR_DETAILS: '/donors/:id',
  USERS: '/users',
  LOGIN: '/login',
  REGISTER: '/register',
};

/** Builds the real URL of a donor's details page, e.g. /donors/7. */
export function getDonorDetailsPath(id) {
  return `/donors/${id}`;
}
