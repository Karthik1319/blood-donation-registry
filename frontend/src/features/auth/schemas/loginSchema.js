import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '@/constants/messages';

// Login only checks that fields are filled in. Applying the password-strength rules here
// would tell an attacker what valid passwords look like and could lock out older accounts.
export const loginSchema = z.object({
  username: z.string().trim().min(1, { error: MSG.USERNAME_REQUIRED }),
  password: z.string().min(1, { error: MSG.PASSWORD_REQUIRED }),
});
