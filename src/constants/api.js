// Paths are relative to APP_CONFIG.API_BASE_URL (e.g. /api + /auth/login).
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  DONORS: '/donors',
  DONOR_BY_ID: (id) => `/donors/${id}`,
  DONOR_DONATIONS: (id) => `/donors/${id}/donations`,
  DONATION_BY_ID: (id) => `/donations/${id}`,
  USERS: '/users',
};

export const HTTP_STATUS = {
  // Not a real HTTP code: used when the server could not be reached at all (offline, timeout).
  NETWORK_ERROR: 0,
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  // Valid request that breaks a business rule (e.g. donation within 90 days of another).
  UNPROCESSABLE_ENTITY: 422,
};
