import { HTTP_STATUS } from '@/constants/api';
import { ROLES, ROUTE_ROLES } from '@/constants/roles';
import { findDonorByUrl } from '@/mocks/donorHandlers';
import { mockDb, nextId } from '@/mocks/mockDb';
import { withAuth } from '@/mocks/mockSession';
import { getTodayIsoDate } from '@/utils/dateUtils';
import { findTooCloseDonation } from '@/utils/donationEligibility';

const DONOR_DONATIONS_URL = /^\/donors\/(\d+)\/donations$/;
const DONATION_URL = /^\/donations\/(\d+)$/;

function getDonationsOf(donorId) {
  return mockDb.donations.filter((donation) => donation.donorId === donorId);
}

function findDonationByUrl(url) {
  const id = Number(url.match(DONATION_URL)[1]);
  return mockDb.donations.find((donation) => donation.id === id);
}

/** Server-side checks, like the real backend: basic fields → 400, the 90-day rule → 422. */
function checkDonation({ donationDate, quantity, location }, donorId, editingId) {
  if (!donationDate || donationDate > getTodayIsoDate() || !quantity || !location) {
    return HTTP_STATUS.BAD_REQUEST;
  }
  if (findTooCloseDonation(getDonationsOf(donorId), donationDate, editingId)) {
    return HTTP_STATUS.UNPROCESSABLE_ENTITY;
  }
  return null;
}

function listDonations(config) {
  const donor = findDonorByUrl(config.url);
  if (!donor) {
    return [HTTP_STATUS.NOT_FOUND];
  }
  // Newest first; "YYYY-MM-DD" text sorts in date order.
  const sorted = getDonationsOf(donor.id).sort((a, b) =>
    b.donationDate.localeCompare(a.donationDate),
  );
  return [HTTP_STATUS.OK, sorted];
}

function createDonation(config) {
  const donor = findDonorByUrl(config.url);
  if (!donor) {
    return [HTTP_STATUS.NOT_FOUND];
  }
  const { donationDate, quantity, location } = JSON.parse(config.data);
  const errorStatus = checkDonation({ donationDate, quantity, location }, donor.id);
  if (errorStatus) {
    return [errorStatus];
  }
  const donation = {
    id: nextId(mockDb.donations),
    donorId: donor.id,
    donationDate,
    quantity,
    location,
  };
  mockDb.donations = [...mockDb.donations, donation];
  return [HTTP_STATUS.CREATED, donation];
}

function updateDonation(config) {
  const donation = findDonationByUrl(config.url);
  if (!donation) {
    return [HTTP_STATUS.NOT_FOUND];
  }
  const { donationDate, quantity, location } = JSON.parse(config.data);
  const changes = { donationDate, quantity, location };
  const errorStatus = checkDonation(changes, donation.donorId, donation.id);
  if (errorStatus) {
    return [errorStatus];
  }
  const updated = { ...donation, ...changes };
  mockDb.donations = mockDb.donations.map((d) => (d.id === donation.id ? updated : d));
  return [HTTP_STATUS.OK, updated];
}

function deleteDonation(config) {
  const donation = findDonationByUrl(config.url);
  if (!donation) {
    return [HTTP_STATUS.NOT_FOUND];
  }
  mockDb.donations = mockDb.donations.filter((d) => d.id !== donation.id);
  return [HTTP_STATUS.NO_CONTENT];
}

/** Fake donation endpoints. Read/create/update: ADMIN and STAFF. Delete: ADMIN only. */
export function registerDonationHandlers(mock) {
  mock.onGet(DONOR_DONATIONS_URL).reply(withAuth(ROUTE_ROLES.DONORS, listDonations));
  mock.onPost(DONOR_DONATIONS_URL).reply(withAuth(ROUTE_ROLES.DONATION_FORM, createDonation));
  mock.onPut(DONATION_URL).reply(withAuth(ROUTE_ROLES.DONATION_FORM, updateDonation));
  mock.onDelete(DONATION_URL).reply(withAuth([ROLES.ADMIN], deleteDonation));
}
