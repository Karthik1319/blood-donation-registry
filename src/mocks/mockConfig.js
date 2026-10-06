// Settings for the fake backend (mock mode only).
export const MOCK_CONFIG = {
  // Fake network delay so loading states are visible.
  DELAY_MS: 800,
  // Short on purpose, so the "expired token → silent refresh" path really happens while you click.
  ACCESS_TOKEN_TTL_MS: 60 * 1000,
  // Like a bank's idle timeout: no refresh for this long → session ends → next request logs out.
  IDLE_TIMEOUT_MS: 3 * 60 * 1000,
};
