import BaseModal from './BaseModal.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref } from 'vue'

export default {
  title: 'Components/BaseModal',
  component: BaseModal,
  argTypes: {
    modelValue: { control: 'boolean' },
    title: { control: 'text' },
    width: { control: 'text' },
    fullscreen: { control: 'boolean' },
    closable: { control: 'boolean' },
    persistent: { control: 'boolean' },
    hideOverlay: { control: 'boolean' }
  }
} satisfies Meta<typeof BaseModal>

const Template: StoryFn<typeof BaseModal> = (args) => ({
  components: { BaseModal },
  setup() {
    const open = ref(true)
    return { args, open }
  },
  template: `
    <BaseModal v-model="open" v-bind="args">
      <p>This is a modal.</p>
    </BaseModal>
  `
})

export const Default = Template.bind({})
Default.args = {
  modelValue: true,
  title: 'Default Modal'
}

export const LongContent = () => ({
  components: { BaseModal },
  setup() {
    const open = ref(true)
    return { open }
  },
  template: `
    <BaseModal v-model="open" title="Long Content">
      <p v-for="i in 20" :key="i">Line {{ i }}</p>
    </BaseModal>
  `
})

export const Fullscreen = Template.bind({})
Fullscreen.args = {
  modelValue: true,
  fullscreen: true,
  title: 'Fullscreen'
}

export const Persistent = Template.bind({})
Persistent.args = {
  modelValue: true,
  persistent: true,
  title: 'Persistent Modal'
}

export const WithoutOverlay = Template.bind({})
WithoutOverlay.args = {
  modelValue: true,
  hideOverlay: true,
  title: 'No Overlay'
}

export const CustomWidth = Template.bind({})
CustomWidth.args = {
  modelValue: true,
  width: '400px',
  title: 'Custom Width'
}

export const TitleNoClose = Template.bind({})
TitleNoClose.args = {
  modelValue: true,
  title: 'No Close Button',
  closable: false
}
