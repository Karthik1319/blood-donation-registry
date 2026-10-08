import { API_ENDPOINTS } from '@/constants/api';
import { apiRequest } from '@/services/apiClient';

/** GET /users → [{ id, fullName, email, role, enabled }]. The server returns 403 unless the user is ADMIN. */
export function getUsers() {
  return apiRequest(API_ENDPOINTS.USERS);
}

/**
 * PATCH /users/:id with { role } and/or { enabled } → the updated user. ADMIN only; the server
 * refuses changes to the admin's own account (400) and ends the changed user's sessions.
 */
export function updateUser(id, changes) {
  return apiRequest(API_ENDPOINTS.USER_BY_ID(id), { method: 'PATCH', body: changes });
}
