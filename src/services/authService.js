import { API_ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { MESSAGES } from '@/constants/messages';
import { apiRequest } from '@/services/apiClient';

// One generic message for every login failure, so nobody can find out which emails exist.
const LOGIN_ERRORS = {
  [HTTP_STATUS.BAD_REQUEST]: MESSAGES.LOGIN_FAILED,
  [HTTP_STATUS.UNAUTHORIZED]: MESSAGES.LOGIN_FAILED,
  // Only sent after a correct password, so it doesn't reveal which accounts exist.
  [HTTP_STATUS.FORBIDDEN]: MESSAGES.ACCOUNT_DISABLED,
};

const REGISTER_ERRORS = {
  [HTTP_STATUS.CONFLICT]: MESSAGES.EMAIL_TAKEN,
};

let pendingRefresh = null;

/** POST /auth/login → { accessToken, user }. The server also sets the HttpOnly refresh cookie. */
export function loginUser(credentials) {
  return apiRequest(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: credentials,
    errorMessages: LOGIN_ERRORS,
    isAuthRequest: true,
  });
}

/** POST /auth/register. No role is sent: the server always gives new accounts the DONOR role. */
export function registerUser({ fullName, email, phone, bloodGroup, password }) {
  return apiRequest(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: { fullName, email, phone, bloodGroup, password },
    errorMessages: REGISTER_ERRORS,
    isAuthRequest: true,
  });
}

/** POST /auth/refresh → { accessToken, user }, using the refresh cookie the browser sends. */
export function refreshSession() {
  // Callers share one request: refresh tokens are single-use (rotated by the server),
  // so two parallel calls (e.g. React StrictMode in dev) would make the second one fail.
  if (!pendingRefresh) {
    pendingRefresh = apiRequest(API_ENDPOINTS.REFRESH, {
      method: 'POST',
      isAuthRequest: true,
    }).finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
}

/** POST /auth/logout: the server revokes the refresh token and clears its cookie. */
export function logoutUser() {
  // Never fail: the user must be logged out locally even if the server is unreachable.
  return apiRequest(API_ENDPOINTS.LOGOUT, { method: 'POST', isAuthRequest: true }).catch(
    () => null,
  );
}
