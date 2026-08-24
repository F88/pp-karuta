import path from 'path';
import { fileURLToPath } from 'url';

import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(config) {
    return mergeConfig(
      {
        ...config,
        // Storybook loads the project's vite.config.ts, so VitePWA ends up
        // registered here too. Storybook needs no service worker, and its
        // manager bundle (sb-manager/globals-runtime.js, ~3.25 MB) exceeds
        // workbox.maximumFileSizeToCacheInBytes, which vite-plugin-pwa
        // reports as a build failure rather than a warning. Dropping the
        // plugins keeps that limit meaningful for the app build instead of
        // having to raise it for Storybook's sake.
        plugins: (config.plugins ?? [])
          .flat(Infinity)
          .filter(
            (plugin) =>
              !(
                plugin &&
                typeof plugin === 'object' &&
                'name' in plugin &&
                String(plugin.name).startsWith('vite-plugin-pwa')
              ),
          ),
      },
      {
        plugins: [tailwindcss()],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, '../src'),
          },
        },
      },
    );
  },
};
export default config;
