import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRUCIAL para que funcione en subdirectorios o hostings básicos
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Agrupar React y librerías core en 'vendor' para estabilidad
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor';
            }
            // Recharts es grande, lo separamos
            if (id.includes('recharts')) {
              return 'charts';
            }
            // El resto se deja automático para evitar 'Circular chunk' errors
          }
        },
      },
    },
  },
});