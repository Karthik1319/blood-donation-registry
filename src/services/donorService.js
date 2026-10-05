import { APP_CONFIG } from '@/constants/config';
import * as donorApi from '@/services/donorApi';
import * as mockDonorApi from '@/services/mockDonorApi';

// Picks the real or the mock API once, so components never know (or care) which one is used.
const selectedApi = APP_CONFIG.USE_MOCK_API ? mockDonorApi : donorApi;

export const { getDonors, deleteDonor } = selectedApi;
