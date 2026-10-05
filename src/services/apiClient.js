import { HTTP_STATUS } from '@/constants/api';
import { APP_CONFIG } from '@/constants/config';
import { MESSAGES } from '@/constants/messages';
import { getAccessToken } from '@/services/tokenStorage';

const DEFAULT_ERROR_MESSAGES = {
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

function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function toApiError(status, errorMessages) {
  const message = errorMessages[status] ?? DEFAULT_ERROR_MESSAGES[status] ?? MESSAGES.GENERIC_ERROR;
  return new ApiError(status, message);
}

let handleUnauthorized = null;

/**
 * AuthProvider registers here what to do when the server rejects the access token
 * (try a refresh, otherwise log out). It must return true if a new token was obtained.
 */
export function setUnauthorizedHandler(handler) {
  handleUnauthorized = handler;
}

async function readJson(response) {
  // Some endpoints (e.g. 201 Created, 204 No Content) return an empty body.
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    throw new ApiError(response.status, MESSAGES.GENERIC_ERROR);
  }
}

async function sendRequest(path, method, body) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`${APP_CONFIG.API_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      // Lets the browser send/receive the HttpOnly refresh-token cookie.
      credentials: 'include',
      signal: controller.signal,
    });
  } catch {
    // fetch only rejects when the server can't be reached or the request timed out.
    throw new ApiError(HTTP_STATUS.NETWORK_ERROR, MESSAGES.NETWORK_ERROR);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Sends a JSON request to the backend and returns the parsed response body.
 * Throws ApiError on failure. The server's error body is never shown to the user,
 * so stack traces or internal details cannot leak onto the screen.
 * @param {string} path - endpoint from API_ENDPOINTS.
 * @param {object} [options]
 * @param {string} [options.method] - HTTP method.
 * @param {object} [options.body] - data sent as JSON.
 * @param {object} [options.errorMessages] - { status: message } overrides for this endpoint.
 * @param {boolean} [options.isAuthRequest] - true for /auth/* calls, which must not trigger a refresh.
 */
export async function apiRequest(
  path,
  { method = 'GET', body, errorMessages = {}, isAuthRequest = false } = {},
) {
  let response = await sendRequest(path, method, body);
  // Interceptor: an expired access token gets one silent refresh, then the request is retried.
  const isTokenRejected = response.status === HTTP_STATUS.UNAUTHORIZED && !isAuthRequest;
  if (isTokenRejected && handleUnauthorized && (await handleUnauthorized())) {
    response = await sendRequest(path, method, body);
  }
  if (!response.ok) {
    throw toApiError(response.status, errorMessages);
  }
  return readJson(response);
}
