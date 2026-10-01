// Must match the role names the Spring Boot API puts in the login response.
export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  DONOR: 'DONOR',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.STAFF]: 'Staff',
  [ROLES.DONOR]: 'Donor',
};

export const PERMISSIONS = {
  DONOR_VIEW_ALL: 'donor:view-all',
  DONOR_CREATE: 'donor:create',
  DONOR_UPDATE: 'donor:update',
  DONOR_DELETE: 'donor:delete',
  DONATION_VIEW_ALL: 'donation:view-all',
  DONATION_CREATE: 'donation:create',
  DONATION_UPDATE: 'donation:update',
  DONATION_DELETE: 'donation:delete',
  PROFILE_VIEW_OWN: 'profile:view-own',
  DONATION_VIEW_OWN: 'donation:view-own',
};

// Used only to show/hide UI. The backend has its own copy of these rules and is the real gate.
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.STAFF]: [
    PERMISSIONS.DONOR_VIEW_ALL,
    PERMISSIONS.DONOR_CREATE,
    PERMISSIONS.DONOR_UPDATE,
    PERMISSIONS.DONATION_VIEW_ALL,
    PERMISSIONS.DONATION_CREATE,
    PERMISSIONS.DONATION_UPDATE,
  ],
  [ROLES.DONOR]: [PERMISSIONS.PROFILE_VIEW_OWN, PERMISSIONS.DONATION_VIEW_OWN],
};
