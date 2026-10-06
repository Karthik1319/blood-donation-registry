import { API_ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { ROUTE_ROLES } from '@/constants/roles';
import { mockUsers } from '@/mocks/data/mockUsers';
import { toPublicUser, withAuth } from '@/mocks/mockSession';

/** Fake /users endpoint: ADMIN only. */
export function registerUserHandlers(mock) {
  mock
    .onGet(API_ENDPOINTS.USERS)
    .reply(withAuth(ROUTE_ROLES.USERS, () => [HTTP_STATUS.OK, mockUsers.map(toPublicUser)]));
}
