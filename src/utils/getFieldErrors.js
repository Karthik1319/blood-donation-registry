/**
 * Validates values with a Zod schema and returns { fieldName: firstErrorMessage }.
 * Returns an empty object when everything is valid.
 */
export function getFieldErrors(schema, values) {
  const result = schema.safeParse(values);
  if (result.success) {
    return {};
  }
  const errors = {};
  result.error.issues.forEach((issue) => {
    const fieldName = issue.path[0];
    // Keep only the first message per field so the user fixes one thing at a time.
    if (!errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  });
  return errors;
}
