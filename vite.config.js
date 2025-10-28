import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the miniaturas dashboard. This uses the
// React plugin so you can import and use JSX/TSX modules.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});