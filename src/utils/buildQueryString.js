/**
 * Turns { page: 0, search: '', bloodGroup: 'A+' } into "?page=0&bloodGroup=A%2B".
 * Empty values are left out so the API only receives filters the user actually set.
 */
export function buildQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}
