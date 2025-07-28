import BaseInput from './BaseInput.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof BaseInput> = {
  title: 'Form/BaseInput',
  component: BaseInput,
  argTypes: {
    modelValue: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'error', 'success', 'warning', 'info']
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg']
    },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    rounded: { control: 'boolean' },
    iconLeft: { control: false },
    iconRight: { control: false },
    loading: { control: false }
  },
  args: {
    modelValue: '',
    label: 'Username',
    placeholder: 'Enter username',
    variant: 'primary',
    size: 'md',
    clearable: false,
    disabled: false,
    readonly: false,
    fullWidth: false,
    rounded: false
  }
}
export default meta

type Story = StoryObj<typeof BaseInput>

export const Default: Story = {}

export const AllVariants: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem">
        <BaseInput v-for="variant in ['primary', 'secondary', 'outline', 'ghost', 'error', 'success', 'warning', 'info']"
                   v-bind="args"
                   :key="variant"
                   :variant="variant"
                   :label="variant.charAt(0).toUpperCase() + variant.slice(1)"
                   placeholder="Placeholder" />
      </div>
    `
  })
}

export const AllSizes: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem">
        <BaseInput v-bind="args" size="sm" label="Small" placeholder="Small input" />
        <BaseInput v-bind="args" size="md" label="Medium" placeholder="Medium input" />
        <BaseInput v-bind="args" size="lg" label="Large" placeholder="Large input" />
      </div>
    `
  })
}

export const WithIcons: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup() {
      return { args }
    },
    template: `
      <BaseInput
        v-bind="args"
        label="With icons"
        placeholder="With icons"
        clearable
      >
        <template #icon-left>🔍</template>
        <template #icon-right>✔️</template>
      </BaseInput>
    `
  })
}

export const Clearable: Story = {
  args: {
    clearable: true,
    label: 'Clearable input',
    placeholder: 'Type something...'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
    placeholder: 'Cannot type'
  }
}

export const Readonly: Story = {
  args: {
    readonly: true,
    label: 'Readonly',
    modelValue: 'Read-only value'
  }
}

export const SuccessAndError: Story = {
  render: () => ({
    components: { BaseInput },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem">
        <BaseInput label="Success" model-value="Valid input" success-message="Looks good!" />
        <BaseInput label="Error" model-value="Wrong input" error-message="This is invalid" />
      </div>
    `
  })
}
