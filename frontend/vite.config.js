import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        // En mode Docker, on cible le service "backend" défini dans docker-compose
        target: 'http://backend:4000',
        changeOrigin: true
      }
    }
  }
});
