import { API_ENDPOINTS, HTTP_STATUS } from '@/constants/config';
import { API_MESSAGES } from '@/constants/messages';
import { request } from '@/services/apiClient';
import { ApiError } from '@/services/ApiError';
import { setToken } from '@/services/tokenStorage';

// Replaces the generic message for one status code with a more specific one.
function withMessageFor(status, message) {
  return (error) => {
    if (error instanceof ApiError && error.status === status) {
      throw new ApiError(status, message);
    }
    throw error;
  };
}

export async function login({ username, password }) {
  const data = await request(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: { username, password },
  }).catch(withMessageFor(HTTP_STATUS.UNAUTHORIZED, API_MESSAGES.INVALID_CREDENTIALS));
  setToken(data.token);
  return data;
}

// confirmPassword is a UI-only check, so it is deliberately not sent to the API.
export function register({ fullName, username, email, phone, password }) {
  return request(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: { fullName, username, email, phone, password },
  }).catch(withMessageFor(HTTP_STATUS.CONFLICT, API_MESSAGES.ACCOUNT_EXISTS));
}
