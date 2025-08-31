import type { Meta, StoryObj } from '@storybook/vue3'
import { h, ref, defineComponent } from 'vue'
import { action } from 'storybook/actions'
import BaseTooltip from './BaseTooltip.vue' // مسیر خودت را ست کن

// یک دکمه‌ی کوچک برای Activator که با تم شما هماهنگه
const ActivatorButton = defineComponent({
  props: { label: { type: String, default: 'Hover me' } },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          style: {
            padding: 'var(--space-sm) var(--space-md)',
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-width) var(--border-style) var(--color-border)',
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            fontFamily: 'var(--font-family-base)',
            fontSize: 'var(--font-size-md)',
            cursor: 'pointer',
            transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
          },
          onMouseenter: (attrs as any)?.on?.mouseenter,
          onMouseleave: (attrs as any)?.on?.mouseleave,
          onClick: (attrs as any)?.on?.click,
          onFocus: (attrs as any)?.on?.focus,
          onBlur: (attrs as any)?.on?.blur,
        },
        slots.default ? slots.default() : props.label
      )
  },
})

const meta: Meta<typeof BaseTooltip> = {
  title: 'UI/BaseTooltip',
  component: BaseTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: 'var(--color-surface)' },
        { name: 'elevated', value: 'linear-gradient(180deg, var(--color-surface), var(--color-background))' },
        { name: 'dark-checker', value: '#111827' },
      ],
    },
    controls: { expanded: true },
    options: { showPanel: true },
  },
  argTypes: {
    text: { control: 'text' },
    position: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
    trigger: {
      control: 'inline-radio',
      options: ['hover', 'click', 'focus', 'manual'],
    },
    animation: {
      control: 'select',
      options: ['fade', 'scale', 'slide-up', 'slide-down', 'none'],
    },
    delay: { control: { type: 'number', min: 0, step: 50 } },
    hideDelay: { control: { type: 'number', min: 0, step: 50 } },
    offset: { control: { type: 'number', min: 0, step: 1 } },
    maxWidth: { control: 'text' },
    zIndex: { control: { type: 'number', min: 0, step: 1 } },
    disabled: { control: 'boolean' },
    persistent: { control: 'boolean' },
    interactive: { control: 'boolean' },
    flipOnOverflow: { control: 'boolean' },
    open: {
      control: 'boolean',
      if: { arg: 'trigger', eq: 'manual' },
    },
    onShow: { action: 'show' },
    onHide: { action: 'hide' },
  },
  decorators: [
    // قاب خوش‌استایل برای نمایش بهتر
    () => ({
      template: `
        <div style="
          padding: var(--space-xl);
          min-height: 320px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(1200px 400px at 80% -20%, rgba(0,0,0,0.05), transparent),
            radial-gradient(800px 300px at -10% 120%, rgba(0,0,0,0.05), transparent);
          border-radius: var(--radius-lg);
        ">
          <story />
        </div>
      `,
    }),
  ],
}
export default meta

type Story = StoryObj<typeof BaseTooltip>

export const Playground: Story = {
  name: 'Playground',
  args: {
    text: 'A delightful tooltip with theming ✨',
    position: 'top',
    trigger: 'hover',
    delay: 150,
    hideDelay: 60,
    animation: 'fade',
    offset: 8,
    interactive: false,
    flipOnOverflow: true,
  },
  render: (args) => ({
    components: { BaseTooltip, ActivatorButton },
    setup() {
      return { args, onShow: action('show'), onHide: action('hide') }
    },
    template: `
      <BaseTooltip v-bind="args" @show="onShow" @hide="onHide">
        <template #activator="{ on, attrs }">
          <ActivatorButton v-bind="attrs" :on="on" label="Hover me"/>
        </template>
      </BaseTooltip>
    `,
  }),
}

export const Positions: Story = {
  name: 'Positions',
  render: (args) => ({
    components: { BaseTooltip, ActivatorButton },
    setup() {
      const cfg = [
        { position: 'top', label: 'Top' },
        { position: 'right', label: 'Right' },
        { position: 'bottom', label: 'Bottom' },
        { position: 'left', label: 'Left' },
      ] as const
      return { args, cfg }
    },
    template: `
      <div style="display:grid; gap: var(--space-lg); grid-template-columns: repeat(2, minmax(160px, 1fr));">
        <div v-for="c in cfg" :key="c.position" style="display:grid; place-items:center; padding: var(--space-lg);">
          <BaseTooltip v-bind="args" :position="c.position" :text="c.label">
            <template #activator="{ on, attrs }">
              <ActivatorButton v-bind="attrs" :on="on" :label="c.label"/>
            </template>
          </BaseTooltip>
        </div>
      </div>
    `,
  }),
  args: { trigger: 'hover', animation: 'scale' },
}

export const Triggers: Story = {
  name: 'Triggers (hover/click/focus/manual)',
  render: () => ({
    components: { BaseTooltip, ActivatorButton },
    setup() {
      const manualOpen = ref(false)
      const toggle = () => (manualOpen.value = !manualOpen.value)
      return { manualOpen, toggle }
    },
    template: `
      <div style="display:grid; gap: var(--space-xl); grid-auto-rows: minmax(80px, auto);">
        <div style="display:flex; gap: var(--space-lg); justify-content:center; flex-wrap: wrap;">
          <BaseTooltip text="Hover trigger (default)">
            <template #activator="{ on, attrs }">
              <ActivatorButton v-bind="attrs" :on="on" label="Hover"/>
            </template>
          </BaseTooltip>

          <BaseTooltip text="Click to toggle" trigger="click" animation="scale">
            <template #activator="{ on, attrs }">
              <ActivatorButton v-bind="attrs" :on="on" label="Click"/>
            </template>
          </BaseTooltip>

          <BaseTooltip text="Focus to show" trigger="focus" animation="slide-up">
            <template #activator="{ on, attrs }">
              <ActivatorButton v-bind="attrs" :on="on" label="Focus (Tab)"/>
            </template>
          </BaseTooltip>
        </div>

        <div style="display:flex; gap: var(--space-lg); justify-content:center; flex-wrap: wrap;">
          <BaseTooltip text="Manual control" trigger="manual" :open="manualOpen">
            <template #activator="{ attrs }">
              <ActivatorButton v-bind="attrs" @click="toggle" :label="manualOpen ? 'Hide' : 'Show'"/>
            </template>
          </BaseTooltip>
        </div>
      </div>
    `,
  }),
}

export const Animations: Story = {
  name: 'Animations',
  render: () => ({
    components: { BaseTooltip, ActivatorButton },
    template: `
      <div style="display:flex; gap: var(--space-lg); justify-content:center; flex-wrap: wrap;">
        <BaseTooltip text="fade" animation="fade">
          <template #activator="{ on, attrs }">
            <ActivatorButton v-bind="attrs" :on="on" label="fade"/>
          </template>
        </BaseTooltip>

        <BaseTooltip text="scale" animation="scale">
          <template #activator="{ on, attrs }">
            <ActivatorButton v-bind="attrs" :on="on" label="scale"/>
          </template>
        </BaseTooltip>

        <BaseTooltip text="slide-up" animation="slide-up">
          <template #activator="{ on, attrs }">
            <ActivatorButton v-bind="attrs" :on="on" label="slide-up"/>
          </template>
        </BaseTooltip>

        <BaseTooltip text="slide-down" animation="slide-down">
          <template #activator="{ on, attrs }">
            <ActivatorButton v-bind="attrs" :on="on" label="slide-down"/>
          </template>
        </BaseTooltip>

        <BaseTooltip text="none" animation="none">
          <template #activator="{ on, attrs }">
            <ActivatorButton v-bind="attrs" :on="on" label="none"/>
          </template>
        </BaseTooltip>
      </div>
    `,
  }),
}

export const InteractiveContent: Story = {
  name: 'Interactive content (links, buttons)',
  render: () => ({
    components: { BaseTooltip, ActivatorButton },
    template: `
      <BaseTooltip interactive :position="'right'" :offset="10">
        <template #activator="{ on, attrs }">
          <ActivatorButton v-bind="attrs" :on="on" label="Open menu"/>
        </template>

        <div style="display:flex; flex-direction:column; gap: var(--space-sm); min-width: 200px;">
          <strong style="font-size: var(--font-size-sm); color: var(--color-text);">Quick actions</strong>
          <a href="#" style="color: var(--color-primary); text-decoration: none;">Open</a>
          <a href="#" style="color: var(--color-primary); text-decoration: none;">Duplicate</a>
          <button style="
            padding: var(--space-xs) var(--space-sm);
            border-radius: var(--radius-sm);
            border: var(--border-width) var(--border-style) var(--color-border);
            background: var(--color-danger);
            color: var(--color-on-danger);
            cursor: pointer;">Delete</button>
        </div>
      </BaseTooltip>
    `,
  }),
  args: { animation: 'scale' },
}

export const DelayAndMaxWidth: Story = {
  name: 'Delay & Max width',
  args: {
    text: 'This is a very long tooltip message that demonstrates the max width and word wrapping. You can pass maxWidth="18rem" or any CSS length, even clamp().',
    delay: 250,
    hideDelay: 120,
    maxWidth: '18rem',
    position: 'bottom',
    animation: 'fade',
  },
  render: (args) => ({
    components: { BaseTooltip, ActivatorButton },
    setup: () => ({ args }),
    template: `
      <BaseTooltip v-bind="args">
        <template #activator="{ on, attrs }">
          <ActivatorButton v-bind="attrs" :on="on" label="Hover for longer text"/>
        </template>
      </BaseTooltip>
    `,
  }),
}

export const FlipOnOverflow: Story = {
  name: 'Flip on viewport overflow',
  args: {
    text: 'Will flip if there is no space',
    position: 'top',
    animation: 'fade',
    flipOnOverflow: true,
  },
  render: (args) => ({
    components: { BaseTooltip, ActivatorButton },
    setup: () => ({ args }),
    template: `
      <div style="width: 100%; display:flex; justify-content:flex-end;">
        <div style="margin-right: 8px;">
          <BaseTooltip v-bind="args">
            <template #activator="{ on, attrs }">
              <ActivatorButton v-bind="attrs" :on="on" label="Near edge"/>
            </template>
          </BaseTooltip>
        </div>
      </div>
    `,
  }),
}

export const DisabledAndPersistent: Story = {
  name: 'Disabled & Persistent',
  render: () => ({
    components: { BaseTooltip, ActivatorButton },
    template: `
      <div style="display:flex; gap: var(--space-xl);">
        <BaseTooltip text="I am disabled" :disabled="true">
          <template #activator="{ on, attrs }">
            <ActivatorButton v-bind="attrs" :on="on" label="Disabled"/>
          </template>
        </BaseTooltip>

        <BaseTooltip text="I won't auto hide" :persistent="true" trigger="click">
          <template #activator="{ on, attrs }">
            <ActivatorButton v-bind="attrs" :on="on" label="Persistent (click)"/>
          </template>
        </BaseTooltip>
      </div>
    `,
  }),
}

export const InsideScrollable: Story = {
  name: 'Inside scrollable parent',
  render: () => ({
    components: { BaseTooltip, ActivatorButton },
    template: `
      <div style="width: 480px; height: 180px; overflow:auto; border: var(--border-width) var(--border-style) var(--color-border); padding: var(--space-lg); border-radius: var(--radius-md);">
        <div style="height: 480px; display:flex; align-items:flex-end; justify-content:center;">
          <BaseTooltip text="Scroll container test" position="top">
            <template #activator="{ on, attrs }">
              <ActivatorButton v-bind="attrs" :on="on" label="Scroll to edge"/>
            </template>
          </BaseTooltip>
        </div>
      </div>
    `,
  }),
}
