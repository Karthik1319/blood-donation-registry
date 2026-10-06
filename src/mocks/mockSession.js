import { HTTP_STATUS } from '@/constants/api';
import { mockUsers } from '@/mocks/data/mockUsers';
import { MOCK_CONFIG } from '@/mocks/mockConfig';

// Pretend server-side session state. The real backend uses signed JWTs and an HttpOnly refresh
// cookie; here the "cookie" is this variable, so a page reload logs you out in mock mode.
let refreshSession = null;

const TOKEN_PREFIX = 'mock-token';

/** The user fields the API may return (never the password). */
export function toPublicUser({ id, fullName, email, role }) {
  return { id, fullName, email, role };
}

function buildSessionResponse(user) {
  const expiresAt = Date.now() + MOCK_CONFIG.ACCESS_TOKEN_TTL_MS;
  return { accessToken: `${TOKEN_PREFIX}.${user.id}.${expiresAt}`, user: toPublicUser(user) };
}

function extendSession(userId) {
  refreshSession = { userId, expiresAt: Date.now() + MOCK_CONFIG.IDLE_TIMEOUT_MS };
}

/** Login: starts a session and returns { accessToken, user }. */
export function startSession(user) {
  extendSession(user.id);
  return buildSessionResponse(user);
}

/** Refresh: a new access token while the session is alive, otherwise null (→ 401). */
export function refreshCurrentSession() {
  const user = mockUsers.find((u) => u.id === refreshSession?.userId);
  if (!user || refreshSession.expiresAt < Date.now()) {
    refreshSession = null;
    return null;
  }
  extendSession(user.id);
  return buildSessionResponse(user);
}

export function endSession() {
  refreshSession = null;
}

/** "Bearer mock-token.<userId>.<expiresAt>" → the user, or null if missing, invalid or expired. */
function getUserFromToken(authorization = '') {
  const [prefix, userId, expiresAt] = authorization.replace('Bearer ', '').split('.');
  if (prefix !== TOKEN_PREFIX || Number(expiresAt) < Date.now()) {
    return null;
  }
  return mockUsers.find((u) => u.id === Number(userId)) ?? null;
}

/**
 * Wraps a request handler so it only runs for a valid token and an allowed role, like Spring
 * Security: no/expired token → 401, wrong role → 403.
 * @param {string[]} allowedRoles - roles that may call the endpoint.
 * @param {Function} handler - (config, user) => [status, body].
 */
export function withAuth(allowedRoles, handler) {
  return (config) => {
    const user = getUserFromToken(config.headers?.Authorization);
    if (!user) {
      return [HTTP_STATUS.UNAUTHORIZED];
    }
    if (!allowedRoles.includes(user.role)) {
      return [HTTP_STATUS.FORBIDDEN];
    }
    return handler(config, user);
  };
}
