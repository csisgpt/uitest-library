import BaseLabel from './BaseLabel.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof BaseLabel> = {
  title: 'Form/BaseLabel',
  component: BaseLabel,
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    align: { control: { type: 'select' }, options: ['left', 'right'] },
    required: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
  args: {
    for: 'field',
    text: 'Label',
    required: false,
    error: false,
    hint: '',
    disabled: false,
    size: 'md',
    align: 'left'
  }
}

export default meta

type Story = StoryObj<typeof BaseLabel>

export const Default: Story = {}

export const Required: Story = {
  args: { required: true, text: 'Required field' }
}

export const Error: Story = {
  args: { error: true, text: 'Error label' }
}

export const WithHint: Story = {
  args: { hint: 'Helpful information', text: 'Label with hint' }
}

export const RightAligned: Story = {
  args: { align: 'right', text: 'Right aligned' }
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseLabel },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <BaseLabel v-bind="args" size="sm" text="Small" for="small" />
        <BaseLabel v-bind="args" size="md" text="Medium" for="medium" />
        <BaseLabel v-bind="args" size="lg" text="Large" for="large" />
      </div>
    `
  })
}
