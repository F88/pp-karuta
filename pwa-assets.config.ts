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
  },
  images: [
    // 'public/ppk26-icon-2048x2048.png',
    'public/ppk26-icon-for-kids-2048x2048.png',
  ],
});
