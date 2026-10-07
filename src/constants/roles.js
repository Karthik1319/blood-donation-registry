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

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'You can view, add, edit and delete donors and donations.',
  [ROLES.STAFF]: 'You can view, add and edit donors and donations.',
  [ROLES.DONOR]: 'Your profile and donation history will appear here soon.',
};

// Roles allowed to open each restricted page.
// Single source of truth: App.jsx (RoleRoute) and the sidebar menu both read this,
// so a page and its menu item can never disagree about who may see them.
export const ROUTE_ROLES = {
  DONORS: [ROLES.ADMIN, ROLES.STAFF],
  // Add/Edit donor pages; matches the DONOR_CREATE/DONOR_UPDATE permissions below.
  DONOR_FORM: [ROLES.ADMIN, ROLES.STAFF],
  // Add/Edit donation pages; matches DONATION_CREATE/DONATION_UPDATE.
  DONATION_FORM: [ROLES.ADMIN, ROLES.STAFF],
  USERS: [ROLES.ADMIN],
};

export const PERMISSIONS = {
  DONOR_CREATE: 'donor:create',
  DONOR_UPDATE: 'donor:update',
  DONOR_DELETE: 'donor:delete',
  DONATION_CREATE: 'donation:create',
  DONATION_UPDATE: 'donation:update',
  DONATION_DELETE: 'donation:delete',
};

// The create/update/delete permissions of each record type, for useCrudPermissions.
export const CRUD_PERMISSIONS = {
  DONOR: {
    create: PERMISSIONS.DONOR_CREATE,
    update: PERMISSIONS.DONOR_UPDATE,
    remove: PERMISSIONS.DONOR_DELETE,
  },
  DONATION: {
    create: PERMISSIONS.DONATION_CREATE,
    update: PERMISSIONS.DONATION_UPDATE,
    remove: PERMISSIONS.DONATION_DELETE,
  },
};

// Used only to show/hide UI. The backend has its own copy of these rules and is the real gate.
// Viewing pages is controlled by ROUTE_ROLES above; these are the actions inside the pages.
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.STAFF]: [
    PERMISSIONS.DONOR_CREATE,
    PERMISSIONS.DONOR_UPDATE,
    PERMISSIONS.DONATION_CREATE,
    PERMISSIONS.DONATION_UPDATE,
  ],
  [ROLES.DONOR]: [],
};
