/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon-180x180.png'],
      manifest: {
        name: '🎴 PPK26 怖露徒頁帝亜 狩流多 弐拾六式 馬耳闘風編',
        short_name: '🎴PPK26',
        description: 'ProtoPediaで公開されている作品のかるた、画像のみを頼りに札を取る「愛と本能の闘争」',
        lang: 'ja',
        id: '/pp-karuta/',
        theme_color: '#f5f5f5',
        background_color: '#f5f5f5',
        display: 'standalone',
        scope: '/pp-karuta/',
        start_url: '/pp-karuta/',
        orientation: 'any',
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'sss/ss-sp-1-750x1334.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: 'sss/ss-sp-2-750x1334.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: 'sss/ss-sp-3-750x1334.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: 'sss/ss-pc-1-1920x1080.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'sss/ss-pc-2-1920x1080.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'sss/ss-pc-3-1920x1080.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg}'],
        globIgnores: ['**/faker-vendor-*.js', '**/ppk26-icon-*.png'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
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
