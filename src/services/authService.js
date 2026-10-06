import * as authApi from '@/services/authApi';
import * as mockAuthApi from '@/services/mockAuthApi';
import { selectApi } from '@/utils/selectApi';

// Components import from here, so they never know (or care) whether the mock is used.
export const { loginUser, registerUser, refreshSession, logoutUser } = selectApi(
  authApi,
  mockAuthApi,
);
