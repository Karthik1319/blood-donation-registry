import { describe, expect, it } from 'vitest';
import { MESSAGES } from '@/constants/messages';
import { loginSchema } from '@/features/auth/loginSchema';
import { getFieldErrors } from '@/utils/getFieldErrors';

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    expect(getFieldErrors(loginSchema, { email: 'a@b.com', password: 'x' })).toEqual({});
  });

  it('requires both fields', () => {
    expect(getFieldErrors(loginSchema, { email: '', password: '' })).toEqual({
      email: MESSAGES.EMAIL_REQUIRED,
      password: MESSAGES.PASSWORD_REQUIRED,
    });
  });

  it('rejects a badly formatted email', () => {
    const errors = getFieldErrors(loginSchema, { email: 'not-an-email', password: 'x' });
    expect(errors.email).toBe(MESSAGES.EMAIL_INVALID);
  });
});
