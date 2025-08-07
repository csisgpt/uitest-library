import BaseToggleButton from './BaseToggleButton.vue'
import type { Meta, StoryFn } from '@storybook/vue3'

export default {
  title: 'Components/BaseToggleButton',
  component: BaseToggleButton,
  argTypes: {
    modelValue: { control: 'boolean' },
    onLabel: { control: 'text' },
    offLabel: { control: 'text' },
    onIcon: { control: 'text' },
    offIcon: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    variant: { control: { type: 'select' }, options: ['solid', 'outline', 'ghost'] },
    color: {
      control: { type: 'select' },
      options: ['primary', 'success', 'error', 'info', 'warning']
    }
  }
} satisfies Meta<typeof BaseToggleButton>

const Template: StoryFn<typeof BaseToggleButton> = (args) => ({
  components: { BaseToggleButton },
  setup: () => ({ args }),
  template: '<BaseToggleButton v-model="args.modelValue" v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  modelValue: false,
  onLabel: 'On',
  offLabel: 'Off'
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true
}

export const Variants = () => ({
  components: { BaseToggleButton },
  template: `
    <div style="display: flex; gap: 1rem;">
      <BaseToggleButton variant="solid" />
      <BaseToggleButton variant="outline" />
      <BaseToggleButton variant="ghost" />
    </div>
  `
})

export const Sizes = () => ({
  components: { BaseToggleButton },
  template: `
    <div style="display: flex; gap: 1rem;">
      <BaseToggleButton size="sm" />
      <BaseToggleButton size="md" />
      <BaseToggleButton size="lg" />
    </div>
  `
})

export const WithCustomSlots = () => ({
  components: { BaseToggleButton },
  template: `
    <BaseToggleButton>
      <template #on>
        <span style="display: flex; align-items: center; gap: 0.25rem;">
          <i class="pi pi-check"></i> Active
        </span>
      </template>
      <template #off>
        <span style="display: flex; align-items: center; gap: 0.25rem;">
          <i class="pi pi-times"></i> Inactive
        </span>
      </template>
    </BaseToggleButton>
  `
})
