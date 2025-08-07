import RichTextEditor from './RichTextEditor.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof RichTextEditor> = {
  title: 'Form/RichTextEditor',
  component: RichTextEditor,
  argTypes: {
    content: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    theme: { control: 'radio', options: ['light', 'dark'] }
  },
  args: {
    content: '<p>Hello World</p>',
    disabled: false,
    readonly: false,
    theme: 'light'
  }
}
export default meta

 type Story = StoryObj<typeof RichTextEditor>

export const Default: Story = {
  render: (args) => ({
    components: { RichTextEditor },
    setup: () => ({ args }),
    template: `<div :data-theme="args.theme"><RichTextEditor v-bind="args" /></div>`
  })
}
