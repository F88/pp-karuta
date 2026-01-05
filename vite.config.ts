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
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // TanStack Router
            if (id.includes('@tanstack/react-router')) {
              return 'tanstack-router';
            }
            // UI libraries (radix-ui, lucide)
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Promidas (large library)
            if (id.includes('@f88/promidas')) {
              return 'promidas';
            }
            // API client (large, but needed)
            if (id.includes('protopedia-api-v2-client')) {
              return 'api-vendor';
            }
            // Faker.js (large dev dependency mistakenly in production)
            if (id.includes('@faker-js/faker')) {
              return 'faker-vendor';
            }
            // All other vendors (radix-ui, lucide, markdown, etc.)
            return 'vendor';
          }

          // App code chunks - group by major functionality
          if (id.includes('/src/')) {
            // All components together
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
