import BaseSwitch from './BaseSwitch.vue'
import type { Meta, StoryFn } from '@storybook/vue3'

export default {
  title: 'Components/BaseSwitch',
  component: BaseSwitch,
  argTypes: {
    modelValue: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    onText: { control: 'text' },
    offText: { control: 'text' },
    name: { control: 'text' },
    id: { control: 'text' },
    labelPosition: { control: { type: 'select' }, options: ['left', 'right'] },
  },
} satisfies Meta<typeof BaseSwitch>

const Template: StoryFn<typeof BaseSwitch> = (args) => ({
  components: { BaseSwitch },
  setup: () => ({ args }),
  template: '<BaseSwitch v-model="args.modelValue" v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {
  modelValue: false,
}

export const Checked = Template.bind({})
Checked.args = {
  modelValue: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  label: 'Toggle me',
}

export const LabelLeft = Template.bind({})
LabelLeft.args = {
  label: 'Label on left',
  labelPosition: 'left',
}

export const Sizes = () => ({
  components: { BaseSwitch },
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <BaseSwitch size="sm" />
      <BaseSwitch size="md" />
      <BaseSwitch size="lg" />
    </div>
  `,
})

export const WithText = Template.bind({})
WithText.args = {
  onText: 'On',
  offText: 'Off',
  modelValue: true,
}
