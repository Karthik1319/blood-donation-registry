import { LIMITS } from '@/constants/limits';

export const MESSAGES = {
  // Field validation
  NAME_REQUIRED: 'Full name is required',
  NAME_MIN: `Full name must be at least ${LIMITS.NAME_MIN} characters`,
  NAME_MAX: `Full name must be at most ${LIMITS.NAME_MAX} characters`,
  NAME_INVALID: 'Full name can contain only letters and spaces',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Enter a valid email address (e.g. name@example.com)',
  EMAIL_MAX: `Email must be at most ${LIMITS.EMAIL_MAX} characters`,
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: `Phone number must be exactly ${LIMITS.PHONE_DIGITS} digits`,
  BLOOD_GROUP_REQUIRED: 'Please select a blood group',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_WEAK: 'Password does not meet all the requirements below',
  PASSWORD_MAX: `Password must be at most ${LIMITS.PASSWORD_MAX} characters`,
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
  PASSWORDS_MISMATCH: 'Passwords do not match',

  // Password checklist
  PASSWORD_RULE_LENGTH: `At least ${LIMITS.PASSWORD_MIN} characters`,
  PASSWORD_RULE_UPPERCASE: 'One uppercase letter (A-Z)',
  PASSWORD_RULE_LOWERCASE: 'One lowercase letter (a-z)',
  PASSWORD_RULE_NUMBER: 'One number (0-9)',
  PASSWORD_RULE_SPECIAL: 'One special character (e.g. @ # $ !)',

  // Server / request results
  LOGIN_FAILED: 'Invalid email or password',
  EMAIL_TAKEN: 'An account with this email already exists',
  DONOR_PHONE_TAKEN: 'Another donor already uses this phone number',
  DONATION_DATE_REQUIRED: 'Donation date is required',
  DONATION_DATE_INVALID: 'Enter a valid date',
  DONATION_DATE_FUTURE: 'Donation date cannot be in the future',
  QUANTITY_REQUIRED: 'Quantity is required',
  QUANTITY_RANGE: `Quantity must be a whole number from ${LIMITS.QUANTITY_MIN_ML} to ${LIMITS.QUANTITY_MAX_ML} ml`,
  LOCATION_REQUIRED: 'Location is required',
  LOCATION_MAX: `Location must be at most ${LIMITS.LOCATION_MAX} characters`,
  // Shown when the server rejects a donation with 422 (the 90-day rule).
  DONATION_NOT_ELIGIBLE: `Not eligible: donations must be at least ${LIMITS.MIN_DAYS_BETWEEN_DONATIONS} days apart.`,
  donationTooSoon: (otherDate) =>
    `Too soon: this donor has a donation on ${otherDate}. Donations must be at least ${LIMITS.MIN_DAYS_BETWEEN_DONATIONS} days apart.`,
  REGISTER_SUCCESS: 'Registration successful. Please log in.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Unable to reach the server. Check your connection and try again.',
  BAD_REQUEST: 'Some details are invalid. Please check and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to do this.',
  NOT_FOUND: 'The requested item was not found.',
};
