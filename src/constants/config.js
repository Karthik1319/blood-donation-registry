export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  REQUEST_TIMEOUT_MS: 15000,
  DONORS_PAGE_SIZE: 5,
  // Wait until the user stops typing before searching, instead of calling the API per keystroke.
  SEARCH_DEBOUNCE_MS: 400,
  DATE_LOCALE: 'en-IN',
  TOAST_DURATION_MS: 4000,
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
