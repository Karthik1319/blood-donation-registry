import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const DEFAULT_API_PROXY_TARGET = 'http://localhost:8080';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      // fileURLToPath builds a correct path on both macOS and Windows.
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      // Forward /api calls to Spring Boot in development so the browser never hits CORS issues.
      proxy: { '/api': env.API_PROXY_TARGET || DEFAULT_API_PROXY_TARGET },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
    },
  };
});
