// Business limits for form fields. The Spring Boot API must enforce the same rules;
// client-side validation is only for fast feedback, never for security.
export const LIMITS = Object.freeze({
  FULL_NAME_MIN: 2,
  FULL_NAME_MAX: 50,
  USERNAME_MIN: 4,
  USERNAME_MAX: 20,
  EMAIL_MAX: 100,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 64,
  PHONE_DIGITS: 10,
});

export const PATTERNS = Object.freeze({
  FULL_NAME: /^[A-Za-z][A-Za-z .'-]*$/,
  USERNAME: /^[A-Za-z0-9_]+$/,
  PHONE: new RegExp(`^\\d{${LIMITS.PHONE_DIGITS}}$`),
  HAS_UPPERCASE: /[A-Z]/,
  HAS_LOWERCASE: /[a-z]/,
  HAS_DIGIT: /\d/,
  HAS_SPECIAL: /[^A-Za-z0-9]/,
});
