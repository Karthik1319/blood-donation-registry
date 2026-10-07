import MockAdapter from 'axios-mock-adapter';
import { registerAuthHandlers } from '@/mocks/authHandlers';
import { registerDonationHandlers } from '@/mocks/donationHandlers';
import { registerDonorHandlers } from '@/mocks/donorHandlers';
import { MOCK_CONFIG } from '@/mocks/mockConfig';
import { registerUserHandlers } from '@/mocks/userHandlers';

/**
 * Fake backend for mock mode: answers the Axios instance's requests inside the browser instead
 * of sending them to Spring Boot. Interceptors, tokens, 401 and 403 all run exactly as with the
 * real API; unknown URLs get 404.
 */
export function startMockServer(axiosInstance, delayMs = MOCK_CONFIG.DELAY_MS) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: delayMs });
  registerAuthHandlers(mock);
  registerDonorHandlers(mock);
  registerDonationHandlers(mock);
  registerUserHandlers(mock);
  return mock;
}
