import { z } from 'zod';
import { LIMITS } from '@/constants/limits';
import { MESSAGES } from '@/constants/messages';
import { PATTERNS } from '@/constants/validation';
import { getTodayIsoDate, isValidIsoDate } from '@/utils/dateUtils';
import { findTooCloseDonation } from '@/utils/donationEligibility';
import { formatDate } from '@/utils/formatDate';

const donationDateField = z
  .string()
  .min(1, MESSAGES.DONATION_DATE_REQUIRED)
  .regex(PATTERNS.ISO_DATE, MESSAGES.DONATION_DATE_INVALID)
  .refine(isValidIsoDate, MESSAGES.DONATION_DATE_INVALID)
  // Both are "YYYY-MM-DD", so comparing the text compares the dates.
  .refine((date) => date <= getTodayIsoDate(), MESSAGES.DONATION_DATE_FUTURE);

// The input gives text; after the "required" check it is turned into a whole number of ml.
const quantityField = z
  .string()
  .trim()
  .min(1, MESSAGES.QUANTITY_REQUIRED)
  .pipe(
    z.coerce
      .number()
      .int(MESSAGES.QUANTITY_RANGE)
      .min(LIMITS.QUANTITY_MIN_ML, MESSAGES.QUANTITY_RANGE)
      .max(LIMITS.QUANTITY_MAX_ML, MESSAGES.QUANTITY_RANGE),
  );

const locationField = z
  .string()
  .trim()
  .min(1, MESSAGES.LOCATION_REQUIRED)
  .max(LIMITS.LOCATION_MAX, MESSAGES.LOCATION_MAX);

/**
 * Builds the donation schema for one donor. It needs the donor's other donations to apply the
 * 90-day rule. `editingId` is the donation being edited (left out when adding a new one).
 */
export function createDonationSchema(donations, editingId) {
  return z
    .object({
      donationDate: donationDateField,
      quantity: quantityField,
      location: locationField,
    })
    .superRefine(({ donationDate }, context) => {
      const tooClose = findTooCloseDonation(donations, donationDate, editingId);
      if (tooClose) {
        context.addIssue({
          code: 'custom',
          path: ['donationDate'],
          message: MESSAGES.donationTooSoon(formatDate(tooClose.donationDate)),
        });
      }
    });
}

export const DONATION_INITIAL_VALUES = { donationDate: '', quantity: '', location: '' };

/** Turns a donation from the API into form values (the quantity input needs text). */
export function toDonationFormValues({ donationDate, quantity, location }) {
  return { donationDate, quantity: String(quantity), location };
}
