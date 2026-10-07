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
    expect(errorsFor({ fullName: 'Ravi <script>' }).fullName).toBe(MESSAGES.NAME_INVALID);
    expect(errorsFor({ fullName: '-Ravi' }).fullName).toBe(MESSAGES.NAME_INVALID);
  });

  it('accepts real-world names with special characters', () => {
    ["O'Brien", 'Anne-Marie Rao', 'Dr. K. Rao', 'Zoë Müller', 'José'].forEach((fullName) => {
      expect(errorsFor({ fullName })).toEqual({});
    });
  });

  it('trims spaces and treats a space-only name as empty', () => {
    expect(errorsFor({ fullName: '   ' }).fullName).toBe(MESSAGES.NAME_REQUIRED);
  });

  it('limits very long text', () => {
    expect(errorsFor({ fullName: 'A'.repeat(51) }).fullName).toBe(MESSAGES.NAME_MAX);
    expect(errorsFor({ email: `${'a'.repeat(95)}@x.com` }).email).toBe(MESSAGES.EMAIL_MAX);
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
