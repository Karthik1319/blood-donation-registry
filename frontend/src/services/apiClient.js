import { APP_CONFIG, HTTP_STATUS, NETWORK_ERROR_STATUS } from '@/constants/config';
import { API_MESSAGES } from '@/constants/messages';
import { ApiError } from '@/services/ApiError';
import { getToken } from '@/services/tokenStorage';

const STATUS_MESSAGES = {
  [HTTP_STATUS.BAD_REQUEST]: API_MESSAGES.BAD_REQUEST,
  [HTTP_STATUS.FORBIDDEN]: API_MESSAGES.FORBIDDEN,
  [HTTP_STATUS.NOT_FOUND]: API_MESSAGES.NOT_FOUND,
  // 502–504 come from a proxy/gateway when the API itself is down or too slow.
  [HTTP_STATUS.BAD_GATEWAY]: API_MESSAGES.UNAVAILABLE,
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: API_MESSAGES.UNAVAILABLE,
  [HTTP_STATUS.GATEWAY_TIMEOUT]: API_MESSAGES.UNAVAILABLE,
};

function buildHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}

async function parseBody(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Sends a JSON request and returns the parsed body, or throws an ApiError with a safe message.
// We never show the server's raw error text: it could leak internals such as stack traces.
export async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${APP_CONFIG.API_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(APP_CONFIG.REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError(NETWORK_ERROR_STATUS, API_MESSAGES.NETWORK);
  }
  if (!response.ok) {
    throw new ApiError(response.status, STATUS_MESSAGES[response.status] ?? API_MESSAGES.SERVER);
  }
  return parseBody(response);
}
