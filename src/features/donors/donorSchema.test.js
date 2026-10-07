import { describe, expect, it } from 'vitest';
import { MESSAGES } from '@/constants/messages';
import { donorSchema, toDonorFormValues } from '@/features/donors/donorSchema';
import { getFieldErrors } from '@/utils/getFieldErrors';

const VALID_DONOR = { name: 'Ravi Kumar', bloodGroup: 'B+', phone: '9876500001' };
const errorsFor = (changes) => getFieldErrors(donorSchema, { ...VALID_DONOR, ...changes });

describe('donorSchema', () => {
  it('accepts a valid donor', () => {
    expect(errorsFor({})).toEqual({});
  });

  it('requires every field', () => {
    expect(errorsFor({ name: '', bloodGroup: '', phone: '' })).toEqual({
      name: MESSAGES.NAME_REQUIRED,
      bloodGroup: MESSAGES.BLOOD_GROUP_REQUIRED,
      phone: MESSAGES.PHONE_REQUIRED,
    });
  });

  it('uses the same rules as registration for name and phone', () => {
    expect(errorsFor({ name: 'Ravi 123' }).name).toBe(MESSAGES.NAME_INVALID);
    expect(errorsFor({ phone: '12345' }).phone).toBe(MESSAGES.PHONE_INVALID);
  });

  it('turns an API donor into form values', () => {
    expect(toDonorFormValues({ id: 7, ...VALID_DONOR })).toEqual(VALID_DONOR);
  });
});
