import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import BaseSelect from './BaseSelect.vue'

const baseOptions = [
  { label: 'Option One', value: 'one' },
  { label: 'Option Two', value: 'two' },
  { label: 'Option Three', value: 'three' },
]

const meta: Meta<typeof BaseSelect> = {
  title: 'Form/BaseSelect',
  component: BaseSelect,
  args: {
    modelValue: null,
    options: baseOptions,
    placeholder: 'Select option',
  },
}
export default meta

type Story = StoryObj<typeof BaseSelect>

const Template = (args: any) => ({
  components: { BaseSelect },
  setup() {
    const value = ref(args.modelValue)
    return { args, value }
  },
  template: `<BaseSelect v-model="value" v-bind="args" />`,
})

export const Default: Story = { render: Template }

export const WithLabel: Story = {
  render: Template,
  args: {
    label: 'Choose option',
    placeholder: 'Please select',
  },
}

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
    label: 'Disabled',
    placeholder: 'Disabled',
  },
}

export const ErrorAndHint: Story = {
  render: Template,
  args: {
    label: 'With error',
    error: 'Selection required',
    hint: 'Please choose an option',
  },
}

export const Searchable: Story = {
  render: Template,
  args: {
    label: 'Searchable',
    searchable: true,
  },
}

export const Clearable: Story = {
  render: Template,
  args: {
    label: 'Clearable',
    clearable: true,
    modelValue: 'two',
  },
}

export const Loading: Story = {
  render: Template,
  args: {
    label: 'Loading',
    loading: true,
    placeholder: 'Loading...',
  },
}

export const LargeList: Story = {
  render: Template,
  args: {
    label: 'Many options',
    options: Array.from({ length: 50 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: i + 1,
    })),
  },
}

export const KeyboardNavigation: Story = {
  render: Template,
  args: {
    label: 'Use arrow keys',
    searchable: true,
  },
}

export const DarkTheme: Story = {
  render: (args) => ({
    components: { BaseSelect },
    setup() {
      const value = ref(null)
      return { args, value }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <BaseSelect v-model="value" v-bind="args" label="Light theme" />
        <div data-theme="dark" style="padding:1rem;">
          <BaseSelect v-model="value" v-bind="args" label="Dark theme" />
        </div>
      </div>
    `,
  }),
}
