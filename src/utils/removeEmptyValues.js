/**
 * Returns a copy of `params` without empty values, e.g. { page: 0, search: '' } → { page: 0 },
 * so the API only receives the filters the user actually set.
 */
export function removeEmptyValues(params) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== null && value !== undefined,
    ),
  );
}
