import { z } from 'zod';
import { VALIDATION_MESSAGES as MSG } from '@/constants/messages';
import { PASSWORD_RULES } from '@/constants/passwordRules';
import { LIMITS, PATTERNS } from '@/constants/validation';

const passwordSchema = z
  .string()
  .min(1, { error: MSG.PASSWORD_REQUIRED })
  .refine((password) => PASSWORD_RULES.every((rule) => rule.pattern.test(password)), {
    error: MSG.PASSWORD_REQUIREMENTS,
  });

const registerFields = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { error: MSG.FULL_NAME_REQUIRED })
    .min(LIMITS.FULL_NAME_MIN, { error: MSG.FULL_NAME_LENGTH })
    .max(LIMITS.FULL_NAME_MAX, { error: MSG.FULL_NAME_LENGTH })
    .regex(PATTERNS.FULL_NAME, { error: MSG.FULL_NAME_FORMAT }),
  username: z
    .string()
    .trim()
    .min(1, { error: MSG.USERNAME_REQUIRED })
    .min(LIMITS.USERNAME_MIN, { error: MSG.USERNAME_LENGTH })
    .max(LIMITS.USERNAME_MAX, { error: MSG.USERNAME_LENGTH })
    .regex(PATTERNS.USERNAME, { error: MSG.USERNAME_FORMAT }),
  email: z
    .string()
    .trim()
    .min(1, { error: MSG.EMAIL_REQUIRED })
    .max(LIMITS.EMAIL_MAX, { error: MSG.EMAIL_LENGTH })
    .pipe(z.email({ error: MSG.EMAIL_FORMAT })),
  phone: z
    .string()
    .trim()
    .min(1, { error: MSG.PHONE_REQUIRED })
    .regex(PATTERNS.PHONE, { error: MSG.PHONE_FORMAT }),
  password: passwordSchema,
  confirmPassword: z.string().min(1, { error: MSG.CONFIRM_PASSWORD_REQUIRED }),
});

const passwordPair = registerFields.pick({ password: true, confirmPassword: true });

export const registerSchema = registerFields.refine(
  (values) => values.password === values.confirmPassword,
  {
    error: MSG.PASSWORDS_MISMATCH,
    path: ['confirmPassword'],
    // Without "when", Zod skips this check until EVERY field is valid, so the user would not
    // see the mismatch message while, say, the phone field is still empty.
    when: (payload) => passwordPair.safeParse(payload.value).success,
  },
);
