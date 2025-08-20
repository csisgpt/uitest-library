import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h } from 'vue'
import BaseStack from './BaseStack.vue'

type Direction = 'row'|'column'|'row-reverse'|'column-reverse'
const DIRECTIONS: Direction[] = ['row','column','row-reverse','column-reverse']
const PADS = ['none','xs','sm','md','lg','xl','2xl'] as const
const ALIGNS = ['start','center','end','stretch','baseline'] as const
const JUSTIFIES = ['start','center','end','space-between','space-around','space-evenly'] as const

/* Demo block */
const Chip = defineComponent({
  name: 'Chip',
  props: { label: { type: String, required: true } },
  setup(p) {
    const style = {
      display: 'inline-grid',
      placeItems: 'center',
      paddingInline: '12px',
      paddingBlock: '8px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      background: '#fff',
      color: '#0f172a',
      font: '500 12px/1 system-ui, sans-serif',
      boxShadow: '0 2px 6px rgba(2,8,23,0.06)'
    } as const
    return () => h('div', { style }, p.label)
  }
})

/* Decorators to simulate different contexts */
const makePaddedPage = (pad = 24) => (storyFn: any) => ({
  components: { Story: storyFn() },
  template: `
    <div style="min-height:100vh; padding:${pad}px; background:#f8fafc;">
      <Story />
    </div>
  `
})

const makeCardCanvas = (w = 840) => (storyFn: any) => ({
  components: { Story: storyFn() },
  template: `
    <div style="min-height:100vh; display:grid; place-items:center; padding:24px; background:#f1f5f9;">
      <div style="width:${w}px; background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; box-shadow: 0 10px 25px rgba(2,8,23,0.1);">
        <Story />
      </div>
    </div>
  `
})

const meta = {
  title: 'Layout/BaseStack/Full Showcase',
  component: BaseStack,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    docs: {
      description: {
        component: 'Stack انعطاف‌پذیر با توکن‌های فاصله، پوشش کامل direction/align/justify، wrap با حداقل اندازهٔ آیتم، divider سفارشی و responsive per-breakpoint.'
      }
    }
  },
  argTypes: {
    as: { control: 'text' },
    direction: { control: 'select', options: DIRECTIONS },
    spacing: { control: 'select', options: [...PADS, 'custom (12px)'] },
    align: { control: 'select', options: ALIGNS },
    justify: { control: 'select', options: JUSTIFIES },
    wrap: { control: 'boolean' },
    minItemSize: { control: 'text' },
    maxItems: { control: 'number' },
    animated: { control: 'boolean' },
    divider: { control: 'object' },
    responsive: { control: 'object' },
  }
} satisfies Meta<typeof BaseStack>

export default meta

type Story = StoryObj<typeof meta>

// Playground
export const Playground: Story = {
  args: {
    as: 'div',
    direction: 'row',
    spacing: 'md',
    align: 'center',
    justify: 'start',
    wrap: false,
    animated: false
  },
  decorators: [makePaddedPage(32)],
  render: (args) => ({
    components: { BaseStack, Chip },
    setup: () => ({ args }),
    template: `
      <BaseStack v-bind="args" :spacing="args.spacing === 'custom (12px)' ? '12px' : args.spacing">
        <Chip label="One" />
        <Chip label="Two" />
        <Chip label="Three" />
      </BaseStack>
    `
  })
}

// Directions grid
export const Directions: Story = {
  decorators: [makeCardCanvas(960)],
  render: () => ({
    components: { BaseStack, Chip },
    setup: () => ({ dirs: DIRECTIONS }),
    template: `
      <div style="display:grid; gap:16px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
        <div v-for="d in dirs" :key="d" style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; background:#fff;">
          <div style="font:600 12px/1 system-ui; color:#334155; margin-bottom:8px">direction={{d}}</div>
          <BaseStack :direction="d" spacing="sm" align="center">
            <Chip label="A" /><Chip label="B" /><Chip label="C" />
          </BaseStack>
        </div>
      </div>
    `
  })
}

// Spacing variants (tokens + custom)
export const SpacingVariants: Story = {
  decorators: [makePaddedPage(24)],
  render: () => ({
    components: { BaseStack, Chip },
    setup: () => ({ pads: [...PADS, '12px'] }),
    template: `
      <div style="display:grid; gap:20px;">
        <div v-for="p in pads" :key="p" style="display:grid; gap:8px;">
          <div style="font: 500 13px/1 system-ui; color:#334155">spacing: {{p}}</div>
          <BaseStack direction="row" :spacing="p" align="center">
            <Chip label="One" /><Chip label="Two" /><Chip label="Three" />
          </BaseStack>
        </div>
      </div>
    `
  })
}

// Align × Justify matrix
export const AlignJustifyMatrix: Story = {
  decorators: [makeCardCanvas(1024)],
  render: () => ({
    components: { BaseStack, Chip },
    setup: () => ({ ALIGNS, JUSTIFIES }),
    template: `
      <div style="display:grid; gap:16px;">
        <div style="display:grid; grid-template-columns: 160px repeat(6, 1fr); gap:12px; align-items:center;">
          <div></div>
          <div v-for="j in JUSTIFIES" :key="'h-'+j" style="text-align:center; font:600 12px/1 system-ui; color:#475569">justify: {{j}}</div>

          <template v-for="a in ALIGNS" :key="'row-'+a">
            <div style="font:600 12px/1 system-ui; color:#475569">align: {{a}}</div>
            <template v-for="j in JUSTIFIES" :key="a+'-'+j">
              <BaseStack direction="row" spacing="md" :align="a" :justify="j" style="border:1px dashed #cbd5e1; padding:12px; border-radius:10px;">
                <Chip label="A" /><Chip label="B" /><Chip label="C" />
              </BaseStack>
            </template>
          </template>
        </div>
      </div>
    `
  })
}

// Wrap behaviors
export const WrapBehaviors: Story = {
  decorators: [makePaddedPage(24)],
  render: () => ({
    components: { BaseStack, Chip },
    template: `
      <div style="display:grid; gap:24px;">
        <div style="font: 600 14px/1 system-ui; color:#0f172a">Row wrap with minItemSize=140px</div>
        <BaseStack direction="row" spacing="sm" wrap minItemSize="140px">
          <Chip v-for="i in 10" :key="i" :label="'Item '+i" />
        </BaseStack>

        <div style="font: 600 14px/1 system-ui; color:#0f172a">Column wrap with minItemSize=64px</div>
        <BaseStack direction="column" spacing="sm" wrap minItemSize="64px">
          <Chip v-for="i in 8" :key="'c'+i" :label="'Row '+i" />
        </BaseStack>
      </div>
    `
  })
}

// Divider examples
export const Dividers: Story = {
  decorators: [makeCardCanvas(960)],
  render: () => ({
    components: { BaseStack, Chip },
    template: `
      <div style="display:grid; gap:24px;">
        <div style="font: 600 14px/1 system-ui; color:#0f172a">Row divider (1px dashed)</div>
        <BaseStack direction="row" spacing="md" :divider="{ thickness: '1px', style: 'dashed', color: '#94a3b8' }" align="center">
          <Chip label="A" /><Chip label="B" /><Chip label="C" />
        </BaseStack>

        <div style="font: 600 14px/1 system-ui; color:#0f172a">Column divider (2px solid)</div>
        <BaseStack direction="column" spacing="sm" :divider="{ thickness: '2px', style: 'solid', color: '#e2e8f0' }">
          <Chip label="One" /><Chip label="Two" /><Chip label="Three" />
        </BaseStack>
      </div>
    `
  })
}

// Responsive scenarios
export const ResponsiveScenarios: Story = {
  decorators: [makePaddedPage(24)],
  render: () => ({
    components: { BaseStack, Chip },
    template: `
      <div style="display:grid; gap:24px;">
        <div style="font: 600 14px/1 system-ui; color:#0f172a">Column → Row from md, spacing md→xl</div>
        <BaseStack
          direction="column"
          spacing="md"
          :responsive="{ md: { direction: 'row', spacing: 'xl' } }"
          align="center"
        >
          <Chip label="Item 1" /><Chip label="Item 2" /><Chip label="Item 3" />
        </BaseStack>

        <div style="font: 600 14px/1 system-ui; color:#0f172a">Custom 12px gap from lg only</div>
        <BaseStack
          direction="row"
          spacing="sm"
          :responsive="{ lg: { spacing: '12px' }, xl: { justify: 'space-between' } }"
        >
          <Chip v-for="i in 6" :key="i" :label="'Chip '+i" />
        </BaseStack>
      </div>
    `
  })
}

// Max items
export const MaxItems: Story = {
  decorators: [makeCardCanvas(800)],
  render: () => ({
    components: { BaseStack, Chip },
    template: `
      <BaseStack direction="row" spacing="sm" :maxItems="5" wrap>
        <Chip v-for="i in 12" :key="i" :label="'Visible up to 5 → '+i" />
      </BaseStack>
    `
  })
}

// As prop & animated
export const AsAndAnimated: Story = {
  decorators: [makeCardCanvas(960)],
  render: () => ({
    components: { BaseStack, Chip },
    template: `
      <div style="display:grid; gap:20px;">
        <BaseStack as="nav" direction="row" spacing="md" animated>
          <Chip label="Home" /><Chip label="Docs" /><Chip label="About" />
        </BaseStack>
        <BaseStack as="ul" direction="column" spacing="xs" animated role="list">
          <Chip label="Item" /><Chip label="Item" /><Chip label="Item" />
        </BaseStack>
      </div>
    `
  })
}

// RTL
export const RTL: Story = {
  decorators: [makePaddedPage(24)],
  render: () => ({
    components: { BaseStack, Chip },
    template: `
      <div dir="rtl" style="display:grid; gap:16px;">
        <BaseStack direction="row" spacing="md" justify="space-between">
          <Chip label="اول" /><Chip label="دوم" /><Chip label="سوم" />
        </BaseStack>
      </div>
    `
  })
}

// Combination gallery
export const CombinationGallery: Story = {
  decorators: [makePaddedPage(16)],
  render: () => ({
    components: { BaseStack, Chip },
    setup: () => ({ sizes: [3,4,5,6] }),
    template: `
      <div >
        <div v-for="n in sizes" :key="n" style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; background:#fff;">
          <div style="font: 600 12px/1 system-ui; color:#334155; margin-bottom:8px;">row / spacing=lg / {{n}} items</div>
          <BaseStack direction="row" spacing="lg" align="center">
            <Chip v-for="i in n" :key="i" :label="'Item '+i" />
          </BaseStack>
        </div>

        <div style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; background:#fff;">
          <div style="font: 600 12px/1 system-ui; color:#334155; margin-bottom:8px;">column / spacing=sm / divider</div>
          <BaseStack direction="column" spacing="sm" :divider="{ thickness: '1px', style: 'solid', color: '#e2e8f0' }">
            <Chip label="Alpha" /><Chip label="Beta" /><Chip label="Gamma" />
          </BaseStack>
        </div>
      </div>
    `
  })
}