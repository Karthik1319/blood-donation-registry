import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { clearAccessToken } from '@/services/tokenStorage';

afterEach(() => {
  cleanup();
  clearAccessToken();
});
