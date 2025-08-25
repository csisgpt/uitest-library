// .storybook/preview.ts
import type { Preview } from '@storybook/vue3'

// ⬇️ تم و توکن‌ها + فونت (تو پروژه‌ات همین مسیرها هست)
import '../theme/index.css' // شامل base + light + dark + IRANYekanX (طبق ساختار شما)

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Switch light/dark theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
    direction: {
      name: 'Direction',
      description: 'Text direction',
      defaultValue: 'rtl',
      toolbar: {
        icon: 'paragraph',
        items: [
          { value: 'rtl', title: 'RTL' },
          { value: 'ltr', title: 'LTR' },
        ],
      },
    },
  },
  decorators: [
    (story, context) => {
      // تم را روی html ست کن
      const html = document.documentElement
      html.setAttribute('data-theme', context.globals.theme === 'dark' ? 'dark' : 'light') // uses themes/light.css & dark.css
      html.setAttribute('dir', context.globals.direction || 'rtl')

      return {
        components: { Story: story() as any },
        template: `<Story />`,
      }
    },
  ],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    backgrounds: {
      default: 'Surface',
      values: [
        { name: 'Surface', value: 'var(--color-surface)' },
        { name: 'Plain', value: 'var(--color-background)' },
      ],
    },
    options: { showPanel: true },
  },
}

export default preview
