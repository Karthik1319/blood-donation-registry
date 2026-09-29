import { describe, expect, it } from 'vitest';
import { MESSAGES } from '@/constants/messages';
import { registrationSchema } from '@/features/auth/registrationSchema';
import { getFieldErrors } from '@/utils/getFieldErrors';

const VALID_USER = {
  fullName: 'Ravi Kumar',
  email: 'ravi@example.com',
  phone: '9876543210',
  bloodGroup: 'B+',
  password: 'Strong@123',
  confirmPassword: 'Strong@123',
};

const errorsFor = (changes) => getFieldErrors(registrationSchema, { ...VALID_USER, ...changes });

describe('registrationSchema', () => {
  it('accepts valid data', () => {
    expect(errorsFor({})).toEqual({});
  });

  it('validates the full name', () => {
    expect(errorsFor({ fullName: '' }).fullName).toBe(MESSAGES.NAME_REQUIRED);
    expect(errorsFor({ fullName: 'R' }).fullName).toBe(MESSAGES.NAME_MIN);
    expect(errorsFor({ fullName: 'Ravi 123' }).fullName).toBe(MESSAGES.NAME_INVALID);
  });

  it('requires a 10 digit phone number', () => {
    expect(errorsFor({ phone: '12345' }).phone).toBe(MESSAGES.PHONE_INVALID);
    expect(errorsFor({ phone: '98765abcde' }).phone).toBe(MESSAGES.PHONE_INVALID);
  });

  it('only allows known blood groups', () => {
    expect(errorsFor({ bloodGroup: '' }).bloodGroup).toBe(MESSAGES.BLOOD_GROUP_REQUIRED);
    expect(errorsFor({ bloodGroup: 'C+' }).bloodGroup).toBe(MESSAGES.BLOOD_GROUP_REQUIRED);
  });

  it('rejects a weak password', () => {
    const errors = errorsFor({ password: 'weakpass', confirmPassword: 'weakpass' });
    expect(errors.password).toBe(MESSAGES.PASSWORD_WEAK);
  });

  it('requires matching passwords', () => {
    expect(errorsFor({ confirmPassword: 'Other@123' }).confirmPassword).toBe(
      MESSAGES.PASSWORDS_MISMATCH,
    );
  });
});
