import { LIMITS } from '@/constants/limits';
import { addDays, daysBetween } from '@/utils/dateUtils';

// The project's edge case: a donor must wait MIN_DAYS_BETWEEN_DONATIONS (90) days between
// donations. Used by the donation form, the eligibility banner AND the fake backend, so all agree.
// The real Spring Boot API must apply the same rule; the UI check is only for fast feedback.

/**
 * Returns the existing donation that is less than 90 days away from `donationDate` (before OR
 * after it), or null if there is none. Checking both directions also catches back-filled dates.
 * @param {{id: number, donationDate: string}[]} donations - the donor's donations.
 * @param {string} donationDate - the date being added or edited, "YYYY-MM-DD".
 * @param {number} [ignoreId] - id of the donation being edited, so it isn't compared to itself.
 */
export function findTooCloseDonation(donations, donationDate, ignoreId) {
  return (
    donations.find(
      (donation) =>
        donation.id !== ignoreId &&
        daysBetween(donation.donationDate, donationDate) < LIMITS.MIN_DAYS_BETWEEN_DONATIONS,
    ) ?? null
  );
}

/** The newest donation date, or null when the donor has never donated. */
export function getLastDonationDate(donations) {
  if (donations.length === 0) {
    return null;
  }
  return donations
    .map((donation) => donation.donationDate)
    .sort()
    .at(-1);
}

/**
 * Can the donor donate on `today`? Returns { isEligible, lastDonationDate, nextEligibleDate }.
 * nextEligibleDate is the first allowed day (last donation + 90 days), or null if never donated.
 */
export function getEligibility(donations, today) {
  const lastDonationDate = getLastDonationDate(donations);
  if (!lastDonationDate) {
    return { isEligible: true, lastDonationDate: null, nextEligibleDate: null };
  }
  const nextEligibleDate = addDays(lastDonationDate, LIMITS.MIN_DAYS_BETWEEN_DONATIONS);
  return { isEligible: today >= nextEligibleDate, lastDonationDate, nextEligibleDate };
}
