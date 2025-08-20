import type { Meta, StoryObj } from '@storybook/vue3'
import BaseDivider from './BaseDivider.vue';

/**
 * @title BaseDivider
 * @component BaseDivider
 * @description A versatile divider component that supports various styles and configurations.
 * 
 * ## Usage
 * You can use the `BaseDivider` component to create dividers with customizable colors, heights, margins, and transitions. 
 * It can also be configured to be disabled or have custom border radius.
 * 
 * ## Example
 * ```vue
 * <BaseDivider color="#ff6347" height="2px" margin="16px 0" />
 * ```
 */
const meta: Meta<typeof BaseDivider> = {
  title: 'Layout/BaseDivider/Guide',
  component: BaseDivider,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    backgrounds: {
      default: 'grid',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'gray',  value: '#f1f5f9' },
        { name: 'grid',  value: '#ffffff' },
      ]
    },
    docs: {
      description: {
        component:
`**BaseDivider** یک کامپوننت کاربردی برای ایجاد خطوط تقسیم‌کننده است که می‌تواند رنگ، ارتفاع، حاشیه‌ها و سایر ویژگی‌های آن را مطابق با نیاز شما تنظیم کند.

### قابلیت‌ها:
- \`color\`: رنگ دیوایدر، می‌توانید از هر رنگی استفاده کنید.
- \`height\`: ارتفاع دیوایدر، به‌صورت پیش‌فرض 1px است.
- \`margin\`: فاصله‌های بالایی و پایینی دیوایدر.
- \`hoverColor\`: رنگ دیوایدر هنگام هاور شدن، که به‌طور پیش‌فرض تغییر می‌کند.
- \`disabled\`: غیرفعال کردن دیوایدر که در این حالت، دیوایدر قابل کلیک نخواهد بود.
- \`transitionDuration\`: مدت زمانی که تغییرات رنگ و حاشیه‌ها به‌صورت نرم انجام می‌شوند.
- \`borderRadius\`: برای گرد کردن گوشه‌های دیوایدر.

### مثال سریع
\`\`\`vue
<template>
  <div style="display:flex; align-items:center;">
    <span>چپ</span>
    <BaseDivider color="#ff6347" height="2px" margin="16px 0" />
    <span>راست</span>
  </div>
</template>
\`\`\`
`
      }
    }
  },
  decorators: [
    () => ({
      template: `
        <div style="
          min-height: 100vh;
          padding: 28px;
          background:
            linear-gradient(transparent 23px, rgba(60,60,60,.05) 24px) 0 0/100% 24px,
            linear-gradient(90deg, transparent 23px, rgba(60,60,60,.05) 24px) 0 0/24px 100%,
            #fff;
        ">
          <story />
        </div>
      `
    })
  ]
}

export default meta;

type Story = StoryObj<typeof meta>;

// Template for the stories
const Template: Story = (args) => ({
  components: { BaseDivider },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px;">
      <h2>Section 1</h2>
      <BaseDivider v-bind="args" />
      <h2>Section 2</h2>
    </div>
  `,
});

// Default Divider
export const Default = Template.bind({});
Default.args = {
  color: '#e5e7eb',
  height: '1px',
  margin: 'var(--space-md) 0',
  hoverColor: '#fbbf24',
  disabled: false,
  transitionDuration: '300ms',
  borderRadius: 'var(--radius-sm)',
};

// Dark Mode Divider
export const DarkMode = Template.bind({});
DarkMode.args = {
  color: '#334155',
  height: '1px',
  margin: 'var(--space-md) 0',
  hoverColor: '#fbbf24',
  disabled: false,
  transitionDuration: '300ms',
  borderRadius: 'var(--radius-sm)',
};

// Disabled Divider
export const Disabled = Template.bind({});
Disabled.args = {
  color: '#e5e7eb',
  height: '1px',
  margin: 'var(--space-md) 0',
  hoverColor: '#fbbf24',
  disabled: true,
  transitionDuration: '300ms',
  borderRadius: 'var(--radius-sm)',
};

// Custom Height and Margin Divider
export const CustomHeightAndMargin = Template.bind({});
CustomHeightAndMargin.args = {
  color: '#ff6347',
  height: '2px',
  margin: 'var(--space-lg) 0',
  hoverColor: '#fbbf24',
  disabled: false,
  transitionDuration: '300ms',
  borderRadius: 'var(--radius-sm)',
};

// Hover Effect Divider
export const HoverEffect = Template.bind({});
HoverEffect.args = {
  color: '#e5e7eb',
  height: '1px',
  margin: 'var(--space-md) 0',
  hoverColor: '#fbbf24',
  disabled: false,
  transitionDuration: '300ms',
  borderRadius: 'var(--radius-sm)',
};

// Custom Border Radius Divider
export const CustomRadius = Template.bind({});
CustomRadius.args = {
  color: '#ff6347',
  height: '1px',
  margin: 'var(--space-md) 0',
  hoverColor: '#fbbf24',
  disabled: false,
  transitionDuration: '300ms',
  borderRadius: '12px',
};

// Multi-colored Divider
export const MultiColor = Template.bind({});
MultiColor.args = {
  color: '#1e8759', // green
  height: '2px',
  margin: 'var(--space-md) 0',
  hoverColor: '#ff6347', // hover red
  disabled: false,
  transitionDuration: '300ms',
  borderRadius: 'var(--radius-md)',
};
