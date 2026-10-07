import { addDays, getTodayIsoDate } from '@/utils/dateUtils';

// Fake donation records for mock mode only. Dates are relative to today so the demo always shows
// a mix: donor 1, 2 and 3 are NOT eligible yet (< 90 days), donor 8 is eligible again.
const daysAgo = (days) => addDays(getTodayIsoDate(), -days);

export const MOCK_DONATIONS = [
  {
    id: 101,
    donorId: 1,
    donationDate: daysAgo(56),
    quantity: 450,
    location: 'City Blood Bank, Hyderabad',
  },
  {
    id: 102,
    donorId: 1,
    donationDate: daysAgo(160),
    quantity: 450,
    location: 'Red Cross Camp, Secunderabad',
  },
  {
    id: 103,
    donorId: 1,
    donationDate: daysAgo(309),
    quantity: 350,
    location: 'City Blood Bank, Hyderabad',
  },
  {
    id: 201,
    donorId: 2,
    donationDate: daysAgo(36),
    quantity: 450,
    location: 'Apollo Hospital, Chennai',
  },
  { id: 301, donorId: 3, donationDate: daysAgo(80), quantity: 450, location: 'NIMS Blood Centre' },
  { id: 302, donorId: 3, donationDate: daysAgo(216), quantity: 450, location: 'NIMS Blood Centre' },
  {
    id: 801,
    donorId: 8,
    donationDate: daysAgo(107),
    quantity: 350,
    location: 'Lions Club Camp, Pune',
  },
];
