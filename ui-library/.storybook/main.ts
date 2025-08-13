import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../components/**/**/*.stories.@(ts|tsx|js|jsx|mdx)',
  ],
  addons: [
    // 'addon-actions' دیگه وجود نداره و نباید باشه
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    // '@storybook/addon-onboarding' (اختیاری)
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
};

export default config;
