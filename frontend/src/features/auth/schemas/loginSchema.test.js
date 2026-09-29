import { describe, expect, it } from 'vitest';
import { VALIDATION_MESSAGES } from '@/constants/messages';
import { loginSchema } from '@/features/auth/schemas/loginSchema';
import { getFieldErrors } from '@/utils/getFieldErrors';

function errorsFor(values) {
  const result = loginSchema.safeParse(values);
  return result.success ? {} : getFieldErrors(result.error);
}

describe('loginSchema', () => {
  it('accepts a filled-in username and password', () => {
    expect(errorsFor({ username: 'admin', password: 'anything' })).toEqual({});
  });

  it('requires both fields', () => {
    expect(errorsFor({ username: '', password: '' })).toEqual({
      username: VALIDATION_MESSAGES.USERNAME_REQUIRED,
      password: VALIDATION_MESSAGES.PASSWORD_REQUIRED,
    });
  });

  it('treats a username of only spaces as empty', () => {
    expect(errorsFor({ username: '   ', password: 'x' }).username).toBe(
      VALIDATION_MESSAGES.USERNAME_REQUIRED,
    );
  });

  it('trims the username in the parsed data', () => {
    expect(loginSchema.parse({ username: '  admin  ', password: 'x' }).username).toBe('admin');
  });
});
