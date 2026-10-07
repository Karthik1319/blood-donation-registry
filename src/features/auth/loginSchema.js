import { z } from 'zod';
import { MESSAGES } from '@/constants/messages';
import { emailField } from '@/schemas/fieldSchemas';

export const loginSchema = z.object({
  email: emailField,
  // Only "required" here: password strength rules belong to registration, and the server decides
  // whether the credentials are correct.
  password: z.string().min(1, MESSAGES.PASSWORD_REQUIRED),
});

export const LOGIN_INITIAL_VALUES = { email: '', password: '' };
