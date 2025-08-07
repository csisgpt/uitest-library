import BaseIcon from './BaseIcon.vue';
import type { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'Components/BaseIcon',
  component: BaseIcon,
  argTypes: {
    name: { control: 'text' },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    color: { control: 'color' },
    ariaLabel: { control: 'text' },
  },
} satisfies Meta<typeof BaseIcon>;

const Template: StoryFn<typeof BaseIcon> = (args) => ({
  components: { BaseIcon },
  setup: () => ({ args }),
  template: '<BaseIcon v-bind="args" />',
});

export const Named = Template.bind({});
Named.args = {
  name: 'check',
  ariaLabel: 'Check icon',
};

export const CustomSvg = () => ({
  components: { BaseIcon },
  template: `
    <BaseIcon aria-label="Custom svg">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </BaseIcon>
  `,
});

export const Sizes = () => ({
  components: { BaseIcon },
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <BaseIcon name="check" size="sm" />
      <BaseIcon name="check" size="md" />
      <BaseIcon name="check" size="lg" />
    </div>
  `,
});

export const CustomColor = () => ({
  components: { BaseIcon },
  template: '<BaseIcon name="check" color="var(--color-primary)" />',
});

export const Accessible = Template.bind({});
Accessible.args = {
  name: 'close',
  ariaLabel: 'Close icon',
};
