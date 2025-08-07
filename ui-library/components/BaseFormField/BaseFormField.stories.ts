import BaseFormField from './BaseFormField.vue'
import BaseInput from '../BaseInput/BaseInput.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof BaseFormField> = {
  title: 'Form/BaseFormField',
  component: BaseFormField,
  args: {
    label: 'Label',
    for: 'field',
    size: 'md'
  }
}

export default meta

type Story = StoryObj<typeof BaseFormField>

export const Default: Story = {
  render: (args) => ({
    components: { BaseFormField, BaseInput },
    setup: () => ({ args }),
    template: `
      <BaseFormField v-bind="args">
        <BaseInput id="field" />
      </BaseFormField>
    `
  })
}

export const Required: Story = {
  render: (args) => ({
    components: { BaseFormField, BaseInput },
    setup: () => ({ args }),
    template: `
      <BaseFormField v-bind="args" required>
        <BaseInput id="field" />
      </BaseFormField>
    `
  })
}

export const WithError: Story = {
  render: (args) => ({
    components: { BaseFormField, BaseInput },
    setup: () => ({ args }),
    template: `
      <BaseFormField v-bind="args" error error-message="This field is required">
        <BaseInput id="field" />
      </BaseFormField>
    `
  })
}

export const WithHint: Story = {
  render: (args) => ({
    components: { BaseFormField, BaseInput },
    setup: () => ({ args }),
    template: `
      <BaseFormField v-bind="args" hint="Enter your name">
        <BaseInput id="field" />
      </BaseFormField>
    `
  })
}

export const Inline: Story = {
  render: (args) => ({
    components: { BaseFormField, BaseInput },
    setup: () => ({ args }),
    template: `
      <BaseFormField v-bind="args" inline>
        <BaseInput id="field" />
      </BaseFormField>
    `
  })
}

export const Disabled: Story = {
  render: (args) => ({
    components: { BaseFormField, BaseInput },
    setup: () => ({ args }),
    template: `
      <BaseFormField v-bind="args" disabled>
        <BaseInput id="field" disabled />
      </BaseFormField>
    `
  })
}
