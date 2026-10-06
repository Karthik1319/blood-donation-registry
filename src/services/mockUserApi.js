import { APP_CONFIG } from '@/constants/config';
import { mockUsers } from '@/services/mockUsers';
import { delay } from '@/utils/delay';

// Same function and response shape as userApi.js, backed by the in-memory users list.

export async function getUsers() {
  await delay(APP_CONFIG.MOCK_DELAY_MS);
  // Never return passwords, just like the real API.
  return mockUsers.map(({ id, fullName, email, role }) => ({ id, fullName, email, role }));
}
