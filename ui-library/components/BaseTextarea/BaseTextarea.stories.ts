import BaseTextarea from './BaseTextarea.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof BaseTextarea> = {
  title: 'Form/BaseTextarea',
  component: BaseTextarea,
  argTypes: {
    modelValue: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    rows: { control: 'number' },
    maxLength: { control: 'number' },
    resize: { control: 'select', options: ['none', 'both', 'horizontal', 'vertical'] },
    autoResize: { control: 'boolean' },
    error: { control: 'text' },
    hint: { control: 'text' },
    name: { control: 'text' },
    id: { control: 'text' }
  },
  args: {
    modelValue: '',
    rows: 3,
    resize: 'vertical'
  }
}
export default meta

type Story = StoryObj<typeof BaseTextarea>

export const Default: Story = {}

export const WithLabelAndPlaceholder: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message...'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
    modelValue: 'Cannot edit'
  }
}

export const Readonly: Story = {
  args: {
    readonly: true,
    label: 'Readonly',
    modelValue: 'Read only text'
  }
}

export const WithHintAndError: Story = {
  args: {
    label: 'Feedback',
    hint: 'Let us know what you think',
    error: 'This field is required'
  }
}

export const WithMaxLength: Story = {
  args: {
    label: 'Limited',
    maxLength: 100,
    hint: 'Max 100 characters'
  }
}

export const AutoResize: Story = {
  args: {
    label: 'Auto resize',
    autoResize: true,
    modelValue: 'Start typing...'
  }
}

export const CustomRows: Story = {
  args: {
    label: 'Five rows',
    rows: 5
  }
}

export const Themed: Story = {
  render: (args) => ({
    components: { BaseTextarea },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 1rem;">
        <div data-theme="light"><BaseTextarea v-bind="args" label="Light" placeholder="Light theme" /></div>
        <div data-theme="dark"><BaseTextarea v-bind="args" label="Dark" placeholder="Dark theme" /></div>
      </div>
    `
  })
}
