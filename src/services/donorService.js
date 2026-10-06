import * as donorApi from '@/services/donorApi';
import * as mockDonorApi from '@/services/mockDonorApi';
import { selectApi } from '@/utils/selectApi';

// Components import from here, so they never know (or care) whether the mock is used.
export const { getDonors, getDonorById, getDonorDonations, deleteDonor } = selectApi(
  donorApi,
  mockDonorApi,
);
