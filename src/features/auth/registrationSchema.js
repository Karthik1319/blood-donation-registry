import { z } from 'zod';
import { BLOOD_GROUPS } from '@/constants/config';
import { LIMITS } from '@/constants/limits';
import { MESSAGES } from '@/constants/messages';
import { PASSWORD_RULES, PATTERNS } from '@/constants/validation';

const isStrongPassword = (value) => PASSWORD_RULES.every((rule) => rule.pattern.test(value));

export const registrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, MESSAGES.NAME_REQUIRED)
      .min(LIMITS.NAME_MIN, MESSAGES.NAME_MIN)
      .max(LIMITS.NAME_MAX, MESSAGES.NAME_MAX)
      .regex(PATTERNS.NAME, MESSAGES.NAME_INVALID),
    email: z
      .string()
      .trim()
      .min(1, MESSAGES.EMAIL_REQUIRED)
      .max(LIMITS.EMAIL_MAX, MESSAGES.EMAIL_MAX)
      .regex(PATTERNS.EMAIL, MESSAGES.EMAIL_INVALID),
    phone: z
      .string()
      .trim()
      .min(1, MESSAGES.PHONE_REQUIRED)
      .regex(PATTERNS.PHONE, MESSAGES.PHONE_INVALID),
    bloodGroup: z
      .string()
      .refine((value) => BLOOD_GROUPS.includes(value), MESSAGES.BLOOD_GROUP_REQUIRED),
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
