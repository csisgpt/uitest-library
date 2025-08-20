import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h } from 'vue'
import BaseContainer from './BaseContainer.vue'

/**
 * Full, visual test matrix for BaseContainer
 * - Vue 3 + TS
 * - No Tailwind; inline styles only for demo
 * - Uses logical properties for RTL-safe wrappers
 */

type Size =
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  | 'full' | 'none'

type Pad = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const SIZES: Size[] = ['xs','sm','md','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl','full','none']
const PADS: Pad[] = ['none','xs','sm','md','lg','xl','2xl']

/** Utility demo content */
const DemoBlock = defineComponent({
  name: 'DemoBlock',
  props: {
    label: { type: String, default: 'Content' },
    h: { type: Number, default: 120 },
    w: { type: String, default: '100%' },
  },
  setup(props) {
    const style = {
      width: props.w,
      height: `${props.h}px`,
      display: 'grid',
      placeItems: 'center',
      border: '1px dashed var(--color-border, #cbd5e1)',
      background: 'var(--color-surface, #f8fafc)',
      color: 'var(--color-text, #0f172a)',
      borderRadius: '8px'
    } as const
    return () => h('div', { style }, props.label)
  }
})

/** Wrapper decorators to simulate different parent contexts */
const makePaddedPage = (pad = 24) => (storyFn: any) => ({
  components: { Story: storyFn() },
  template: `
    <div style="
      min-height: 100vh;
      padding-inline: ${pad}px;
      padding-block: ${pad}px;
      background:
        linear-gradient(transparent 23px, rgba(60,60,60,.06) 24px) 0 0/100% 24px,
        linear-gradient(90deg, transparent 23px, rgba(60,60,60,.06) 24px) 0 0/24px 100%,
        #fff;
    ">
      <Story />
    </div>
  `
})

const makeNarrowColumn = (w = 360) => (storyFn: any) => ({
  components: { Story: storyFn() },
  template: `
    <div style="padding: 24px; display: grid; place-items: start;">
      <div style="width:${w}px; border:1px solid #e2e8f0; border-radius:12px; padding:16px; background:#fff;">
        <Story />
      </div>
    </div>
  `
})

const makeCardCanvas = (w = 680) => (storyFn: any) => ({
  components: { Story: storyFn() },
  template: `
    <div style="min-height:100vh; display:grid; place-items:center; padding: 24px; background:#f1f5f9;">
      <div style="width:${w}px; background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; box-shadow: 0 10px 25px rgba(2,8,23,0.1);">
        <Story />
      </div>
    </div>
  `
})

const meta = {
  title: 'Layout/BaseContainer/Full Showcase',
  component: BaseContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    backgrounds: {
      default: 'grid',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'gray', value: '#f1f5f9' },
        { name: 'grid', value: '#ffffff' },
      ]
    },
    docs: {
      description: {
        component:
          'کانتینر واکنشی با محدودکنندهٔ عرض، فاصلهٔ داخلی منطقی (RTL/LTR-safe)، حالت‌های fluid و breakout و امکان تعیین عنصر HTML.\n' +
          'این فایل، تمام حالت‌ها و ترکیب‌ها را به صورت تصویری پوشش می‌دهد.'
      }
    }
  }
} satisfies Meta<typeof BaseContainer>

export default meta

type Story = StoryObj<typeof meta>

/* ---------------------------------- */
/* Playground (کنترل‌ها)              */
/* ---------------------------------- */
export const Playground: Story = {
  args: {
    as: 'div',
    maxWidth: 'lg',
    padding: 'md',
    centered: true,
    fluid: false,
    breakout: false
  },
  decorators: [makePaddedPage(32)],
  render: (args) => ({
    components: { BaseContainer, DemoBlock },
    setup: () => ({ args }),
    template: `
      <BaseContainer v-bind="args" style="border:1px dashed #cbd5e1;">
        <DemoBlock label="Playground" :h="140" />
      </BaseContainer>
    `
  })
}

/* ---------------------------------- */
/* Grid of all maxWidth variants      */
/* ---------------------------------- */
export const MaxWidthsGrid: Story = {
  decorators: [makePaddedPage(32)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    setup() {
      return { sizes: SIZES }
    },
    template: `
      <div style="display:grid; gap:24px;">
        <div v-for="size in sizes" :key="size" style="display:grid; gap:8px;">
          <div style="font: 500 13px/1 system-ui, sans-serif; color:#334155">maxWidth: {{ size }}</div>
          <BaseContainer :maxWidth="size" padding="md" style="border:1px dashed #cbd5e1;">
            <DemoBlock :label="'Content (' + size + ')'" :h="100" />
          </BaseContainer>
        </div>
      </div>
    `
  })
}

/* ---------------------------------- */
/* Horizontal padding variants        */
/* ---------------------------------- */
export const PaddingXVariants: Story = {
  decorators: [makePaddedPage(32)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    setup: () => ({ pads: PADS }),
    template: `
      <div style="display:grid; gap:20px;">
        <div v-for="pad in pads" :key="pad" style="display:grid; gap:8px;">
          <div style="font: 500 13px/1 system-ui, sans-serif; color:#334155">paddingX: {{ pad }}</div>
          <BaseContainer maxWidth="lg" :paddingX="pad" paddingY="sm" style="border:1px dashed #cbd5e1;">
            <DemoBlock :label="'paddingX ' + pad" :h="90" />
          </BaseContainer>
        </div>
      </div>
    `
  })
}

/* ---------------------------------- */
/* Vertical padding variants          */
/* ---------------------------------- */
export const PaddingYVariants: Story = {
  decorators: [makePaddedPage(32)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    setup: () => ({ pads: PADS }),
    template: `
      <div style="display:grid; gap:20px;">
        <div v-for="pad in pads" :key="pad" style="display:grid; gap:8px;">
          <div style="font: 500 13px/1 system-ui, sans-serif; color:#334155">paddingY: {{ pad }}</div>
          <BaseContainer maxWidth="lg" paddingX="md" :paddingY="pad" style="border:1px dashed #cbd5e1;">
            <DemoBlock :label="'paddingY ' + pad" :h="90" />
          </BaseContainer>
        </div>
      </div>
    `
  })
}

/* ---------------------------------- */
/* Padding matrix (X × Y)             */
/* ---------------------------------- */
export const PaddingMatrix: Story = {
  decorators: [makePaddedPage(24)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    setup: () => ({ pads: PADS }),
    template: `
      <div style="display:grid; gap:16px;">
        <div style="display:grid; grid-template-columns: 120px repeat(6, 1fr); gap:8px; align-items:center;">
          <div></div>
          <div v-for="px in pads.slice(0)" :key="'h-'+px" style="text-align:center; font: 600 12px/1 system-ui; color:#475569">X: {{px}}</div>

          <template v-for="py in pads" :key="'row-'+py">
            <div style="font: 600 12px/1 system-ui; color:#475569">Y: {{py}}</div>
            <template v-for="px in pads" :key="py+'-'+px">
              <BaseContainer maxWidth="md" :paddingX="px" :paddingY="py" style="border:1px dashed #cbd5e1;">
                <DemoBlock :label="px + ' / ' + py" :h="64" />
              </BaseContainer>
            </template>
          </template>
        </div>
      </div>
    `
  })
}

/* ---------------------------------- */
/* Centered vs not                    */
/* ---------------------------------- */
export const CenteringComparison: Story = {
  decorators: [makeCardCanvas(900)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    template: `
      <div style="display:grid; gap:24px;">
        <div style="font: 600 14px/1 system-ui; color:#0f172a">centered: true</div>
        <BaseContainer maxWidth="md" padding="md" centered style="border:1px dashed #cbd5e1;">
          <DemoBlock label="Centered container" :h="80" w="280px" />
        </BaseContainer>

        <div style="font: 600 14px/1 system-ui; color:#0f172a; margin-top:8px;">centered: false</div>
        <BaseContainer maxWidth="md" padding="md" :centered="false" style="border:1px dashed #cbd5e1;">
          <DemoBlock label="Left-aligned container" :h="80" w="280px" />
        </BaseContainer>
      </div>
    `
  })
}

/* ---------------------------------- */
/* Fluid / Full-width                 */
/* ---------------------------------- */
export const FluidFullWidth: Story = {
  decorators: [makePaddedPage(0)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    template: `
      <BaseContainer fluid padding="lg" style="border-block:1px dashed #cbd5e1;">
        <DemoBlock label="Fluid container (stretches to viewport width)" :h="100" />
      </BaseContainer>
    `
  })
}

/* ---------------------------------- */
/* Breakout vs normal inside padded parent */
/* ---------------------------------- */
export const BreakoutComparison: Story = {
  decorators: [makePaddedPage(32)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    template: `
      <div style="display:grid; gap:24px;">
        <div style="font: 600 14px/1 system-ui; color:#0f172a">Normal inside padded page</div>
        <BaseContainer maxWidth="3xl" padding="md" style="border:1px dashed #cbd5e1;">
          <DemoBlock label="Normal" :h="90" />
        </BaseContainer>

        <div style="font: 600 14px/1 system-ui; color:#0f172a; margin-top:8px;">breakout: true</div>
        <BaseContainer breakout padding="lg" style="border-block:1px dashed #cbd5e1;">
          <DemoBlock label="Breakout to viewport edges" :h="90" />
        </BaseContainer>
      </div>
    `
  })
}

/* ---------------------------------- */
/* CustomMaxWidth                     */
/* ---------------------------------- */
export const CustomMaxWidth: Story = {
  decorators: [makePaddedPage(32)],
  args: { customMaxWidth: '68rem', padding: 'lg', centered: true },
  render: (args) => ({
    components: { BaseContainer, DemoBlock },
    setup: () => ({ args }),
    template: `
      <BaseContainer v-bind="args" style="border:1px dashed #cbd5e1;">
        <DemoBlock label="customMaxWidth: 68rem" :h="90" />
      </BaseContainer>
    `
  })
}

/* ---------------------------------- */
/* As prop variations                  */
/* ---------------------------------- */
export const AsPropExamples: Story = {
  decorators: [makeCardCanvas(960)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    template: `
      <div style="display:grid; gap:16px;">
        <BaseContainer as="section" maxWidth="xl" padding="md" style="border:1px dashed #cbd5e1;">
          <DemoBlock label="as=section" :h="72" />
        </BaseContainer>
        <BaseContainer as="article" maxWidth="md" padding="md" style="border:1px dashed #cbd5e1;">
          <DemoBlock label="as=article" :h="72" />
        </BaseContainer>
        <BaseContainer as="main" maxWidth="3xl" padding="lg" style="border:1px dashed #cbd5e1;">
          <DemoBlock label="as=main" :h="72" />
        </BaseContainer>
      </div>
    `
  })
}

/* ---------------------------------- */
/* RTL scenario                        */
/* ---------------------------------- */
export const RTL: Story = {
  decorators: [makePaddedPage(32)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    template: `
      <div dir="rtl" style="display:grid; gap:16px;">
        <BaseContainer maxWidth="lg" paddingX="lg" paddingY="sm" style="border:1px dashed #cbd5e1;">
          <DemoBlock label="RTL container" :h="80" />
        </BaseContainer>
      </div>
    `
  })
}

/* ---------------------------------- */
/* Embedded in a narrow sidebar        */
/* ---------------------------------- */
export const InSidebar: Story = {
  decorators: [makeNarrowColumn(320)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    template: `
      <BaseContainer maxWidth="sm" padding="sm" style="border:1px dashed #cbd5e1;">
        <DemoBlock label="Inside a 320px sidebar" :h="72" />
      </BaseContainer>
    `
  })
}

/* ---------------------------------- */
/* Inside a card                       */
/* ---------------------------------- */
export const InCard: Story = {
  decorators: [makeCardCanvas(720)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    template: `
      <BaseContainer maxWidth="lg" padding="lg" style="border:1px dashed #cbd5e1;">
        <DemoBlock label="Inside a card layout" :h="80" />
      </BaseContainer>
    `
  })
}

/* ---------------------------------- */
/* Combination gallery (key states)    */
/* ---------------------------------- */
export const CombinationGallery: Story = {
  decorators: [makePaddedPage(24)],
  render: () => ({
    components: { BaseContainer, DemoBlock },
    setup: () => ({ sizes: ['sm','md','lg','xl','2xl','3xl'] as Size[] }),
    template: `
      <div style="display:grid; gap:24px;">
        <div style="font: 700 14px/1 system-ui; color:#0f172a">Key combinations</div>

        <div style="display:grid; gap:16px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
          <div v-for="size in sizes" :key="size" style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; background:#fff;">
            <div style="font: 600 12px/1 system-ui; color:#334155; margin-block-end:8px;">maxWidth={{size}}, padding=lg</div>
            <BaseContainer :maxWidth="size" padding="lg" style="border:1px dashed #cbd5e1;">
              <DemoBlock :label="'Size ' + size" :h="72" />
            </BaseContainer>
          </div>

          <div style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; background:#fff;">
            <div style="font: 600 12px/1 system-ui; color:#334155; margin-block-end:8px;">fluid + padding=xl</div>
            <BaseContainer fluid padding="xl" style="border-block:1px dashed #cbd5e1;">
              <DemoBlock label="Fluid" :h="64" />
            </BaseContainer>
          </div>



          <div style="border:1px solid #e2e8f0; border-radius:12px; padding:12px; background:#fff;">
            <div style="font: 600 12px/1 system-ui; color:#334155; margin-block-end:8px;">customMaxWidth=56rem</div>
            <BaseContainer :customMaxWidth="'56rem'" padding="md" style="border:1px dashed #cbd5e1;">
              <DemoBlock label="Custom 56rem" :h="64" />
            </BaseContainer>
          </div>
        </div>
      </div>
    `
  })
}
