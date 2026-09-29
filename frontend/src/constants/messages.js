import { LIMITS } from '@/constants/validation';

export const VALIDATION_MESSAGES = Object.freeze({
  FULL_NAME_REQUIRED: 'Full name is required.',
  FULL_NAME_LENGTH: `Full name must be ${LIMITS.FULL_NAME_MIN}–${LIMITS.FULL_NAME_MAX} characters.`,
  FULL_NAME_FORMAT: 'Full name can contain only letters, spaces, dots, hyphens and apostrophes.',
  USERNAME_REQUIRED: 'Username is required.',
  USERNAME_LENGTH: `Username must be ${LIMITS.USERNAME_MIN}–${LIMITS.USERNAME_MAX} characters.`,
  USERNAME_FORMAT: 'Username can contain only letters, numbers and underscores.',
  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_FORMAT: 'Enter a valid email address, e.g. name@example.com.',
  EMAIL_LENGTH: `Email must be at most ${LIMITS.EMAIL_MAX} characters.`,
  PHONE_REQUIRED: 'Phone number is required.',
  PHONE_FORMAT: `Phone number must be exactly ${LIMITS.PHONE_DIGITS} digits.`,
  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_LENGTH: `Password must be ${LIMITS.PASSWORD_MIN}–${LIMITS.PASSWORD_MAX} characters.`,
  PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter.',
  PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter.',
  PASSWORD_DIGIT: 'Password must contain at least one number.',
  PASSWORD_SPECIAL: 'Password must contain at least one special character.',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password.',
  PASSWORDS_MISMATCH: 'Passwords do not match.',
});

export const API_MESSAGES = Object.freeze({
  INVALID_CREDENTIALS: 'Invalid username or password.',
  ACCOUNT_EXISTS: 'An account with this username or email already exists.',
  BAD_REQUEST: 'Some details are invalid. Please check the form and try again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  NETWORK: 'Unable to reach the server. Please check your connection and try again.',
  SERVER: 'Something went wrong on our side. Please try again later.',
  UNAVAILABLE: 'The service is temporarily unavailable. Please try again in a few minutes.',
});

export const SUCCESS_MESSAGES = Object.freeze({
  REGISTERED: 'Registration successful. Please sign in with your new account.',
});
