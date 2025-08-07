import { ref, watch } from 'vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import BaseRadio from './BaseRadio.vue'

const meta: Meta<typeof BaseRadio> = {
  title: 'Form/BaseRadio',
  component: BaseRadio,
  args: {
    modelValue: '',
    value: 'option1',
    label: 'Option 1',
    name: 'example',
    disabled: false,
    error: false,
    required: false,
    inline: false,
    ariaLabel: 'Option',
    size: 'md'
  },
  argTypes: {
    modelValue: { control: 'text' },
    value: { control: 'text' },
    label: { control: 'text' },
    name: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    inline: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    size: { control: { type: 'select', options: ['sm', 'md', 'lg'] } }
  },
  decorators: [
    () => ({ template: '<div style="padding:2rem"><story /></div>' })
  ],
  parameters: {
    layout: 'centered',
    controls: { expanded: true }
  }
}
export default meta

const Template: StoryFn<typeof BaseRadio> = (args) => ({
  components: { BaseRadio },
  setup() {
    const val = ref(args.modelValue)
    watch(() => args.modelValue, (v) => (val.value = v))
    return { args, val }
  },
  template: '<BaseRadio v-bind="args" v-model="val" />'
})

export const Default = Template.bind({})
Default.parameters = {
  docs: { description: { story: 'Unselected radio button.' } }
}

export const Checked = Template.bind({})
Checked.args = { modelValue: 'option1' }
Checked.parameters = {
  docs: { description: { story: 'Radio starts checked via v-model.' } }
}

export const Disabled = Template.bind({})
Disabled.args = { disabled: true }
Disabled.parameters = {
  docs: { description: { story: 'User cannot interact with disabled radio.' } }
}

export const Error = Template.bind({})
Error.args = { error: true, label: 'Error state' }
Error.parameters = {
  docs: { description: { story: 'Shows error styling.' } }
}

export const WithLabel = Template.bind({})
WithLabel.args = { label: 'Labeled radio' }
WithLabel.parameters = {
  docs: { description: { story: 'Radio with visible label.' } }
}

export const WithoutLabel = Template.bind({})
WithoutLabel.args = { label: '', ariaLabel: 'No label radio' }
WithoutLabel.parameters = {
  docs: { description: { story: 'Accessible using aria-label when no label text.' } }
}

export const InlineGroup: StoryFn<typeof BaseRadio> = (args) => ({
  components: { BaseRadio },
  setup() {
    const val = ref('one')
    return { args, val }
  },
  template: `
    <div style="display:flex; gap:1rem;">
      <BaseRadio v-bind="args" v-model="val" value="one" label="One" inline name="inline" />
      <BaseRadio v-bind="args" v-model="val" value="two" label="Two" inline name="inline" />
      <BaseRadio v-bind="args" v-model="val" value="three" label="Three" inline name="inline" />
    </div>
  `
})
InlineGroup.storyName = 'Inline radios in group'
InlineGroup.parameters = {
  docs: { description: { story: 'Multiple radios displayed horizontally.' } }
}

export const Sizes: StoryFn<typeof BaseRadio> = (args) => ({
  components: { BaseRadio },
  setup() {
    const val = ref('md')
    return { args, val }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:1rem;">
      <BaseRadio v-bind="args" v-model="val" value="sm" label="Small" size="sm" />
      <BaseRadio v-bind="args" v-model="val" value="md" label="Medium" size="md" />
      <BaseRadio v-bind="args" v-model="val" value="lg" label="Large" size="lg" />
    </div>
  `
})
Sizes.storyName = 'Custom size (sm / md / lg)'
Sizes.parameters = {
  docs: { description: { story: 'Demonstrates all size options.' } }
}

export const KeyboardAccessible = Template.bind({})
KeyboardAccessible.parameters = {
  docs: { description: { story: 'Focusable and toggled via keyboard (Tab + Space/Enter).' } }
}

export const RequiredField = Template.bind({})
RequiredField.args = { required: true, label: 'Required choice' }
RequiredField.parameters = {
  docs: { description: { story: 'Adds required indicator to the label.' } }
}
