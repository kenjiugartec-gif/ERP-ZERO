import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Asegura que las rutas sean relativas para Hostinger
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Agrupamos todas las dependencias de node_modules en un solo bloque 'vendor'
          // para evitar el error de dependencias circulares entre archivos separados.
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});