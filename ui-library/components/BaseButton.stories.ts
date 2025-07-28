import type { Meta, StoryObj } from '@storybook/vue3';
import BaseButton from './BaseButton.vue';

const meta: Meta<typeof BaseButton> = {
  title: 'Base/BaseButton',
  component: BaseButton,
};

export default meta;

type Story = StoryObj<typeof BaseButton>;

export const Primary: Story = {
  render: () => ({
    components: { BaseButton },
    template: '<BaseButton>Click me</BaseButton>',
  }),
};
