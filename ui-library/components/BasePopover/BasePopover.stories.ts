import type { Meta, StoryObj } from '@storybook/vue3'
import { h, ref, defineComponent, nextTick } from 'vue'
import BasePopover from './BasePopover.vue'

// ─────────────────────────────────────────────────────────
// Storybook Meta
// ─────────────────────────────────────────────────────────
const meta: Meta<typeof BasePopover> = {
  title: 'Components/Overlay/BasePopover',
  component: BasePopover,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A token-driven, accessible Popover component with positioning, flipping, arrow, and theming (color/variant/size/rounded).\nThis page includes a playground + curated galleries to visually verify placements, triggers, and styles.'
      }
    }
  },
  argTypes: {
    modelValue: { control: false },
    defaultOpen: { control: 'boolean' },
    disabled: { control: 'boolean' },

    placement: {
      control: 'select',
      options: [
        'top','top-start','top-end',
        'bottom','bottom-start','bottom-end',
        'left','left-start','left-end',
        'right','right-start','right-end'
      ]
    },
    offset: { control: { type: 'number', min: 0, step: 1 } },
    strategy: { control: 'inline-radio', options: ['absolute','fixed'] },
    flip: { control: 'boolean' },

    trigger: { control: 'select', options: ['click','hover','focus','manual'] },
    openDelay: { control: { type: 'number', min: 0, step: 25 } },
    closeDelay: { control: { type: 'number', min: 0, step: 25 } },

    closeOnEsc: { control: 'boolean' },
    closeOnOutside: { control: 'boolean' },
    matchTriggerWidth: { control: 'boolean' },
    portal: { control: 'boolean' },

    arrow: { control: 'boolean' },
    arrowSize: { control: { type: 'number', min: 4, step: 1 } },

    autoFocus: { control: 'select', options: ['first','container',false] },
    role: { control: 'select', options: ['dialog','menu','listbox','tooltip'] },

    color: { control: 'select', options: ['primary','success','error','warning','info','neutral'] },
    variant: { control: 'select', options: ['solid','soft','outline'] },
    size: { control: 'radio', options: ['sm','md','lg'] },
    rounded: { control: 'radio', options: ['sm','md','lg','full'] },

    panelClass: { control: false },
    id: { control: false },
    triggerTag: { control: 'select', options: ['button','div','span','a'] },
  },
  args: {
    defaultOpen: false,
    disabled: false,

    placement: 'bottom-start',
    offset: 8,
    strategy: 'absolute',
    flip: true,

    trigger: 'click',
    openDelay: 75,
    closeDelay: 100,

    closeOnEsc: true,
    closeOnOutside: true,
    matchTriggerWidth: false,
    portal: true,

    arrow: true,
    arrowSize: 8,
    autoFocus: 'first',
    role: 'dialog',

    color: 'neutral',
    variant: 'soft',
    size: 'md',
    rounded: 'md',

    triggerTag: 'button',
  }
}
export default meta

// ─────────────────────────────────────────────────────────
// Small helpers / styles for stories
// ─────────────────────────────────────────────────────────
const DemoCard = defineComponent({
  props: { title: String, subtitle: String },
  setup(props, { slots }) {
    return () => h('div', {
      style: {
        padding: '16px',
        borderRadius: '16px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minWidth: '220px'
      }
    }, [
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, [
        h('strong', { style: { fontSize: '14px' } }, props.title),
        props.subtitle ? h('span', { style: { opacity: 0.7, fontSize: '12px' } }, props.subtitle) : null,
      ]),
      h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, slots.default?.())
    ])
  }
})

const Button = (label = 'Open popover') => h('button', {
  style: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '8px 12px', borderRadius: '10px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)', color: 'var(--color-text)',
    boxShadow: 'var(--shadow-sm)', cursor: 'pointer'
  }
}, label)

const Tag = (text: string) => h('span', {
  style: {
    fontSize: '12px', padding: '2px 8px', borderRadius: '9999px',
    border: '1px solid var(--color-border)', opacity: 0.8
  }
}, text)

// ─────────────────────────────────────────────────────────
// Playground
// ─────────────────────────────────────────────────────────
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { BasePopover },
    setup() { return { args } },
    template: `
      <div style="padding: 40px; display: grid; place-items: start; min-height: 60vh; background: var(--color-background)">
        <BasePopover v-bind="args">
          <template #trigger>
            <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">Trigger</button>
          </template>
          <div style="display:flex;flex-direction:column;gap:8px;min-width:200px">
            <strong>Popover content</strong>
            <p style="margin:0;opacity:.8">Use controls to tweak props.</p>
            <label style="display:flex;gap:8px;align-items:center">
              <span style="width:80px">Email</span>
              <input type="email" placeholder="you@company.com" style="flex:1;padding:6px 8px;border:1px solid var(--color-border);border-radius:8px" />
            </label>
            <button style="align-self:flex-end;padding:6px 10px;border:1px solid var(--color-border);border-radius:8px">Submit</button>
          </div>
        </BasePopover>
      </div>
    `
  })
}

// ─────────────────────────────────────────────────────────
// Placements Gallery (visual regression matrix)
// ─────────────────────────────────────────────────────────
export const Placements: Story = {
  name: 'Placements Gallery',
  render: (args) => ({
    components: { BasePopover, DemoCard },
    setup() {
      const placements = [
        'top','top-start','top-end',
        'bottom','bottom-start','bottom-end',
        'left','left-start','left-end',
        'right','right-start','right-end'
      ] as const
      return { args, placements }
    },
    template: `
      <div style="padding:32px; display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <DemoCard v-for="p in placements" :key="p" :title="p">
          <BasePopover v-bind="{...args, placement: p}">
            <template #trigger>
              <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">{{ p }}</button>
            </template>
            <div style="max-width:260px;display:flex;flex-direction:column;gap:6px">
              <strong>Placement: {{ p }}</strong>
              <p style="margin:0;opacity:.8">This verifies arrow, clamping and flip.</p>
            </div>
          </BasePopover>
        </DemoCard>
      </div>
    `
  })
}

// ─────────────────────────────────────────────────────────
// Triggers Gallery
// ─────────────────────────────────────────────────────────
export const Triggers: Story = {
  name: 'Triggers (click / hover / focus / manual)',
  render: (args) => ({
    components: { BasePopover, DemoCard },
    setup() {
      const manualOpen = ref(false)
      return { args, manualOpen }
    },
    template: `
      <div style="padding:32px; display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <DemoCard title="Click (default)">
          <BasePopover v-bind="{...args, trigger: 'click'}">
            <template #trigger>
              <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">Click me</button>
            </template>
            <div>Opens on click.</div>
          </BasePopover>
        </DemoCard>
        <DemoCard title="Hover">
          <BasePopover v-bind="{...args, trigger: 'hover'}">
            <template #trigger>
              <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">Hover me</button>
            </template>
            <div>Opens on hover (with open/close delay).</div>
          </BasePopover>
        </DemoCard>
        <DemoCard title="Focus">
          <BasePopover v-bind="{...args, trigger: 'focus'}">
            <template #trigger>
              <input placeholder="Focus me" style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border)" />
            </template>
            <div>Opens on focus; closes on blur.</div>
          </BasePopover>
        </DemoCard>
        <DemoCard title="Manual">
          <BasePopover v-model="manualOpen" v-bind="{...args, trigger: 'manual'}">
            <template #trigger>
              <button @click="manualOpen = !manualOpen" style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">
                Toggle (v-model: {{ manualOpen }})
              </button>
            </template>
            <div>Controlled externally via v-model.</div>
          </BasePopover>
        </DemoCard>
      </div>
    `
  })
}

// ─────────────────────────────────────────────────────────
// Theme Showcase (color × variant × size × rounded)
// ─────────────────────────────────────────────────────────
export const ThemeShowcase: Story = {
  name: 'Theme Showcase',
  render: (args) => ({
    components: { BasePopover, DemoCard },
    setup() {
      const colors = ['primary','success','error','warning','info','neutral'] as const
      const variants = ['soft','solid','outline'] as const
      const sizes = ['sm','md','lg'] as const
      const roundeds = ['sm','md','lg','full'] as const
      return { args, colors, variants, sizes, roundeds }
    },
    template: `
      <div style="padding:24px; display:flex; flex-direction:column; gap:24px;">
        <DemoCard v-for="color in colors" :key="color" :title="'color: ' + color">
          <div style="display:flex; gap:12px; flex-wrap:wrap">
            <BasePopover v-for="variant in variants" :key="variant" v-bind="{...args, color, variant}">
              <template #trigger>
                <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">
                  {{ color }} / {{ variant }}
                </button>
              </template>
              <div>Styled with {{ color }} {{ variant }}</div>
            </BasePopover>
          </div>
        </DemoCard>

        <DemoCard title="Sizes">
          <div style="display:flex; gap:12px; flex-wrap:wrap">
            <BasePopover v-for="size in sizes" :key="size" v-bind="{...args, size}">
              <template #trigger>
                <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">size: {{ size }}</button>
              </template>
              <div>Size {{ size }} content</div>
            </BasePopover>
          </div>
        </DemoCard>

        <DemoCard title="Rounded">
          <div style="display:flex; gap:12px; flexWrap: wrap">
            <BasePopover v-for="r in roundeds" :key="r" v-bind="{...args, rounded: r}">
              <template #trigger>
                <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">rounded: {{ r }}</button>
              </template>
              <div>Rounded {{ r }}</div>
            </BasePopover>
          </div>
        </DemoCard>
      </div>
    `
  })
}

// ─────────────────────────────────────────────────────────
// Behaviors: arrow/matchWidth/portal/fixed
// ─────────────────────────────────────────────────────────
export const Behaviors: Story = {
  name: 'Behaviors',
  render: (args) => ({
    components: { BasePopover, DemoCard },
    setup() { return { args } },
    template: `
      <div style="padding:24px; display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <DemoCard title="No Arrow">
          <BasePopover v-bind="{...args, arrow: false}">
            <template #trigger>
              <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">No arrow</button>
            </template>
            <div>Arrow is hidden.</div>
          </BasePopover>
        </DemoCard>
        <DemoCard title="Match Trigger Width">
          <BasePopover v-bind="{...args, matchTriggerWidth: true}">
            <template #trigger>
              <button style="padding:8px 12px; width: 220px; border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">220px trigger</button>
            </template>
            <div>This panel matches trigger width.</div>
          </BasePopover>
        </DemoCard>
        <DemoCard title="Strategy: fixed" subtitle="tests scroll containers">
          <div style="height: 160px; overflow: auto; border: 1px dashed var(--color-border); padding: 16px; border-radius: 12px; position: relative;">
            <div style="height: 240px; width: 600px; padding: 16px;">
              <BasePopover v-bind="{...args, strategy: 'fixed'}">
                <template #trigger>
                  <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">Fixed in scroller</button>
                </template>
                <div>Fixed strategy resists scroll parent offsets.</div>
              </BasePopover>
            </div>
          </div>
        </DemoCard>
        <DemoCard title="Portal: off">
          <BasePopover v-bind="{...args, portal: false}">
            <template #trigger>
              <button style="padding:8px 12px;border-radius:10px;border:1px solid var(--color-border);background:var(--color-surface);cursor:pointer">Render inline</button>
            </template>
            <div>Panel rendered next to trigger (no teleport).</div>
          </BasePopover>
        </DemoCard>
      </div>
    `
  })
}

// ─────────────────────────────────────────────────────────
// Roles: dialog / menu / listbox / tooltip
// ─────────────────────────────────────────────────────────
export const Roles: Story = {
  name: 'ARIA Roles',
  render: (args) => ({
    components: { BasePopover, DemoCard },
    setup() { return { args } },
    template: `
      <div style="padding:24px; display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <DemoCard title="Dialog (default)">
          <BasePopover v-bind="{...args, role: 'dialog'}">
            <template #trigger><button style="padding:8px 12px;border:1px solid var(--color-border);border-radius:10px">Open dialog</button></template>
            <div><strong>Dialog</strong><p style="margin:0">Aria-modal=true when portaled.</p></div>
          </BasePopover>
        </DemoCard>
        <DemoCard title="Menu">
          <BasePopover v-bind="{...args, role: 'menu'}">
            <template #trigger><button style="padding:8px 12px;border:1px solid var(--color-border);border-radius:10px">Open menu</button></template>
            <ul role="menu" style="display:flex;flex-direction:column;gap:6px;list-style:none;padding:0;margin:0">
              <li role="menuitem" tabindex="0">New file</li>
              <li role="menuitem" tabindex="0">Duplicate</li>
              <li role="menuitem" tabindex="0">Delete</li>
            </ul>
          </BasePopover>
        </DemoCard>
        <DemoCard title="Listbox">
          <BasePopover v-bind="{...args, role: 'listbox'}">
            <template #trigger><button style="padding:8px 12px;border:1px solid var(--color-border);border-radius:10px">Choose</button></template>
            <div role="listbox" style="display:flex;flex-direction:column;gap:4px">
              <div role="option" aria-selected="true" tabindex="0">Apple</div>
              <div role="option" tabindex="0">Orange</div>
              <div role="option" tabindex="0">Banana</div>
            </div>
          </BasePopover>
        </DemoCard>
        <DemoCard title="Tooltip">
          <BasePopover v-bind="{...args, role: 'tooltip', trigger: 'hover'}">
            <template #trigger><button style="padding:8px 12px;border:1px solid var(--color-border);border-radius:10px">Hover</button></template>
            <div>Small helper text as tooltip.</div>
          </BasePopover>
        </DemoCard>
      </div>
    `
  })
}

// ─────────────────────────────────────────────────────────
// RTL Showcase
// ─────────────────────────────────────────────────────────
export const RTL: Story = {
  name: 'RTL Showcase',
  render: (args) => ({
    components: { BasePopover },
    setup() { return { args } },
    template: `
      <div dir="rtl" style="padding: 32px; display: grid; gap: 16px; grid-auto-flow: column; width: max-content;">
        <BasePopover v-bind="{...args, placement: 'bottom-start'}">
          <template #trigger>
            <button style="padding:8px 12px;border:1px solid var(--color-border);border-radius:10px">شروع</button>
          </template>
          <div>جهت RTL و تراز start</div>
        </BasePopover>
        <BasePopover v-bind="{...args, placement: 'bottom-end'}">
          <template #trigger>
            <button style="padding:8px 12px;border:1px solid var(--color-border);border-radius:10px">پایان</button>
          </template>
          <div>جهت RTL و تراز end</div>
        </BasePopover>
      </div>
    `
  })
}

// ─────────────────────────────────────────────────────────
// Inside form / autofocus demonstration
// ─────────────────────────────────────────────────────────
export const FormsAndFocus: Story = {
  name: 'Forms & AutoFocus',
  render: (args) => ({
    components: { BasePopover, DemoCard },
    setup() { return { args } },
    template: `
      <div style="padding:24px; display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
        <DemoCard title="autoFocus: 'first'">
          <BasePopover v-bind="{...args, autoFocus: 'first'}">
            <template #trigger><button style="padding:8px 12px;border:1px solid var(--color-border);border-radius:10px">Open</button></template>
            <div style="display:flex;flex-direction:column;gap:8px">
              <input placeholder="First focus" style="padding:6px 8px;border:1px solid var(--color-border);border-radius:8px" />
              <input placeholder="Second" style="padding:6px 8px;border:1px solid var(--color-border);border-radius:8px" />
            </div>
          </BasePopover>
        </DemoCard>
        <DemoCard title="autoFocus: 'container'">
          <BasePopover v-bind="{...args, autoFocus: 'container'}">
            <template #trigger><button style="padding:8px 12px;border:1px solid var(--color-border);border-radius:10px">Open</button></template>
            <div>Container gets focus.</div>
          </BasePopover>
        </DemoCard>
      </div>
    `
  })
}

// ─────────────────────────────────────────────────────────
// Edge Cases: near viewport edges to test clamping/flipping
// ─────────────────────────────────────────────────────────
export const EdgeCases: Story = {
  name: 'Edge Cases (viewport bounds)',
  render: (args) => ({
    components: { BasePopover },
    setup() { return { args } },
    template: `
      <div style="padding:0; height: 70vh; position: relative;">
        <div style="position:absolute; top:8px; left:8px;">
          <BasePopover v-bind="{...args, placement: 'top-start'}">
            <template #trigger><button style="padding:6px 10px;border:1px solid var(--color-border);border-radius:10px">TL</button></template>
            <div>Top-left corner</div>
          </BasePopover>
        </div>
        <div style="position:absolute; top:8px; right:8px;">
          <BasePopover v-bind="{...args, placement: 'top-end'}">
            <template #trigger><button style="padding:6px 10px;border:1px solid var(--color-border);border-radius:10px">TR</button></template>
            <div>Top-right corner</div>
          </BasePopover>
        </div>
        <div style="position:absolute; bottom:8px; left:8px;">
          <BasePopover v-bind="{...args, placement: 'bottom-start'}">
            <template #trigger><button style="padding:6px 10px;border:1px solid var(--color-border);border-radius:10px">BL</button></template>
            <div>Bottom-left corner</div>
          </BasePopover>
        </div>
        <div style="position:absolute; bottom:8px; right:8px;">
          <BasePopover v-bind="{...args, placement: 'bottom-end'}">
            <template #trigger><button style="padding:6px 10px;border:1px solid var(--color-border);border-radius:10px">BR</button></template>
            <div>Bottom-right corner</div>
          </BasePopover>
        </div>
      </div>
    `
  })
}
