import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const BACKEND_URL = 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // fileURLToPath builds a correct path on both macOS and Windows.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // Forwards /api/* to Spring Boot, so browser and API share one origin in development:
    // no CORS setup needed and the SameSite=Strict refresh cookie works.
    proxy: { '/api': { target: BACKEND_URL, changeOrigin: true } },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
});
