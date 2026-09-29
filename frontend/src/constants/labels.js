import { LIMITS } from '@/constants/validation';

export const LABELS = Object.freeze({
  NAV_LOGIN: 'Sign in',
  NAV_REGISTER: 'Register',
  NAV_MAIN: 'Main navigation',
  SKIP_TO_CONTENT: 'Skip to main content',
  FOOTER_RIGHTS: 'All rights reserved.',
  FOOTER_TAGLINE: 'Every donation can save up to three lives.',

  LOGIN_TITLE: 'Sign in',
  LOGIN_SUBTITLE: 'Access the blood donation registry.',
  LOGIN_SUBMIT: 'Sign in',
  LOGIN_SUBMITTING: 'Signing in…',
  LOGIN_NO_ACCOUNT: "Don't have an account?",

  REGISTER_TITLE: 'Create an account',
  REGISTER_SUBTITLE: 'Register to manage donors and donations.',
  REGISTER_SUBMIT: 'Create account',
  REGISTER_SUBMITTING: 'Creating account…',
  REGISTER_HAS_ACCOUNT: 'Already have an account?',

  HOME_TITLE: 'Welcome',
  HOME_TEXT: 'Donor and donation management will appear here.',
  NOT_FOUND_TITLE: 'Page not found',
  NOT_FOUND_TEXT: 'The page you are looking for does not exist.',
  NOT_FOUND_LINK: 'Go to sign in',

  FIELD_FULL_NAME: 'Full name',
  FIELD_USERNAME: 'Username',
  FIELD_EMAIL: 'Email',
  FIELD_PHONE: 'Phone number',
  FIELD_PASSWORD: 'Password',
  FIELD_CONFIRM_PASSWORD: 'Confirm password',
  REQUIRED_MARK: '*',
  REQUIRED_HINT: 'required',

  ALERT_ERROR_PREFIX: 'Error:',
  ALERT_SUCCESS_PREFIX: 'Success:',
});

export const HINTS = Object.freeze({
  PASSWORD: `At least ${LIMITS.PASSWORD_MIN} characters with uppercase, lowercase, a number and a special character.`,
  PHONE: `${LIMITS.PHONE_DIGITS} digits, numbers only.`,
});
