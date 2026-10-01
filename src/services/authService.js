import { APP_CONFIG } from '@/constants/config';
import * as authApi from '@/services/authApi';
import * as mockAuthApi from '@/services/mockAuthApi';

// Picks the real or the mock API once, so components never know (or care) which one is used.
const selectedApi = APP_CONFIG.USE_MOCK_API ? mockAuthApi : authApi;

export const { loginUser, registerUser, refreshSession, logoutUser } = selectedApi;
