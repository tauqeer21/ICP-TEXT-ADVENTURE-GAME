import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ICP-TEXT-ADVENTURE-GAME/', // ← This line fixes the blank page!
  build: {
    outDir: 'dist',
    sourcemap: false, // Faster builds
  },
  server: {
    port: 3000,
    allowedHosts: ['0884c306c829.ngrok-free.app'] // Keep your ngrok domain
  },
  define: {
    global: 'globalThis',
  },
});
