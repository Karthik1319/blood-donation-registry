import { LIMITS } from '@/constants/limits';
import { MESSAGES } from '@/constants/messages';

export const PATTERNS = {
  NAME: /^[A-Za-z ]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: new RegExp(`^\\d{${LIMITS.PHONE_DIGITS}}$`),
};

// Single source of truth: the Zod schema AND the live checklist both read these rules.
export const PASSWORD_RULES = [
  {
    id: 'length',
    label: MESSAGES.PASSWORD_RULE_LENGTH,
    pattern: new RegExp(`^.{${LIMITS.PASSWORD_MIN},}$`),
  },
  { id: 'uppercase', label: MESSAGES.PASSWORD_RULE_UPPERCASE, pattern: /[A-Z]/ },
  { id: 'lowercase', label: MESSAGES.PASSWORD_RULE_LOWERCASE, pattern: /[a-z]/ },
  { id: 'number', label: MESSAGES.PASSWORD_RULE_NUMBER, pattern: /\d/ },
  { id: 'special', label: MESSAGES.PASSWORD_RULE_SPECIAL, pattern: /[^A-Za-z0-9]/ },
];
