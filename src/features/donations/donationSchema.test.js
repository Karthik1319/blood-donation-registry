import { describe, expect, it } from 'vitest';
import { MESSAGES } from '@/constants/messages';
import { createDonationSchema } from '@/features/donations/donationSchema';
import { addDays, getTodayIsoDate } from '@/utils/dateUtils';
import { formatDate } from '@/utils/formatDate';
import { getFieldErrors } from '@/utils/getFieldErrors';

const today = getTodayIsoDate();
const LAST_DONATION = { id: 5, donationDate: addDays(today, -30), quantity: 450, location: 'A' };
const VALID = { donationDate: addDays(today, -200), quantity: '450', location: 'City Blood Bank' };

const errorsFor = (changes, editingId) =>
  getFieldErrors(createDonationSchema([LAST_DONATION], editingId), { ...VALID, ...changes });

describe('donation schema', () => {
  it('accepts a valid donation and turns quantity into a number', () => {
    const schema = createDonationSchema([LAST_DONATION]);
    expect(schema.parse(VALID).quantity).toBe(450);
  });

  it('requires every field', () => {
    expect(errorsFor({ donationDate: '', quantity: '', location: ' ' })).toEqual({
      donationDate: MESSAGES.DONATION_DATE_REQUIRED,
      quantity: MESSAGES.QUANTITY_REQUIRED,
      location: MESSAGES.LOCATION_REQUIRED,
    });
  });

  it('rejects a future date', () => {
    expect(errorsFor({ donationDate: addDays(today, 1) }).donationDate).toBe(
      MESSAGES.DONATION_DATE_FUTURE,
    );
  });

  it('keeps quantity within the allowed range', () => {
    expect(errorsFor({ quantity: '300' }).quantity).toBe(MESSAGES.QUANTITY_RANGE);
    expect(errorsFor({ quantity: '500' }).quantity).toBe(MESSAGES.QUANTITY_RANGE);
    expect(errorsFor({ quantity: '400.5' }).quantity).toBe(MESSAGES.QUANTITY_RANGE);
  });

  it('blocks a donation less than 90 days from another one', () => {
    expect(errorsFor({ donationDate: today }).donationDate).toBe(
      MESSAGES.donationTooSoon(formatDate(LAST_DONATION.donationDate)),
    );
  });

  it('lets a donation keep its own date when edited', () => {
    expect(errorsFor({ donationDate: LAST_DONATION.donationDate }, LAST_DONATION.id)).toEqual({});
  });
});
