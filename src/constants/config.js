export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  // true = use the in-memory mock API (no backend needed); false = call the Spring Boot API.
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  REQUEST_TIMEOUT_MS: 15000,
  // Fake network delay so loading states are visible in mock mode.
  MOCK_DELAY_MS: 800,
  DONORS_PAGE_SIZE: 5,
  // Wait until the user stops typing before searching, instead of calling the API per keystroke.
  SEARCH_DEBOUNCE_MS: 400,
  DATE_LOCALE: 'en-IN',
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
