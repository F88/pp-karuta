/// <reference types="vitest" />
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Absolute path of the app's own HTML entry point.
 *
 * The CSP plugin matches on this rather than on the hook's `path`, so the
 * guard cannot silently fail open if path normalisation ever changes. A
 * missing CSP breaks nothing observable, so there would be no symptom.
 */
const APP_INDEX_HTML = path.resolve(__dirname, 'index.html');

/**
 * Builds the Content Security Policy for the given environment.
 *
 * The app loads no fonts and embeds no frames, so `default-src 'none'` keeps
 * both denied. Everything else comes from its own origin, except
 * protopedia.net, which serves two purposes: it is the sole destination for
 * the API token, and it hosts the prototype images the game is built around.
 * The dev server needs a single relaxation: inline scripts for the React
 * Fast Refresh preamble. Its HMR WebSocket needs no extra source, because
 * `connect-src 'self'` already matches a ws://
 * URL on the page's own host and port. Every other directive, `connect-src`
 * and `img-src` included, is identical in both modes, so exfiltration behaves
 * the same way in development as in production.
 *
 * Delivery differs per environment: GitHub Pages serves static files only and
 * cannot set response headers, so the production policy travels in a
 * `<meta http-equiv>` tag. Note that `frame-ancestors`, `report-uri`,
 * `report-to` and `sandbox` are ignored when delivered that way, and
 * `Content-Security-Policy-Report-Only` is not available at all.
 */
function buildContentSecurityPolicy(
  mode: 'production' | 'development',
): string {
  const isDev = mode === 'development';

  return [
    // Deny anything not explicitly listed below, including future directives.
    "default-src 'none'",
    // Bundled scripts only. Blocks injected inline and remote scripts.
    // The dev server injects the React Fast Refresh preamble inline, so
    // 'unsafe-inline' is unavoidable there.
    `script-src 'self'${isDev ? " 'unsafe-inline'" : ''}`,
    // react-fast-marquee appends a <style> element at runtime, so inline
    // styles are unavoidable here.
    "style-src 'self' 'unsafe-inline'",
    // Prototype images are served from protopedia.net, which connect-src
    // already allows, so listing it here opens no new exfiltration channel.
    // `data:` covers the inline SVG placeholder used as the onError fallback
    // and issues no network request.
    "img-src 'self' data: https://protopedia.net",
    // The single legitimate destination for the API token, in both modes. The
    // dev server's HMR WebSocket needs no entry of its own: CSP matches a ws://
    // URL against 'self', so it keeps working through whichever loopback
    // hostname and port the page was reached on.
    "connect-src 'self' https://protopedia.net",
    // The PWA service worker. On CSP Level 3 engines worker-src resolves
    // through child-src to script-src 'self', which makes this look
    // redundant. It is not: engines without worker-src support (Safari
    // before 15.4) fall back to default-src instead, where 'none' blocks
    // sw.js and silently drops offline support. Listing it also keeps
    // registration independent of any future script-src tightening.
    "worker-src 'self'",
    // The PWA manifest, which falls back to default-src rather than
    // script-src, so 'none' would block it.
    "manifest-src 'self'",
    // No form performs a real submission; the token form calls preventDefault().
    "form-action 'none'",
    // Prevents an injected <base> tag from rewriting relative URLs.
    "base-uri 'none'",
  ].join('; ');
}

/**
 * Injects the CSP meta tag into `index.html` at build time.
 *
 * Build-only because the meta tag exists to work around GitHub Pages being
 * unable to set response headers. The dev server can set them, so it serves the
 * development policy through `server.headers` instead.
 */
function contentSecurityPolicyPlugin(): Plugin {
  return {
    name: 'inject-csp-meta',
    apply: 'build',
    transformIndexHtml(_html, ctx) {
      // Storybook's react-vite framework merges this config and builds its own
      // iframe.html through the same hook. That document needs inline scripts
      // and framing, so restrict the policy to the app's own entry point.
      if (ctx.filename !== APP_INDEX_HTML) {
        return [];
      }

      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: buildContentSecurityPolicy('production'),
          },
          // A meta policy only governs what follows it, so it must come first.
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [
    tanstackRouter(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/favicon.ico',
        'icons/apple-touch-icon-180x180.png',
      ],
      manifest: {
        name: '🎴 PPK26 怖露徒頁帝亜 狩流多 弐拾六式 馬耳闘風編',
        short_name: '🎴PPK26',
        description:
          'ProtoPediaで公開されている作品のかるた、画像のみを頼りに札を取る「愛と本能の闘争」',
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
            // src: 'icons/maskable-icon-512x512.png',
            src: 'icons/pwa-512x512.png',
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
        globIgnores: [
          '**/ppk26-icon-*.png',
          '**/dev-snapshot-*.js',
          'images/**',
          'sss/**',
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    contentSecurityPolicyPlugin(),
  ],
  server: {
    // Unlike GitHub Pages, the dev server can set response headers, so the
    // policy is delivered that way here rather than through the meta tag.
    headers: {
      'Content-Security-Policy': buildContentSecurityPolicy('development'),
    },
  },
  preview: {
    // `vite preview` would otherwise inherit server.headers and serve the
    // development policy next to the production meta tag. Clearing it keeps
    // preview a faithful stand-in for GitHub Pages, where the meta tag is the
    // only policy in effect.
    headers: {},
  },
  base: '/pp-karuta/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Debug: Log module IDs containing promidas
          // if (id.includes('promidas')) {
          // console.log('Module ID:', id);
          // }

          // Vendor chunks
          if (id.includes('node_modules')) {
            // TanStack Router
            if (id.includes('@tanstack/react-router')) {
              return 'tanstack-router';
            }
            // Promidas utilities (separate from main promidas)
            if (id.includes('/promidas-utils/')) {
              return 'promidas-utils';
            }
            // Promidas (large library)
            if (id.includes('/promidas/')) {
              return 'promidas';
            }
            // API client
            if (id.includes('protopedia-api-v2-client')) {
              return 'protopedia-api-v2-client';
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
