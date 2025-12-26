import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/pp-karuta/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
