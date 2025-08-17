import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, ref, watch, reactive, computed } from 'vue'
import BaseSegment from './BaseSegment.vue'

/* ---------- Style helper for colors (works even if component has no inline vars) ---------- */
function styleFor(variant: string = 'primary', mode: 'ios'|'md' = 'ios') {
  const accentMap: Record<string, string> = {
    default:  'var(--color-primary)',
    primary:  'var(--color-primary)',
    secondary:'var(--color-secondary)',
    tertiary: 'var(--color-tertiary, var(--color-info))',
    success:  'var(--color-success)',
    warning:  'var(--color-warning)',
    info:     'var(--color-info)',
    error:    'var(--color-error)',
    danger:   'var(--color-error)',   // alias
    light:    'var(--color-text)',
    medium:   'var(--color-text)',
    dark:     'var(--color-text)',
    outline:  'var(--color-primary)',
    ghost:    'var(--color-primary)',
  }
  const tintPct: Record<string, number> = {
    default:6, light:3, medium:8, dark:14,
    primary:14, secondary:12, tertiary:12, success:12, warning:12, info:12, error:12, danger:12,
    outline:6, ghost:6,
  }
  const accent = accentMap[variant] ?? 'var(--color-primary)'
  const pct = tintPct[variant] ?? 6

  return {
    '--seg-accent': accent,
    '--seg-track-bg': mode === 'md'
      ? 'transparent'
      : (variant === 'outline' || variant === 'ghost'
          ? 'color-mix(in srgb, var(--color-text) 6%, var(--color-surface))'
          : `color-mix(in srgb, ${accent} ${pct}%, var(--color-surface))`)
  } as Record<string,string>
}

const meta: Meta<typeof BaseSegment> = {
  title: 'Inputs/Segment',
  component: BaseSegment,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Segment (iOS/MD) با indicator هوشمند (thumb/underline)، پشتیبانی single/multiple، آیکن، اسکرول، و تمینگ کامل با CSS Variables.'
      }
    },
    options: { showPanel: true },
    layout: 'centered'
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['pill', 'rounded'] },
    variant: {
      control: 'select',
      options: [
        'default',
        'primary','secondary','tertiary',
        'success','warning','info','error','danger',
        'light','medium','dark',
        'outline','ghost'
      ]
    },
    mode: { control: 'inline-radio', options: ['ios', 'md'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    multiple: { control: 'boolean' },
    scrollable: { control: 'boolean' },
    items: { control: 'object' },
    modelValue: { control: 'object' },
  },
  decorators: [
    () => ({
      template: `
        <div style="
          padding:24px;
          background:var(--color-surface);
          color:var(--color-text);
          min-width:640px;
        ">
          <story />
        </div>
      `
    })
  ]
}

export default meta
type Story = StoryObj<typeof BaseSegment>

/* ---------- Helpers ---------- */
const defaultItems = [
  { label: 'Default', value: 'default' },
  { label: 'Segment', value: 'segment' },
]

const iconItems = [
  { label: 'Home', value: 'home', icon: 'tabler:home' },
  { label: 'Issues', value: 'issues', icon: 'tabler:alert-circle' },
  { label: 'Settings', value: 'settings', icon: 'tabler:settings' },
]

/** الگوی رندر با v-model داخلی + inline style vars */
function withVModel(args: any, initial?: any) {
  return defineComponent({
    components: { BaseSegment },
    setup() {
      const local = ref(
        args.multiple
          ? (Array.isArray(args.modelValue) ? args.modelValue : [])
          : (args.modelValue ?? initial ?? (
              Array.isArray(args.items)
                ? (typeof args.items[0] === 'object'
                    ? (args.items[0] as any)?.value
                    : args.items[0])
                : null
            ))
      )
      watch(() => args.modelValue, v => { if (v !== undefined) local.value = v })

      const segStyle = computed(() => styleFor(args.variant, args.mode))
      return { args, local, segStyle }
    },
    template: `<BaseSegment v-bind="args" v-model="local" :style="segStyle" />`
  })
}

/* ---------- Stories ---------- */

export const Playground: Story = {
  args: {
    items: defaultItems,
    size: 'md',
    shape: 'pill',
    variant: 'primary',
    mode: 'ios',
    fullWidth: false,
    disabled: false,
    readonly: false,
    multiple: false,
    scrollable: false,
  },
  render: (args) => withVModel(args),
}

export const IOSBasic: Story = {
  name: 'iOS · Basic',
  args: { items: defaultItems, mode: 'ios', size: 'md', shape: 'pill', variant: 'primary' },
  render: (args) => withVModel(args, 'default'),
}

export const MDBasic: Story = {
  name: 'Material · Underline',
  args: { items: defaultItems, mode: 'md', size: 'md', shape: 'rounded', variant: 'primary' },
  render: (args) => withVModel(args, 'default'),
}

export const WithIcons: Story = {
  args: { items: iconItems, mode: 'ios', size: 'md', shape: 'pill', variant: 'secondary' },
  render: (args) => withVModel(args, 'home'),
}

export const Multiple: Story = {
  args: { items: ['Open','Assigned','Closed'], multiple: true, mode: 'md', size: 'sm', shape: 'pill', variant: 'primary' },
  render: (args) => withVModel(args, ['Open']),
}

export const Scrollable: Story = {
  args: {
    items: Array.from({ length: 12 }, (_, i) => ({ label: `Tab ${i + 1}`, value: i + 1 })),
    scrollable: true, mode: 'ios', size: 'sm', variant: 'ghost',
  },
  render: (args) => defineComponent({
    components: { BaseSegment },
    setup() {
      const val = ref(1)
      const segStyle = computed(() => styleFor(args.variant, args.mode))
      return { args, val, segStyle }
    },
    template: `<div style="max-width:520px;"><BaseSegment v-bind="args" v-model="val" :style="segStyle" /></div>`
  })
}

export const FullWidth: Story = {
  args: { items: ['Overview','Analytics','Billing'], fullWidth: true, mode: 'md', size: 'md', variant: 'primary' },
  render: (args) => defineComponent({
    components: { BaseSegment },
    setup() {
      const v = ref('Overview')
      const segStyle = computed(() => styleFor(args.variant, args.mode))
      return { args, v, segStyle }
    },
    template: `
      <div style="width:720px; border:1px dashed var(--color-border); padding:16px; border-radius:12px;">
        <BaseSegment v-bind="args" v-model="v" :style="segStyle" />
      </div>
    `
  })
}

export const States: Story = {
  render: () => defineComponent({
    components: { BaseSegment },
    setup() {
      const a = ref('Default'); const b = ref('Default')
      const styleIos = styleFor('default', 'ios')
      return { a, b, styleIos }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; min-width:520px;">
        <section>
          <h4 style="margin:0 0 8px 0; font-weight:600;">Disabled</h4>
          <BaseSegment :items="['Default','Segment']" mode="ios" :disabled="true" v-model="a" :style="styleIos"/>
        </section>
        <section>
          <h4 style="margin:16px 0 8px 0; font-weight:600;">Readonly</h4>
          <BaseSegment :items="['Default','Segment']" mode="ios" :readonly="true" v-model="b" :style="styleIos"/>
        </section>
      </div>
    `
  })
}

/* ---------- Gallery (with per-cell inline style) ---------- */
const SegCell = defineComponent({
  name: 'SegCell',
  components: { BaseSegment },
  props: {
    variant: { type: String, required: true },
    size: { type: String, required: true },
    shape: { type: String, required: true },
    mode: { type: String, default: 'ios' },
    modelKey: { type: String, required: true },
  },
  setup(props) {
    const v = ref('Default')
    const segStyle = computed(() => styleFor(props.variant, props.mode as 'ios'|'md'))
    const items = [{label:'Default', value:'Default'}, {label:'Segment', value:'Segment'}]
    return { v, segStyle, items, props }
  },
  template: `
    <BaseSegment
      :items="items"
      :variant="props.variant"
      :size="props.size"
      :shape="props.shape"
      :mode="props.mode"
      v-model="v"
      :style="segStyle"
    />
  `
})

export const Gallery: Story = {
  parameters: { layout: 'centered' },
  render: () => defineComponent({
    components: { SegCell },
    setup() {
      const variants = [
        'default',
        'primary','secondary','tertiary',
        'success','warning','info','error','danger',
        'light','medium','dark',
        'outline','ghost'
      ] as const
      const sizes = ['sm','md','lg'] as const
      const shapes = ['pill','rounded'] as const
      return { variants, sizes, shapes }
    },
    template: `
      <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:24px; min-width:860px;">
        <div v-for="shape in shapes" :key="'s-'+shape" style="display:flex; flex-direction:column; gap:16px;">
          <h4 style="margin:0; font-weight:700; font-size:14px;">Shape: {{ shape }}</h4>
          <div v-for="size in sizes" :key="shape+size" style="display:flex; flex-direction:column; gap:12px;">
            <div v-for="variant in variants" :key="shape+size+variant" style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <span style="opacity:.7; min-width:140px; font-size:12px">{{ variant }} / {{ size }}</span>
              <SegCell :variant="variant" :size="size" :shape="shape" mode="ios" :modelKey="shape+'-'+size+'-'+variant"/>
            </div>
          </div>
        </div>
      </div>
    `
  })
}

/* ---------- Tones (like screenshot) ---------- */
const ToneRow = defineComponent({
  name: 'ToneRow',
  components: { BaseSegment },
  props: { label: { type: String, required: true }, variant: { type: String, required: true } },
  setup(props) {
    const val = ref(props.label)
    const segStyle = computed(() => styleFor(props.variant, 'ios'))
    const items = [{ label: props.label, value: props.label }, { label: 'Segment', value: 'segment' }]
    return { val, segStyle, items, props }
  },
  template: `
    <BaseSegment
      :items="items"
      :variant="props.variant"
      mode="ios"
      size="md"
      shape="pill"
      v-model="val"
      :style="segStyle"
    />
  `
})

export const Tones: Story = {
  name: 'Tones · iOS',
  parameters: { layout: 'centered' },
  render: () => defineComponent({
    components: { ToneRow },
    setup() {
      const rows = [
        ['Default','default'],
        ['Primary','primary'],
        ['Secondary','secondary'],
        ['Tertiary','tertiary'],
        ['Success','success'],
        ['Warning','warning'],
        ['Danger','danger'],
        ['Light','light'],
        ['Medium','medium'],
        ['Dark','dark'],
      ] as const
      return { rows }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:14px; padding:24px; min-width:640px;">
        <ToneRow v-for="[label, variant] in rows" :key="label" :label="label" :variant="variant" shape="rounded" size="md" />
      </div>
    `
  })
}
