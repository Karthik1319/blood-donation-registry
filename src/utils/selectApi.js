import { APP_CONFIG } from '@/constants/config';

/** Returns the mock API when VITE_USE_MOCK_API=true, otherwise the real one. */
export function selectApi(realApi, mockApi) {
  return APP_CONFIG.USE_MOCK_API ? mockApi : realApi;
}
