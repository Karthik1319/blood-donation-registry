import { API_ENDPOINTS } from '@/constants/api';
import { apiRequest } from '@/services/apiClient';

/** GET /users → [{ id, fullName, email, role }]. The server returns 403 unless the user is ADMIN. */
export function getUsers() {
  return apiRequest(API_ENDPOINTS.USERS);
}
