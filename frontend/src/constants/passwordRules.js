import { PASSWORD_RULE_LABELS as RULE } from '@/constants/labels';
import { PATTERNS } from '@/constants/validation';

// Single source of truth: the Zod schema checks these rules and the checklist displays them,
// so the UI can never show a rule that validation does not enforce (or the other way round).
export const PASSWORD_RULES = Object.freeze([
  { id: 'length', label: RULE.LENGTH, pattern: PATTERNS.PASSWORD_LENGTH },
  { id: 'uppercase', label: RULE.UPPERCASE, pattern: PATTERNS.HAS_UPPERCASE },
  { id: 'lowercase', label: RULE.LOWERCASE, pattern: PATTERNS.HAS_LOWERCASE },
  { id: 'digit', label: RULE.DIGIT, pattern: PATTERNS.HAS_DIGIT },
  { id: 'special', label: RULE.SPECIAL, pattern: PATTERNS.HAS_SPECIAL },
]);
