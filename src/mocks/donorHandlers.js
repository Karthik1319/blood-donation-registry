import { API_ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { ROLES, ROUTE_ROLES } from '@/constants/roles';
import { mockDb, nextId } from '@/mocks/mockDb';
import { withAuth } from '@/mocks/mockSession';

const DONOR_URL = /^\/donors\/(\d+)$/;

/** Finds the donor whose id is the first number in the URL, e.g. /donors/7/donations → 7. */
export function findDonorByUrl(url) {
  const id = Number(url.match(/^\/donors\/(\d+)/)[1]);
  return mockDb.donors.find((donor) => donor.id === id);
}

function isPhoneTaken(phone, exceptId) {
  return mockDb.donors.some((donor) => donor.phone === phone && donor.id !== exceptId);
}

function listDonors(config) {
  const { page = 0, size, search = '', bloodGroup } = config.params;
  const searchText = search.trim().toLowerCase();
  const filtered = mockDb.donors.filter(
    (donor) =>
      (donor.name.toLowerCase().includes(searchText) || donor.phone.includes(searchText)) &&
      (!bloodGroup || donor.bloodGroup === bloodGroup),
  );
  // Sorted by name so a new donor appears in a predictable place.
  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  const content = sorted.slice(page * size, (page + 1) * size);
  const totalPages = Math.ceil(sorted.length / size);
  return [HTTP_STATUS.OK, { content, totalElements: sorted.length, totalPages }];
}

function getDonor(config) {
  const donor = findDonorByUrl(config.url);
  return donor ? [HTTP_STATUS.OK, donor] : [HTTP_STATUS.NOT_FOUND];
}

function createDonor(config) {
  const { name, bloodGroup, phone } = JSON.parse(config.data);
  if (isPhoneTaken(phone)) {
    return [HTTP_STATUS.CONFLICT];
  }
  const donor = { id: nextId(mockDb.donors), name, bloodGroup, phone };
  mockDb.donors = [...mockDb.donors, donor];
  return [HTTP_STATUS.CREATED, donor];
}

function updateDonor(config) {
  const donor = findDonorByUrl(config.url);
  if (!donor) {
    return [HTTP_STATUS.NOT_FOUND];
  }
  const { name, bloodGroup, phone } = JSON.parse(config.data);
  if (isPhoneTaken(phone, donor.id)) {
    return [HTTP_STATUS.CONFLICT];
  }
  const updated = { ...donor, name, bloodGroup, phone };
  mockDb.donors = mockDb.donors.map((d) => (d.id === donor.id ? updated : d));
  return [HTTP_STATUS.OK, updated];
}

function deleteDonor(config) {
  const donor = findDonorByUrl(config.url);
  if (!donor) {
    return [HTTP_STATUS.NOT_FOUND];
  }
  mockDb.donors = mockDb.donors.filter((d) => d.id !== donor.id);
  // Like ON DELETE CASCADE: a deleted donor's donation history goes too.
  mockDb.donations = mockDb.donations.filter((donation) => donation.donorId !== donor.id);
  return [HTTP_STATUS.NO_CONTENT];
}

/** Fake /donors endpoints. Read/create/update: ADMIN and STAFF. Delete: ADMIN only. */
export function registerDonorHandlers(mock) {
  mock.onGet(API_ENDPOINTS.DONORS).reply(withAuth(ROUTE_ROLES.DONORS, listDonors));
  mock.onGet(DONOR_URL).reply(withAuth(ROUTE_ROLES.DONORS, getDonor));
  mock.onPost(API_ENDPOINTS.DONORS).reply(withAuth(ROUTE_ROLES.DONOR_FORM, createDonor));
  mock.onPut(DONOR_URL).reply(withAuth(ROUTE_ROLES.DONOR_FORM, updateDonor));
  mock.onDelete(DONOR_URL).reply(withAuth([ROLES.ADMIN], deleteDonor));
}
