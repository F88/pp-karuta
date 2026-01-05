/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: '/pp-karuta/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // TanStack Router
            if (id.includes('@tanstack/react-router')) {
              return 'tanstack-router';
            }
            // Promidas (large library)
            if (id.includes('@f88/promidas')) {
              return 'promidas';
            }
            // API client
            if (id.includes('protopedia-api-v2-client')) {
              return 'api-vendor';
            }
            // Faker.js (large dev dependency mistakenly in production)
            if (id.includes('@faker-js/faker')) {
              return 'faker-vendor';
            }
            // React core and scheduler (must be together)
            if (
              id.match(/\/node_modules\/react\//) ||
              id.match(/\/node_modules\/react-dom\//) ||
              id.match(/\/node_modules\/scheduler\//)
            ) {
              return 'react-vendor';
            }
            // All other vendors (radix-ui, lucide, markdown, etc.)
            return 'vendor';
          }

          // App code chunks
          if (id.includes('/src/')) {
            return 'ppk';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
