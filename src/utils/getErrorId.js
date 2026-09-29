/** Builds the id of a field's error message, so the input can point to it with aria-describedby. */
export function getErrorId(fieldId) {
  return `${fieldId}-error`;
}
