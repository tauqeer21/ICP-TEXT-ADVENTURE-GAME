import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    allowedHosts: ['0884c306c829.ngrok-free.app'] // Add your ngrok domain here
  },
  define: {
    global: 'globalThis',
  },
});
