import { API_ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { MESSAGES } from '@/constants/messages';
import { apiRequest } from '@/services/apiClient';
import { removeEmptyValues } from '@/utils/removeEmptyValues';

const SAVE_ERRORS = {
  [HTTP_STATUS.CONFLICT]: MESSAGES.DONOR_PHONE_TAKEN,
};

/**
 * GET /donors?page=&size=&search=&bloodGroup= → { content: Donor[], totalElements, totalPages }.
 * `page` starts at 0, like Spring Data.
 */
export function getDonors({ page, size, search, bloodGroup }) {
  return apiRequest(API_ENDPOINTS.DONORS, {
    params: removeEmptyValues({ page, size, search, bloodGroup }),
  });
}

/** GET /donors/:id → { id, name, bloodGroup, phone }. 404 if it does not exist. */
export function getDonorById(id) {
  return apiRequest(API_ENDPOINTS.DONOR_BY_ID(id));
}

/** GET /donors/:id/donations → [{ id, donationDate, quantity, location }], newest first. */
export function getDonorDonations(id) {
  return apiRequest(API_ENDPOINTS.DONOR_DONATIONS(id));
}

/** POST /donors with { name, bloodGroup, phone } → 201 with the new donor (incl. id). */
export function createDonor(donor) {
  return apiRequest(API_ENDPOINTS.DONORS, {
    method: 'POST',
    body: donor,
    errorMessages: SAVE_ERRORS,
  });
}

/** PUT /donors/:id with { name, bloodGroup, phone } → 200 with the updated donor. */
export function updateDonor(id, donor) {
  return apiRequest(API_ENDPOINTS.DONOR_BY_ID(id), {
    method: 'PUT',
    body: donor,
    errorMessages: SAVE_ERRORS,
  });
}

/** DELETE /donors/:id → 204. The server returns 403 unless the user is an ADMIN. */
export function deleteDonor(id) {
  return apiRequest(API_ENDPOINTS.DONOR_BY_ID(id), { method: 'DELETE' });
}
