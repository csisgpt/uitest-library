import RichTextEditor from './RichTextEditor.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof RichTextEditor> = {
  title: 'Form/RichTextEditor',
  component: RichTextEditor,
  argTypes: {
    content: { control: 'text' },
    placeholder: { control: 'text' },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    theme: { control: 'select', options: ['light', 'dark'] },
  },
  args: {
    content: '',
    placeholder: 'Start typing...',
    readonly: false,
    disabled: false,
    theme: 'light',
  }
}
export default meta

type Story = StoryObj<typeof RichTextEditor>

export const Default: Story = {
  render: (args) => ({
    components: { RichTextEditor },
    setup() { return { args } },
    template: `<div :data-theme="args.theme" style="max-width: 600px;">
      <RichTextEditor v-model:content="args.content" :placeholder="args.placeholder" :readonly="args.readonly" :disabled="args.disabled" />
    </div>`
  })
}

export const Mobile: Story = {
  ...Default,
  parameters: { viewport: { defaultViewport: 'mobile1' } }
}
