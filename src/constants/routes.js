export const ROUTES = {
  DASHBOARD: '/',
  DONORS: '/donors',
  DONOR_NEW: '/donors/new',
  DONOR_DETAILS: '/donors/:id',
  DONOR_EDIT: '/donors/:id/edit',
  DONATION_NEW: '/donors/:id/donations/new',
  DONATION_EDIT: '/donors/:id/donations/:donationId/edit',
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

/** Builds the URL for adding a donation to a donor, e.g. /donors/7/donations/new. */
export function getDonationNewPath(donorId) {
  return `/donors/${donorId}/donations/new`;
}

/** Builds the URL for editing a donation, e.g. /donors/7/donations/101/edit. */
export function getDonationEditPath(donorId, donationId) {
  return `/donors/${donorId}/donations/${donationId}/edit`;
}
