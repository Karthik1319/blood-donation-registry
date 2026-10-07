import { z } from 'zod';
import { LIMITS } from '@/constants/limits';
import { MESSAGES } from '@/constants/messages';
import { PASSWORD_RULES } from '@/constants/validation';
import { bloodGroupField, emailField, nameField, phoneField } from '@/schemas/fieldSchemas';

const isStrongPassword = (value) => PASSWORD_RULES.every((rule) => rule.pattern.test(value));

export const registrationSchema = z
  .object({
    fullName: nameField,
    email: emailField,
    phone: phoneField,
    bloodGroup: bloodGroupField,
    password: z
      .string()
      .min(1, MESSAGES.PASSWORD_REQUIRED)
      .max(LIMITS.PASSWORD_MAX, MESSAGES.PASSWORD_MAX)
      .refine(isStrongPassword, MESSAGES.PASSWORD_WEAK),
    confirmPassword: z.string().min(1, MESSAGES.CONFIRM_PASSWORD_REQUIRED),
  })
  // Cross-field rule: attached to confirmPassword so the error shows under that input.
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.PASSWORDS_MISMATCH,
    path: ['confirmPassword'],
  });

export const REGISTRATION_INITIAL_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  bloodGroup: '',
  password: '',
  confirmPassword: '',
};
