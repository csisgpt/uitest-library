import BaseTooltip from './BaseTooltip.vue'
import BaseButton from './BaseButton.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref } from 'vue'

export default {
  title: 'Components/BaseTooltip',
  component: BaseTooltip,
  argTypes: {
    position: { control: { type: 'select' }, options: ['top', 'bottom', 'left', 'right'] },
    trigger: { control: { type: 'select' }, options: ['hover', 'click', 'focus', 'manual'] },
    animation: { control: { type: 'select' }, options: ['fade', 'scale', 'slide-up', 'slide-down', 'none'] },
    delay: { control: 'number' },
    persistent: { control: 'boolean' },
    disabled: { control: 'boolean' },
    offset: { control: 'number' },
    closeOnClickOutside: { control: 'boolean' },
  },
} satisfies Meta<typeof BaseTooltip>

const Template: StoryFn<typeof BaseTooltip> = (args) => ({
  components: { BaseTooltip },
  setup: () => ({ args }),
  template: `
    <BaseTooltip v-bind="args">
      <template #activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">Hover me</span>
      </template>
    </BaseTooltip>
  `,
})

export const Default = Template.bind({})
Default.args = {
  text: 'Tooltip text',
}

export const ClickTrigger = Template.bind({})
ClickTrigger.args = {
  text: 'Click tooltip',
  trigger: 'click',
}

export const FocusTrigger = Template.bind({})
FocusTrigger.args = {
  text: 'Focus tooltip',
  trigger: 'focus',
}

export const WithBaseButtonActivator: StoryFn<typeof BaseTooltip> = (args) => ({
  components: { BaseTooltip, BaseButton },
  setup: () => ({ args }),
  template: `
    <BaseTooltip v-bind="args">
      <template #activator="{ on, attrs }">
        <BaseButton v-bind="attrs" v-on="on">Hover me</BaseButton>
      </template>
    </BaseTooltip>
  `,
})
WithBaseButtonActivator.args = {
  text: 'Using BaseButton',
}

export const CustomContent: StoryFn<typeof BaseTooltip> = (args) => ({
  components: { BaseTooltip, BaseButton },
  setup: () => ({ args }),
  template: `
    <BaseTooltip v-bind="args">
      <template #activator="{ on, attrs }">
        <BaseButton v-bind="attrs" v-on="on">Hover me</BaseButton>
      </template>
      <template #default>
        <strong>Custom</strong> slot content
      </template>
    </BaseTooltip>
  `,
})
CustomContent.args = {
  text: 'Ignored',
}

export const Manual = () => ({
  components: { BaseTooltip, BaseButton },
  setup() {
    const open = ref(false)
    return { open }
  },
  template: `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <BaseButton @click="open = !open">Toggle Tooltip</BaseButton>
      <BaseTooltip :open="open" trigger="manual" text="Manual tooltip">
        <template #activator="{ attrs }">
          <BaseButton icon v-bind="attrs">i</BaseButton>
        </template>
      </BaseTooltip>
    </div>
  `,
})

export const Positions = () => ({
  components: { BaseTooltip, BaseButton },
  template: `
    <div style="display: flex; gap: 2rem;">
      <BaseTooltip text="Top" position="top">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">Top</BaseButton>
        </template>
      </BaseTooltip>
      <BaseTooltip text="Right" position="right">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">Right</BaseButton>
        </template>
      </BaseTooltip>
      <BaseTooltip text="Bottom" position="bottom">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">Bottom</BaseButton>
        </template>
      </BaseTooltip>
      <BaseTooltip text="Left" position="left">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">Left</BaseButton>
        </template>
      </BaseTooltip>
    </div>
  `,
})

export const Animations = () => ({
  components: { BaseTooltip, BaseButton },
  template: `
    <div style="display: flex; gap: 1rem;">
      <BaseTooltip text="Fade" animation="fade">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">Fade</BaseButton>
        </template>
      </BaseTooltip>
      <BaseTooltip text="Scale" animation="scale">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">Scale</BaseButton>
        </template>
      </BaseTooltip>
      <BaseTooltip text="Slide Up" animation="slide-up">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">Slide Up</BaseButton>
        </template>
      </BaseTooltip>
      <BaseTooltip text="Slide Down" animation="slide-down">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">Slide Down</BaseButton>
        </template>
      </BaseTooltip>
      <BaseTooltip text="None" animation="none">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">None</BaseButton>
        </template>
      </BaseTooltip>
    </div>
  `,
})

export const WithDelay = Template.bind({})
WithDelay.args = {
  text: 'Delayed tooltip',
  delay: 500,
}

export const Persistent = Template.bind({})
Persistent.args = {
  text: 'Persistent tooltip',
  persistent: true,
  trigger: 'click',
}

export const DarkTheme = () => ({
  components: { BaseTooltip, BaseButton },
  template: `
    <div data-theme="dark" style="padding: 2rem; background: var(--color-surface);">
      <BaseTooltip text="Dark theme tooltip">
        <template #activator="{ on, attrs }">
          <BaseButton v-bind="attrs" v-on="on">Hover me</BaseButton>
        </template>
      </BaseTooltip>
    </div>
  `,
})
