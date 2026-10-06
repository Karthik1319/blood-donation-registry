import { HTTP_STATUS } from '@/constants/api';
import { APP_CONFIG } from '@/constants/config';
import { MESSAGES } from '@/constants/messages';
import { ApiError } from '@/services/apiClient';
import { MOCK_DONATIONS } from '@/services/mockDonations';
import { MOCK_DONORS } from '@/services/mockDonors';
import { delay } from '@/utils/delay';

// Same functions and response shapes as donorApi.js, backed by an in-memory list.

let donors = [...MOCK_DONORS];

function matchesFilters(donor, search, bloodGroup) {
  const searchText = (search ?? '').trim().toLowerCase();
  const isSearchMatch =
    donor.name.toLowerCase().includes(searchText) || donor.phone.includes(searchText);
  const isBloodGroupMatch = !bloodGroup || donor.bloodGroup === bloodGroup;
  return isSearchMatch && isBloodGroupMatch;
}

export async function getDonors({ page, size, search, bloodGroup }) {
  await delay(APP_CONFIG.MOCK_DELAY_MS);
  const filtered = donors.filter((donor) => matchesFilters(donor, search, bloodGroup));
  const start = page * size;
  return {
    content: filtered.slice(start, start + size),
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
  };
}

function findDonor(id) {
  const donor = donors.find((d) => d.id === Number(id));
  if (!donor) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
  }
  return donor;
}

export async function getDonorById(id) {
  await delay(APP_CONFIG.MOCK_DELAY_MS);
  return findDonor(id);
}

export async function getDonorDonations(id) {
  await delay(APP_CONFIG.MOCK_DELAY_MS);
  findDonor(id);
  return MOCK_DONATIONS[id] ?? [];
}

export async function deleteDonor(id) {
  await delay(APP_CONFIG.MOCK_DELAY_MS);
  findDonor(id);
  donors = donors.filter((donor) => donor.id !== Number(id));
  return null;
}
