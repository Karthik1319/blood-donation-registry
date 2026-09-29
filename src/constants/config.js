export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  // Fake network delay so loading states are visible until the Spring Boot API exists.
  MOCK_DELAY_MS: 800,
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
