import BaseInput from './BaseInput.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof BaseInput> = {
  title: 'Form/BaseInput',
  component: BaseInput,
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'یک ورودی مینیمال و تم‌پذیر با پشتیبانی RTL/LTR، آیکن‌ها، حالت‌های خطا/موفق، clearable، لودینگ و تاگل پسورد.',
      },
    },
  },
  argTypes: {
    // values
    modelValue: { control: 'text', description: 'v-model مقدار' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'error', 'success', 'warning', 'info'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    dir: {
      control: 'radio',
      options: ['auto', 'rtl', 'ltr'],
    },

    // booleans
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    rounded: { control: 'boolean' },
    loading: { control: 'boolean' },
    showPasswordToggle: { control: 'boolean' },

    // misc
    name: { control: 'text' },
    id: { control: 'text' },
    autocomplete: { control: 'text' },

    // events
    'onUpdate:modelValue': { action: 'update:modelValue' },
    onClear: { action: 'clear' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' },

    // اسلات‌ها را از کنترل خارج می‌کنیم
    iconLeft: { control: false },
    iconRight: { control: false },
    errorMessage: { control: 'text' },
    successMessage: { control: 'text' },
    hint: { control: 'text' },
  },
  args: {
    modelValue: '',
    label: 'Label',
    placeholder: 'Placeholder',
    variant: 'outline',
    size: 'md',
    type: 'text',
    clearable: false,
    disabled: false,
    readonly: false,
    fullWidth: false,
    rounded: false,
    loading: false,
    dir: 'auto',
    showPasswordToggle: true,
    hint: '',
    errorMessage: '',
    successMessage: '',
  },
  decorators: [
    // کانتینر استاندارد با عرض منطقی
    () => ({
      template: `<div style="max-width:420px; width:100%"><story /></div>`,
    }),
  ],
}
export default meta

type Story = StoryObj<typeof BaseInput>

// ———————————————————————————————————————————————————————
// سناریوهای اصلی

export const Playground: Story = {
  name: 'Playground (با کنترل‌ها)',
}

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
  },
}

export const Variants: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup: () => ({ args, variants: ['primary','secondary','outline','ghost','error','success','warning','info'] }),
    template: `
      <div style="display:grid; gap:12px">
        <BaseInput
          v-for="v in variants" :key="v"
          v-bind="args"
          :variant="v"
          :label="v[0].toUpperCase()+v.slice(1)"
          placeholder="Placeholder"
          clearable
        />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup: () => ({ args }),
    template: `
      <div style="display:grid; gap:12px">
        <BaseInput v-bind="args" size="sm" label="Small" placeholder="Small input" />
        <BaseInput v-bind="args" size="md" label="Medium" placeholder="Medium input" />
        <BaseInput v-bind="args" size="lg" label="Large" placeholder="Large input" />
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup: () => ({ args }),
    template: `
      <BaseInput v-bind="args" label="With icons" placeholder="Search..." clearable>
        <template #icon-left>🔍</template>
        <template #icon-right>✔️</template>
      </BaseInput>
    `,
  }),
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    showPasswordToggle: true,
    clearable: true,
  },
}

export const NumberInput: Story = {
  args: {
    label: 'Price',
    type: 'number',
    placeholder: 'e.g. 1499',
    clearable: true,
  },
  render: (args) => ({
    components: { BaseInput },
    setup: () => ({ args }),
    template: `
      <!-- step/min/max و inputmode روی input اعمال می‌شن -->
      <BaseInput
        v-bind="args"
        inputmode="decimal"
        step="0.01"
        min="0"
      />
    `,
  }),
}

export const States: Story = {
  name: 'States (Disabled / Readonly / Loading)',
  render: (args) => ({
    components: { BaseInput },
    setup: () => ({ args }),
    template: `
      <div style="display:grid; gap:12px">
        <BaseInput v-bind="args" label="Disabled" placeholder="Cannot type" disabled />
        <BaseInput v-bind="args" label="Readonly" model-value="Read-only value" readonly />
        <BaseInput v-bind="args" label="Loading" placeholder="Fetching..." loading />
      </div>
    `,
  }),
}

export const Validation: Story = {
  render: () => ({
    components: { BaseInput },
    template: `
      <div style="display:grid; gap:12px">
        <BaseInput label="Success" model-value="Valid input" success-message="Looks good!" />
        <BaseInput label="Error" model-value="Wrong input" error-message="This is invalid" />
        <BaseInput label="Hint" model-value="" hint="Helper text to guide the user." />
      </div>
    `,
  }),
}

export const RTL: Story = {
  name: 'RTL (فارسی)',
  args: {
    label: 'نام کاربری',
    placeholder: 'نام کاربری را وارد کنید',
    dir: 'rtl',
    clearable: true,
  },
}

export const FullWidthInForm: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup: () => ({ args }),
    template: `
      <form style="display:grid; gap:12px; max-width:560px">
        <BaseInput v-bind="args" label="Full name" full-width placeholder="John Doe" />
        <BaseInput v-bind="args" label="Email" type="email" full-width placeholder="name@email.com" />
        <BaseInput v-bind="args" label="Password" type="password" full-width placeholder="••••••••" show-password-toggle />
      </form>
    `,
  }),
}
