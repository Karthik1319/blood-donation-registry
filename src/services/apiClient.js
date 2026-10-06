import axios from 'axios';
import { HTTP_STATUS } from '@/constants/api';
import { APP_CONFIG } from '@/constants/config';
import { MESSAGES } from '@/constants/messages';
import { getAccessToken } from '@/services/tokenStorage';

const DEFAULT_ERROR_MESSAGES = {
  [HTTP_STATUS.NETWORK_ERROR]: MESSAGES.NETWORK_ERROR,
  [HTTP_STATUS.BAD_REQUEST]: MESSAGES.BAD_REQUEST,
  [HTTP_STATUS.UNAUTHORIZED]: MESSAGES.SESSION_EXPIRED,
  [HTTP_STATUS.FORBIDDEN]: MESSAGES.FORBIDDEN,
  [HTTP_STATUS.NOT_FOUND]: MESSAGES.NOT_FOUND,
};

/** An error that carries the HTTP status and a message that is safe to show the user. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** The one Axios instance every service uses. */
export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
  // Lets the browser send/receive the HttpOnly refresh-token cookie.
  withCredentials: true,
});

let handleUnauthorized = null;

/**
 * AuthProvider registers here what to do when the server rejects the access token
 * (try a refresh, otherwise log out). It must return true if a new token was obtained.
 */
export function setUnauthorizedHandler(handler) {
  handleUnauthorized = handler;
}

function attachToken(config) {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

async function handleResponseError(error) {
  const { config, response } = error;
  // No response at all means offline, server down or timeout.
  const status = response?.status ?? HTTP_STATUS.NETWORK_ERROR;
  // Expired/invalid access token: refresh once, then repeat the original request.
  // Never for /auth/* calls (a wrong password is also 401) and never twice (no endless loop).
  const canRefresh =
    status === HTTP_STATUS.UNAUTHORIZED && !config?.isAuthRequest && !config?.isRetry;
  if (canRefresh && handleUnauthorized && (await handleUnauthorized())) {
    return apiClient({ ...config, isRetry: true });
  }
  // The server's error body is never shown, so stack traces or internals can't leak to the screen.
  const message =
    config?.errorMessages?.[status] ?? DEFAULT_ERROR_MESSAGES[status] ?? MESSAGES.GENERIC_ERROR;
  throw new ApiError(status, message);
}

// Request interceptor: attaches the token to every outgoing request.
apiClient.interceptors.request.use(attachToken);
// Response interceptor: handles 401 and turns every failure into an ApiError, in one place.
apiClient.interceptors.response.use((response) => response, handleResponseError);

/**
 * Sends a request through apiClient and returns only the response body (null when empty).
 * Throws ApiError on failure.
 * @param {string} path - endpoint from API_ENDPOINTS.
 * @param {object} [options]
 * @param {string} [options.method] - HTTP method.
 * @param {object} [options.body] - data sent as JSON.
 * @param {object} [options.params] - query string values, e.g. { page: 0 }.
 * @param {object} [options.errorMessages] - { status: message } overrides for this endpoint.
 * @param {boolean} [options.isAuthRequest] - true for /auth/* calls, which must not trigger a refresh.
 */
export async function apiRequest(
  path,
  { method = 'GET', body, params, errorMessages = {}, isAuthRequest = false } = {},
) {
  const response = await apiClient.request({
    url: path,
    method,
    data: body,
    params,
    errorMessages,
    isAuthRequest,
  });
  return response.data || null;
}
