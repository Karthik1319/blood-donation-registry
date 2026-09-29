// Values come from .env at build time. VITE_ variables are public, so never put secrets in them.
export const APP_CONFIG = Object.freeze({
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Blood Donation Registry',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  REQUEST_TIMEOUT_MS: 15000,
});

export const API_ENDPOINTS = Object.freeze({
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
});

export const HTTP_STATUS = Object.freeze({
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
});

// Status 0 is our own marker for "no HTTP response at all" (server down, offline, timeout).
export const NETWORK_ERROR_STATUS = 0;
