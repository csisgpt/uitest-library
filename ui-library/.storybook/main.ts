import { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|js)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [vue()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../'),
        },
      },
    });
  },
};
export default config;
