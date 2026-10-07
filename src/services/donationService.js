import { API_ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { MESSAGES } from '@/constants/messages';
import { apiRequest } from '@/services/apiClient';

// 422 = the server's 90-day rule said no (the form checks too, but the server has the final say).
const SAVE_ERRORS = {
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: MESSAGES.DONATION_NOT_ELIGIBLE,
};

/** GET /donors/:donorId/donations → [{ id, donorId, donationDate, quantity, location }], newest first. */
export function getDonorDonations(donorId) {
  return apiRequest(API_ENDPOINTS.DONOR_DONATIONS(donorId));
}

/** POST /donors/:donorId/donations with { donationDate, quantity, location } → 201 donation. */
export function createDonation(donorId, donation) {
  return apiRequest(API_ENDPOINTS.DONOR_DONATIONS(donorId), {
    method: 'POST',
    body: donation,
    errorMessages: SAVE_ERRORS,
  });
}

/** PUT /donations/:id with { donationDate, quantity, location } → 200 donation. */
export function updateDonation(id, donation) {
  return apiRequest(API_ENDPOINTS.DONATION_BY_ID(id), {
    method: 'PUT',
    body: donation,
    errorMessages: SAVE_ERRORS,
  });
}

/** DELETE /donations/:id → 204. The server returns 403 unless the user is an ADMIN. */
export function deleteDonation(id) {
  return apiRequest(API_ENDPOINTS.DONATION_BY_ID(id), { method: 'DELETE' });
}
