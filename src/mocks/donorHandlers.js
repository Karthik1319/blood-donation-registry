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

function getDonorPage({ page = 0, size, search = '', bloodGroup }) {
  const searchText = search.trim().toLowerCase();
  const filtered = donors.filter(
    (donor) =>
      (donor.name.toLowerCase().includes(searchText) || donor.phone.includes(searchText)) &&
      (!bloodGroup || donor.bloodGroup === bloodGroup),
  );
  const start = page * size;
  return {
    content: filtered.slice(start, start + size),
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
  };
}

/** Fake /donors endpoints. Reads: ADMIN and STAFF. Delete: ADMIN only. */
export function registerDonorHandlers(mock) {
  mock
    .onGet(API_ENDPOINTS.DONORS)
    .reply(withAuth(ROUTE_ROLES.DONORS, (config) => [HTTP_STATUS.OK, getDonorPage(config.params)]));

  mock.onGet(DONOR_URL).reply(
    withAuth(ROUTE_ROLES.DONORS, (config) => {
      const donor = findDonor(config.url, DONOR_URL);
      return donor ? [HTTP_STATUS.OK, donor] : [HTTP_STATUS.NOT_FOUND];
    }),
  );

  mock.onGet(DONATIONS_URL).reply(
    withAuth(ROUTE_ROLES.DONORS, (config) => {
      const donor = findDonor(config.url, DONATIONS_URL);
      return donor ? [HTTP_STATUS.OK, MOCK_DONATIONS[donor.id] ?? []] : [HTTP_STATUS.NOT_FOUND];
    }),
  );

  mock.onDelete(DONOR_URL).reply(
    withAuth([ROLES.ADMIN], (config) => {
      const donor = findDonor(config.url, DONOR_URL);
      if (!donor) {
        return [HTTP_STATUS.NOT_FOUND];
      }
      donors = donors.filter((d) => d.id !== donor.id);
      return [HTTP_STATUS.NO_CONTENT];
    }),
  );
}
