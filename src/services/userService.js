import * as mockUserApi from '@/services/mockUserApi';
import * as userApi from '@/services/userApi';
import { selectApi } from '@/utils/selectApi';

// Components import from here, so they never know (or care) whether the mock is used.
export const { getUsers } = selectApi(userApi, mockUserApi);
