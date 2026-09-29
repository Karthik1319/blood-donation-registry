import { HINTS, LABELS } from '@/constants/labels';
import { PASSWORD_RULES } from '@/constants/passwordRules';

// Field definitions drive the forms, so each input's JSX is written once (in Input.jsx).
// "name" must match the key in the Zod schema for that form.
export const LOGIN_FIELDS = Object.freeze([
  { name: 'username', label: LABELS.FIELD_USERNAME, autoComplete: 'username' },
  {
    name: 'password',
    label: LABELS.FIELD_PASSWORD,
    type: 'password',
    autoComplete: 'current-password',
  },
]);

export const REGISTER_FIELDS = Object.freeze([
  { name: 'fullName', label: LABELS.FIELD_FULL_NAME, autoComplete: 'name' },
  { name: 'username', label: LABELS.FIELD_USERNAME, autoComplete: 'username' },
  { name: 'email', label: LABELS.FIELD_EMAIL, type: 'email', autoComplete: 'email' },
  {
    name: 'phone',
    label: LABELS.FIELD_PHONE,
    type: 'tel',
    autoComplete: 'tel',
    inputMode: 'numeric',
    hint: HINTS.PHONE,
  },
  {
    name: 'password',
    label: LABELS.FIELD_PASSWORD,
    type: 'password',
    autoComplete: 'new-password',
    requirements: PASSWORD_RULES,
  },
  {
    name: 'confirmPassword',
    label: LABELS.FIELD_CONFIRM_PASSWORD,
    type: 'password',
    autoComplete: 'new-password',
  },
]);

export const LOGIN_INITIAL_VALUES = Object.freeze({ username: '', password: '' });

export const REGISTER_INITIAL_VALUES = Object.freeze({
  fullName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});
