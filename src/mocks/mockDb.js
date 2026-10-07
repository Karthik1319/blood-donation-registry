import { MOCK_DONATIONS } from '@/mocks/data/mockDonations';
import { MOCK_DONORS } from '@/mocks/data/mockDonors';

// The fake backend's "database": one place that donor and donation handlers both read and change,
// like two tables in the real database. Lost on page reload.
export const mockDb = {
  donors: [...MOCK_DONORS],
  donations: [...MOCK_DONATIONS],
};

/** Next free id for a table, like an auto-increment column. */
export function nextId(rows) {
  return Math.max(0, ...rows.map((row) => row.id)) + 1;
}
