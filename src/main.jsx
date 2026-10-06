import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { APP_CONFIG } from '@/constants/config';
import { apiClient } from '@/services/apiClient';
import '@/styles/global.css';

// In mock mode the fake backend must be ready before the app sends its first request.
// It's loaded with import() so it is never downloaded when the real API is used.
async function startMockServerIfEnabled() {
  if (APP_CONFIG.USE_MOCK_API) {
    const { startMockServer } = await import('@/mocks/mockServer');
    startMockServer(apiClient);
  }
}

startMockServerIfEnabled().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
