import { z } from 'zod';
import { MESSAGES } from '@/constants/messages';
import { PATTERNS } from '@/constants/validation';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, MESSAGES.EMAIL_REQUIRED)
    .regex(PATTERNS.EMAIL, MESSAGES.EMAIL_INVALID),
  // Only "required" here: password strength rules belong to registration, and the server decides
  // whether the credentials are correct.
  password: z.string().min(1, MESSAGES.PASSWORD_REQUIRED),
});

export const LOGIN_INITIAL_VALUES = { email: '', password: '' };
