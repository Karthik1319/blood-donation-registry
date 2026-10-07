import { describe, expect, it } from 'vitest';
import {
  findTooCloseDonation,
  getEligibility,
  getLastDonationDate,
} from '@/utils/donationEligibility';

const DONATIONS = [
  { id: 1, donationDate: '2026-01-10' },
  { id: 2, donationDate: '2026-06-01' },
];

describe('findTooCloseDonation (90-day rule)', () => {
  it('allows a date exactly 90 days after the last donation', () => {
    expect(findTooCloseDonation(DONATIONS, '2026-08-30')).toBeNull();
  });

  it('blocks a date 89 days after the last donation', () => {
    expect(findTooCloseDonation(DONATIONS, '2026-08-29')).toEqual(DONATIONS[1]);
  });

  it('blocks a back-filled date that is too close to a LATER donation', () => {
    expect(findTooCloseDonation(DONATIONS, '2026-05-01')).toEqual(DONATIONS[1]);
  });

  it('allows a back-filled date that is far enough from every donation', () => {
    // 101 days before the first donation.
    expect(findTooCloseDonation(DONATIONS, '2025-10-01')).toBeNull();
  });

  it('blocks a second donation on the same day', () => {
    expect(findTooCloseDonation(DONATIONS, '2026-06-01')).toEqual(DONATIONS[1]);
  });

  it('ignores the donation being edited', () => {
    expect(findTooCloseDonation(DONATIONS, '2026-06-05', 2)).toBeNull();
  });

  it('allows anything for a donor with no donations', () => {
    expect(findTooCloseDonation([], '2026-06-01')).toBeNull();
  });
});

describe('getEligibility', () => {
  it('says a first-time donor is eligible', () => {
    expect(getEligibility([], '2026-10-07')).toEqual({
      isEligible: true,
      lastDonationDate: null,
      nextEligibleDate: null,
    });
  });

  it('gives the next eligible date (last donation + 90 days)', () => {
    expect(getEligibility(DONATIONS, '2026-08-29')).toEqual({
      isEligible: false,
      lastDonationDate: '2026-06-01',
      nextEligibleDate: '2026-08-30',
    });
  });

  it('becomes eligible on the next eligible date itself', () => {
    expect(getEligibility(DONATIONS, '2026-08-30').isEligible).toBe(true);
  });

  it('uses the newest donation even if the list is not sorted', () => {
    expect(getLastDonationDate([...DONATIONS].reverse())).toBe('2026-06-01');
  });
});
