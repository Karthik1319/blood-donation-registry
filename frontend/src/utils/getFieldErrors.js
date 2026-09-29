import { z } from 'zod';

// Turns a Zod error into { fieldName: 'first error message' } for easy display next to inputs.
export function getFieldErrors(zodError) {
  const { fieldErrors } = z.flattenError(zodError);
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0]]),
  );
}
