import { describe, expect, it } from 'vitest';
import { VALIDATION_MESSAGES as MSG } from '@/constants/messages';
import { registerSchema } from '@/features/auth/schemas/registerSchema';
import { getFieldErrors } from '@/utils/getFieldErrors';

const VALID = {
  fullName: 'Asha Rao',
  username: 'asha_rao',
  email: 'asha@example.com',
  phone: '9876543210',
  password: 'Str0ng!Pass',
  confirmPassword: 'Str0ng!Pass',
};

function errorsFor(overrides) {
  const result = registerSchema.safeParse({ ...VALID, ...overrides });
  return result.success ? {} : getFieldErrors(result.error);
}

describe('registerSchema', () => {
  it('accepts valid registration details', () => {
    expect(errorsFor({})).toEqual({});
  });

  it.each([
    ['fullName', '', MSG.FULL_NAME_REQUIRED],
    ['fullName', 'A', MSG.FULL_NAME_LENGTH],
    ['fullName', 'Asha123', MSG.FULL_NAME_FORMAT],
    ['username', 'abc', MSG.USERNAME_LENGTH],
    ['username', 'asha rao', MSG.USERNAME_FORMAT],
    ['email', '', MSG.EMAIL_REQUIRED],
    ['email', 'not-an-email', MSG.EMAIL_FORMAT],
    ['phone', '', MSG.PHONE_REQUIRED],
    ['phone', '12345', MSG.PHONE_FORMAT],
    ['phone', '98765abcde', MSG.PHONE_FORMAT],
  ])('rejects %s = "%s"', (field, value, message) => {
    expect(errorsFor({ [field]: value })[field]).toBe(message);
  });

  it.each([
    ['', MSG.PASSWORD_REQUIRED],
    ['Sh0rt!', MSG.PASSWORD_LENGTH],
    ['lower0nly!', MSG.PASSWORD_UPPERCASE],
    ['UPPER0NLY!', MSG.PASSWORD_LOWERCASE],
    ['NoDigits!!', MSG.PASSWORD_DIGIT],
    ['NoSpecial00', MSG.PASSWORD_SPECIAL],
  ])('rejects password "%s"', (password, message) => {
    expect(errorsFor({ password, confirmPassword: password }).password).toBe(message);
  });

  it('reports mismatched passwords on the confirm field', () => {
    expect(errorsFor({ confirmPassword: 'Different1!' }).confirmPassword).toBe(
      MSG.PASSWORDS_MISMATCH,
    );
  });

  it('reports a password mismatch even while other fields are still invalid', () => {
    const errors = errorsFor({ phone: '', confirmPassword: 'Different1!' });
    expect(errors.confirmPassword).toBe(MSG.PASSWORDS_MISMATCH);
    expect(errors.phone).toBe(MSG.PHONE_REQUIRED);
  });
});
