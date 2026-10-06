// Fake donation records for mock mode only, keyed by donor id. Donors not listed have none.
export const MOCK_DONATIONS = {
  1: [
    { id: 101, donationDate: '2026-08-12', quantity: 450, location: 'City Blood Bank, Hyderabad' },
    {
      id: 102,
      donationDate: '2026-04-30',
      quantity: 450,
      location: 'Red Cross Camp, Secunderabad',
    },
    { id: 103, donationDate: '2025-12-02', quantity: 350, location: 'City Blood Bank, Hyderabad' },
  ],
  2: [{ id: 201, donationDate: '2026-09-01', quantity: 450, location: 'Apollo Hospital, Chennai' }],
  3: [
    { id: 301, donationDate: '2026-07-19', quantity: 450, location: 'NIMS Blood Centre' },
    { id: 302, donationDate: '2026-03-05', quantity: 450, location: 'NIMS Blood Centre' },
  ],
  8: [{ id: 801, donationDate: '2026-06-22', quantity: 350, location: 'Lions Club Camp, Pune' }],
};
