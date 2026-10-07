import { API_ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { ROLES, ROUTE_ROLES } from '@/constants/roles';
import { MOCK_DONATIONS } from '@/mocks/data/mockDonations';
import { MOCK_DONORS } from '@/mocks/data/mockDonors';
import { withAuth } from '@/mocks/mockSession';

let donors = [...MOCK_DONORS];

const DONOR_URL = /^\/donors\/(\d+)$/;
const DONATIONS_URL = /^\/donors\/(\d+)\/donations$/;

function findDonor(url, pattern) {
  const id = Number(url.match(pattern)[1]);
  return donors.find((donor) => donor.id === id);
}

function isPhoneTaken(phone, exceptId) {
  return donors.some((donor) => donor.phone === phone && donor.id !== exceptId);
}

function listDonors(config) {
  const { page = 0, size, search = '', bloodGroup } = config.params;
  const searchText = search.trim().toLowerCase();
  const filtered = donors.filter(
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
  const donor = findDonor(config.url, DONOR_URL);
  return donor ? [HTTP_STATUS.OK, donor] : [HTTP_STATUS.NOT_FOUND];
}

function listDonations(config) {
  const donor = findDonor(config.url, DONATIONS_URL);
  return donor ? [HTTP_STATUS.OK, MOCK_DONATIONS[donor.id] ?? []] : [HTTP_STATUS.NOT_FOUND];
}

function createDonor(config) {
  const { name, bloodGroup, phone } = JSON.parse(config.data);
  if (isPhoneTaken(phone)) {
    return [HTTP_STATUS.CONFLICT];
  }
  const donor = { id: Math.max(0, ...donors.map((d) => d.id)) + 1, name, bloodGroup, phone };
  donors = [...donors, donor];
  return [HTTP_STATUS.CREATED, donor];
}

function updateDonor(config) {
  const donor = findDonor(config.url, DONOR_URL);
  if (!donor) {
    return [HTTP_STATUS.NOT_FOUND];
  }
  const { name, bloodGroup, phone } = JSON.parse(config.data);
  if (isPhoneTaken(phone, donor.id)) {
    return [HTTP_STATUS.CONFLICT];
  }
  const updated = { ...donor, name, bloodGroup, phone };
  donors = donors.map((d) => (d.id === donor.id ? updated : d));
  return [HTTP_STATUS.OK, updated];
}

function deleteDonor(config) {
  const donor = findDonor(config.url, DONOR_URL);
  if (!donor) {
    return [HTTP_STATUS.NOT_FOUND];
  }
  donors = donors.filter((d) => d.id !== donor.id);
  return [HTTP_STATUS.NO_CONTENT];
}

/** Fake /donors endpoints. Read/create/update: ADMIN and STAFF. Delete: ADMIN only. */
export function registerDonorHandlers(mock) {
  mock.onGet(API_ENDPOINTS.DONORS).reply(withAuth(ROUTE_ROLES.DONORS, listDonors));
  mock.onGet(DONOR_URL).reply(withAuth(ROUTE_ROLES.DONORS, getDonor));
  mock.onGet(DONATIONS_URL).reply(withAuth(ROUTE_ROLES.DONORS, listDonations));
  mock.onPost(API_ENDPOINTS.DONORS).reply(withAuth(ROUTE_ROLES.DONOR_FORM, createDonor));
  mock.onPut(DONOR_URL).reply(withAuth(ROUTE_ROLES.DONOR_FORM, updateDonor));
  mock.onDelete(DONOR_URL).reply(withAuth([ROLES.ADMIN], deleteDonor));
}
