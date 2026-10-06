import { API_ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { ROLES } from '@/constants/roles';
import { mockUsers } from '@/mocks/data/mockUsers';
import { endSession, refreshCurrentSession, startSession } from '@/mocks/mockSession';

function findUserByEmail(email) {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/** Fake /auth endpoints: login, register, refresh, logout. */
export function registerAuthHandlers(mock) {
  mock.onPost(API_ENDPOINTS.LOGIN).reply((config) => {
    const { email, password } = JSON.parse(config.data);
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      return [HTTP_STATUS.UNAUTHORIZED];
    }
    return [HTTP_STATUS.OK, startSession(user)];
  });

  mock.onPost(API_ENDPOINTS.REGISTER).reply((config) => {
    const { fullName, email, phone, bloodGroup, password } = JSON.parse(config.data);
    if (findUserByEmail(email)) {
      return [HTTP_STATUS.CONFLICT];
    }
    // The server decides the role: self-registration is always DONOR.
    const id = mockUsers.length + 1;
    mockUsers.push({ id, fullName, email, phone, bloodGroup, password, role: ROLES.DONOR });
    return [HTTP_STATUS.CREATED];
  });

  mock.onPost(API_ENDPOINTS.REFRESH).reply(() => {
    const session = refreshCurrentSession();
    return session ? [HTTP_STATUS.OK, session] : [HTTP_STATUS.UNAUTHORIZED];
  });

  mock.onPost(API_ENDPOINTS.LOGOUT).reply(() => {
    endSession();
    return [HTTP_STATUS.NO_CONTENT];
  });
}
