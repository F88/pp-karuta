import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    apple: {
      sizes: [180],
      padding: 0,
    },
  },
  images: [
    // 'public/icons/ppk26-icon-2048x2048.png',
    'public/icons/ppk26-icon-for-kids-2048x2048.png',
  ],
});
