import { APP_CONFIG } from '@/constants/config';
import { MESSAGES } from '@/constants/messages';
import { MOCK_USERS } from '@/services/mockUsers';
import { delay } from '@/utils/delay';

// Mock implementation. When the backend is ready, only the bodies of these functions change
// (to fetch POST /auth/login and /auth/register); components keep calling them the same way.
// Services only throw user-safe messages, never raw server errors or stack traces.

const registeredUsers = [...MOCK_USERS];

function isSameEmail(first, second) {
  return first.toLowerCase() === second.toLowerCase();
}

export async function loginUser({ email, password }) {
  await delay(APP_CONFIG.MOCK_DELAY_MS);
  const user = registeredUsers.find((u) => isSameEmail(u.email, email) && u.password === password);
  if (!user) {
    // Same message for "unknown email" and "wrong password" so attackers can't discover emails.
    throw new Error(MESSAGES.LOGIN_FAILED);
  }
  return {
    token: `mock-token-${Date.now()}`,
    user: { fullName: user.fullName, email: user.email },
  };
}

export async function registerUser(newUser) {
  await delay(APP_CONFIG.MOCK_DELAY_MS);
  if (registeredUsers.some((u) => isSameEmail(u.email, newUser.email))) {
    throw new Error(MESSAGES.EMAIL_TAKEN);
  }
  const { fullName, email, phone, bloodGroup, password } = newUser;
  registeredUsers.push({ fullName, email, phone, bloodGroup, password });
}
