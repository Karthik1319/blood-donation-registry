import { z } from 'zod';
import { BLOOD_GROUPS } from '@/constants/config';
import { LIMITS } from '@/constants/limits';
import { MESSAGES } from '@/constants/messages';
import { PATTERNS } from '@/constants/validation';

// Field rules shared by several forms (registration, donor form), so each rule is written once.

export const nameField = z
  .string()
  .trim()
  .min(1, MESSAGES.NAME_REQUIRED)
  .min(LIMITS.NAME_MIN, MESSAGES.NAME_MIN)
  .max(LIMITS.NAME_MAX, MESSAGES.NAME_MAX)
  .regex(PATTERNS.NAME, MESSAGES.NAME_INVALID);

export const emailField = z
  .string()
  .trim()
  .min(1, MESSAGES.EMAIL_REQUIRED)
  .max(LIMITS.EMAIL_MAX, MESSAGES.EMAIL_MAX)
  .regex(PATTERNS.EMAIL, MESSAGES.EMAIL_INVALID);

export const phoneField = z
  .string()
  .trim()
  .min(1, MESSAGES.PHONE_REQUIRED)
  .regex(PATTERNS.PHONE, MESSAGES.PHONE_INVALID);

export const bloodGroupField = z
  .string()
  .refine((value) => BLOOD_GROUPS.includes(value), MESSAGES.BLOOD_GROUP_REQUIRED);
