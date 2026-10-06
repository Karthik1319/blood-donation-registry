import { HTTP_STATUS } from '@/constants/api';
import { APP_CONFIG } from '@/constants/config';
import { MESSAGES } from '@/constants/messages';
import { ROLES } from '@/constants/roles';
import { ApiError } from '@/services/apiClient';
import { mockUsers } from '@/services/mockUsers';
import { delay } from '@/utils/delay';

// Same functions and response shapes as authApi.js, but backed by an in-memory list.
// Only used when VITE_USE_MOCK_API=true, so the UI can be developed without the backend.

function isSameEmail(first, second) {
  return first.toLowerCase() === second.toLowerCase();
}

export async function loginUser({ email, password }) {
  await delay(APP_CONFIG.MOCK_DELAY_MS);
  const user = mockUsers.find((u) => isSameEmail(u.email, email) && u.password === password);
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.LOGIN_FAILED);
  }
  return {
    accessToken: `mock-token-${Date.now()}`,
    user: { fullName: user.fullName, email: user.email, role: user.role },
  };
}

export async function registerUser({ fullName, email, phone, bloodGroup, password }) {
  await delay(APP_CONFIG.MOCK_DELAY_MS);
  if (mockUsers.some((u) => isSameEmail(u.email, email))) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.EMAIL_TAKEN);
  }
  const id = mockUsers.length + 1;
  mockUsers.push({ id, fullName, email, phone, bloodGroup, password, role: ROLES.DONOR });
  return null;
}

// There is no real HttpOnly cookie in mock mode, so a page reload always logs the user out.
export async function refreshSession() {
  throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.SESSION_EXPIRED);
}

export async function logoutUser() {
  return null;
}
