import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, ref, onMounted, onBeforeUnmount, reactive, watch, nextTick } from 'vue'
import BaseSpacer from './BaseSpacer.vue'

/* ----------------------------------------------------------------------------------
   Local demo components (بدون هک رشته‌ای)
-----------------------------------------------------------------------------------*/

const Frame = defineComponent({
  name: 'Frame',
  props: { title: { type: String, default: '' }, note: { type: String, default: '' } },
  template: `
    <section style="
      border:1px solid #e2e8f0; border-radius:12px; padding:16px; background:#fff;
      box-shadow: 0 6px 18px rgba(2,8,23,0.06);">
      <header v-if="title" style="font:600 13px/1 system-ui; color:#0f172a; margin-bottom:10px;">
        {{ title }}
      </header>
      <div style="display:grid; gap:12px;">
        <slot />
      </div>
      <footer v-if="note" style="margin-top:8px; font:12px/1.4 system-ui; color:#475569;">{{ note }}</footer>
    </section>
  `
})

const Chip = defineComponent({
  name: 'Chip',
  props: { label: { type: String, required: true } },
  template: `
    <div style="
      background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px;
      font:500 12px/1 system-ui; color:#0f172a; box-shadow:0 2px 6px rgba(2,8,23,0.06)">
      {{ label }}
    </div>
  `
})

const LegendBar = defineComponent({
  name: 'LegendBar',
  template: `
    <div style="display:flex; gap:12px; align-items:center; font:12px/1.2 system-ui; color:#334155">
      <div style="width:14px; height:14px; border-radius:3px; background:#c7d2fe; border:1px solid #6366f1;"></div> Spacer
      <div style="width:14px; height:14px; border-radius:3px; background:#f1f5f9; border:1px solid #94a3b8;"></div> Content
      <div style="width:14px; height:14px; border-radius:3px; background:#fee2e2; border:1px solid #ef4444;"></div> Measure
    </div>
  `
})

/** محورهای inline/block را با فلش نشان می‌دهد و محور اثرگذار Spacer را هایلایت می‌کند */
const AxisGuide = defineComponent({
  name: 'AxisGuide',
  props: { direction: { type: String, required: true } },
  computed: {
    isH(): boolean { return this.direction === 'horizontal' },
    isV(): boolean { return this.direction === 'vertical' },
    isB(): boolean { return this.direction === 'both' }
  },
  template: `
    <div style="padding:12px; border:1px dashed #94a3b8; border-radius:10px;">
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; align-items:center;">
        <div>
          <div style="font:600 12px/1 system-ui; color:#0f172a; margin-bottom:6px">Inline axis (↔︎)</div>
          <div :style="{
            height:'8px',
            background: isH || isB ? '#c7d2fe' : '#e2e8f0',
            borderRadius:'999px'
          }"></div>
        </div>
        <div>
          <div style="font:600 12px/1 system-ui; color:#0f172a; margin-bottom:6px">Block axis (↕︎)</div>
          <div :style="{
            width:'8px', height:'60px',
            background: isV || isB ? '#c7d2fe' : '#e2e8f0',
            borderRadius:'999px', marginInline:'auto'
          }"></div>
        </div>
      </div>
      <div style="margin-top:10px; font:12px/1.4 system-ui; color:#475569">
        جهت اثرگذار: <b>{{ direction }}</b>
      </div>
    </div>
  `
})

/** اندازه‌گیر زنده: inline-size / block-size Spacer را می‌خواند و نمایش می‌دهد */
const LiveInspector = defineComponent({
  name: 'LiveInspector',
  props: {
    direction: { type: String, default: 'horizontal' },
    size: { type: String, default: 'md' },
    grow: { type: Boolean, default: false }
  },
  setup(props) {
    const sp = ref<any>(null)
    const dims = reactive({ iw: 0, ih: 0 })
    let ro: ResizeObserver | null = null

    const measure = () => {
      const el: HTMLElement | undefined = sp.value?.$el
      if (!el) return
      const r = el.getBoundingClientRect()
      dims.iw = Math.round(r.width)
      dims.ih = Math.round(r.height)
    }

    onMounted(() => {
      nextTick(measure)
      const el: HTMLElement | undefined = sp.value?.$el
      if (!el) return
      ro = new ResizeObserver(measure)
      ro.observe(el)
      window.addEventListener('resize', measure)
    })
    onBeforeUnmount(() => {
      ro?.disconnect()
      window.removeEventListener('resize', measure)
    })

    watch(() => [props.direction, props.size, props.grow], () => nextTick(measure))

    return { sp, dims }
  },
  template: `
    <div style="display:grid; gap:8px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <Chip label="A" />
        <BaseSpacer ref="sp" :direction="direction" :size="size" :grow="grow"
          :style="direction==='horizontal'
            ? 'background:#c7d2fe; height:6px;'
            : direction==='vertical'
              ? 'background:#c7d2fe; inline-size:6px;'
              : 'background:#c7d2fe;'"
        />
        <Chip label="B" />
      </div>
      <div style="display:flex; gap:12px; font:12px/1.2 system-ui; color:#334155">
        <div>inline-size: <b>{{ dims.iw }}px</b></div>
        <div>block-size: <b>{{ dims.ih }}px</b></div>
      </div>
    </div>
  `,
  components: { BaseSpacer, Chip }
})

/** جدول نگاشت توکن‌های size به px (افقی/عمودی) – ساده و پایدار */
const TokenTable = defineComponent({
  name: 'TokenTable',
  template: `
    <div style="display:grid; gap:12px;">
      <div style="font:600 13px/1 system-ui; color:#0f172a">Token sizes reference</div>
      <div style="display:grid; gap:10px;">
        <div v-for="s in ['xs','sm','md','lg','xl','2xl','3xl','4xl']" :key="s" style="display:grid; gap:8px;">
          <div style="font:12px/1.2 system-ui; color:#334155">size={{s}}</div>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:70px; font:12px/1.2 system-ui; color:#64748b">horizontal</div>
            <BaseSpacer direction="horizontal" :size="s" style="background:#c7d2fe; height:6px; min-inline-size:6px;" />
          </div>
          <div style="display:flex; align-items:end; gap:8px;">
            <div style="width:70px; font:12px/1.2 system-ui; color:#64748b">vertical</div>
            <BaseSpacer direction="vertical" :size="s" style="background:#c7d2fe; inline-size:6px;" />
          </div>
        </div>
      </div>
      <div style="font:12px/1.4 system-ui; color:#475569">
        مقادیر دقیق به توکن‌های پروژه وابسته‌اند (مثلاً <code>--space-md</code>). برای اندازه‌های خیلی بزرگ fallback داریم.
      </div>
    </div>
  `,
  components: { BaseSpacer }
})

/** دفترچهٔ Propها با نمونهٔ کوچک برای هر Prop */
const PropDeck = defineComponent({
  name: 'PropDeck',
  components: { BaseSpacer, Frame, Chip },
  template: `
    <div style="display:grid; gap:16px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
      <Frame title="direction">
        <div style="display:flex; gap:12px; align-items:center;">
          <Chip label="Inline A" />
          <BaseSpacer direction="horizontal" size="lg" style="background:#c7d2fe; height:6px;" />
          <Chip label="Inline B" />
        </div>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:6px;">
          <Chip label="Top" />
          <BaseSpacer direction="vertical" size="lg" style="background:#c7d2fe; inline-size:6px;" />
          <Chip label="Bottom" />
        </div>
      </Frame>

      <Frame title="size (tokens)">
        <div style="display:flex; flex-direction:column; gap:10px;">
          <BaseSpacer v-for="s in ['xs','sm','md','lg','xl']" :key="s" direction="horizontal" :size="s" style="background:#c7d2fe; height:6px;" />
        </div>
      </Frame>

      <Frame title="width / height (override)">
        <div style="display:flex; gap:12px; align-items:center;">
          <Chip label="A" />
          <BaseSpacer direction="horizontal" :width="80" style="background:#c7d2fe; height:6px;" />
          <Chip label="B" />
        </div>
        <div style="display:flex; gap:12px; align-items:end;">
          <Chip label="Top" />
          <BaseSpacer direction="vertical" :height="48" style="background:#c7d2fe; inline-size:6px;" />
          <Chip label="Bottom" />
        </div>
      </Frame>

      <Frame title="min / max constraints">
        <div style="display:flex; gap:12px; align-items:center;">
          <Chip label="Left" />
          <BaseSpacer direction="horizontal" :min="40" :max="120" style="background:#c7d2fe; height:6px;" />
          <Chip label="Right" />
        </div>
      </Frame>

      <Frame title="grow (flex)">
        <div style="display:flex; gap:12px; align-items:center;">
          <Chip label="A" />
          <BaseSpacer direction="horizontal" grow style="background:#c7d2fe; height:6px;" />
          <Chip label="B" />
        </div>
      </Frame>

      <Frame title="aspectRatio + both">
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
          <BaseSpacer direction="both" size="xl" aspectRatio="1" style="background:#c7d2fe;" />
          <BaseSpacer direction="both" :width="120" :height="60" aspectRatio="2" style="background:#c7d2fe;" />
          <BaseSpacer direction="both" :width="80" :height="80" style="background:#c7d2fe;" />
        </div>
      </Frame>

      <Frame title="responsive (xs..xl)">
        <div style="display:flex; gap:12px; align-items:center;">
          <Chip label="Left" />
          <BaseSpacer
            direction="horizontal"
            :responsive="{ xs: 8, sm: 12, md: 24, lg: 40, xl: 64 }"
            style="background:#c7d2fe; height:6px;"
          />
          <Chip label="Right" />
        </div>
      </Frame>
    </div>
  `
})

/* ----------------------------------------------------------------------------------
   Meta (با Docs مثل BaseContainer + backgrounds)
-----------------------------------------------------------------------------------*/
const meta: Meta<typeof BaseSpacer> = {
  title: 'Layout/BaseSpacer/Guide',
  component: BaseSpacer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    backgrounds: {
      default: 'grid',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'gray',  value: '#f1f5f9' },
        { name: 'grid',  value: '#ffffff' },
      ]
    },
    docs: {
      description: {
        component:
`**BaseSpacer** برای ایجاد فاصله‌ی منعطف بین عناصر به‌کار می‌رود و RTL/LTR-safe است (با inline/block).

### قابلیت‌ها
- \`direction\`: \`horizontal\` (محور inline)، \`vertical\` (محور block)، \`both\`.
- \`size\`: مبتنی بر توکن‌های فاصله (\`xs..xl\`) + fallback برای \`2xl/3xl/4xl\`.
- ابعاد سفارشی: \`width\` / \`height\` و محدودیت‌ها: \`min\` / \`max\`.
- \`grow\`: پر کردن فضای باقیمانده در Flex.
- \`responsive\`: تعیین اندازه برای breakpoints (xs..xl) با CSS vars.
- \`aspectRatio\`: ساخت placeholderهای مربع/مستطیل (حالت \`both\`).

### مثال سریع
\`\`\`vue
<template>
  <div style="display:flex; align-items:center;">
    <span>Left</span>
    <BaseSpacer direction="horizontal" size="lg" />
    <span>Right</span>
  </div>
</template>
\`\`\`
`
      }
    }
  },
  decorators: [
    () => ({
      template: `
        <div style="
          min-height: 100vh;
          padding: 28px;
          background:
            linear-gradient(transparent 23px, rgba(60,60,60,.05) 24px) 0 0/100% 24px,
            linear-gradient(90deg, transparent 23px, rgba(60,60,60,.05) 24px) 0 0/24px 100%,
            #fff;
        ">
          <story />
        </div>
      `
    })
  ]
}
export default meta
type Story = StoryObj<typeof meta>

/* ----------------------------------------------------------------------------------
   Stories
-----------------------------------------------------------------------------------*/

export const Playground: Story = {
  args: { direction: 'horizontal', size: 'md', grow: false },
  render: (args) => ({
    components: { BaseSpacer, Frame, Chip, LegendBar },
    setup: () => ({ args }),
    template: `
      <Frame title="Playground" note="از Controls برای تغییر props استفاده کنید.">
        <LegendBar />
        <div style="display:flex; align-items:center; gap:8px;">
          <Chip label="A" />
          <BaseSpacer v-bind="args" style="background:#c7d2fe; height:6px;" />
          <Chip label="B" />
        </div>
      </Frame>
    `
  })
}

export const AxesAndDirections: Story = {
  render: () => ({
    components: { AxisGuide, Frame },
    template: `
      <div style="display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <Frame title="horizontal"><AxisGuide direction="horizontal" /></Frame>
        <Frame title="vertical"><AxisGuide direction="vertical" /></Frame>
        <Frame title="both"><AxisGuide direction="both" /></Frame>
      </div>
    `
  })
}

export const LiveSizeInspector: Story = {
  render: () => ({
    components: { LiveInspector, Frame },
    template: `
      <div style="display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
        <Frame title="Horizontal"><LiveInspector direction="horizontal" size="lg" /></Frame>
        <Frame title="Vertical"><LiveInspector direction="vertical" size="lg" /></Frame>
        <Frame title="Grow in flex"><LiveInspector direction="horizontal" size="sm" :grow="true" /></Frame>
      </div>
    `
  })
}

export const TokenSizesReference: Story = {
  render: () => ({
    components: { TokenTable, Frame },
    template: `<Frame title="Token sizes (visual)"><TokenTable /></Frame>`
  })
}

export const PropReferenceDeck: Story = {
  render: () => ({
    components: { PropDeck },
    template: `<PropDeck />`
  })
}

export const ResponsiveShowcase: Story = {
  render: () => ({
    components: { BaseSpacer, Frame, Chip },
    setup() {
      const ww = ref(0)
      const onResize = () => ww.value = window.innerWidth
      onMounted(() => { onResize(); window.addEventListener('resize', onResize) })
      onBeforeUnmount(() => window.removeEventListener('resize', onResize))
      return { ww }
    },
    template: `
      <Frame title="Resize canvas to observe responsive sizes"
             note="xs:8 → sm:12 → md:24 → lg:40 → xl:64 (وابسته به breakpoints پروژه)">
        <div style="font:12px/1.2 system-ui; color:#334155">width: <b>{{ ww }}px</b></div>
        <div style="display:flex; align-items:center; gap:12px;">
          <Chip label="Left" />
          <BaseSpacer
            direction="horizontal"
            :responsive="{ xs: 8, sm: 12, md: 24, lg: 40, xl: 64 }"
            style="background:#c7d2fe; height:6px;"
          />
          <Chip label="Right" />
        </div>
      </Frame>
    `
  })
}

export const RealWorldScenarios: Story = {
  render: () => ({
    components: { BaseSpacer, Frame, Chip },
    template: `
      <div style="display:grid; gap:24px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">

        <Frame title="Card layout">
          <div style="display:flex; align-items:center;">
            <strong>Header</strong>
            <BaseSpacer direction="horizontal" />
            <span style="color:#64748b">Meta</span>
          </div>
          <BaseSpacer direction="vertical" size="lg" />
          <div>Body content…</div>
          <BaseSpacer direction="vertical" size="md" />
          <div style="display:flex; gap:8px;">
            <button>Ok</button>
            <BaseSpacer direction="horizontal" />
            <button>Cancel</button>
          </div>
        </Frame>

        <Frame title="Sidebar + Content">
          <div style="display:flex; gap:12px;">
            <div style="inline-size:220px; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">Sidebar</div>
            <div style="flex:1; border:1px dashed #e2e8f0; border-radius:8px; padding:12px;">
              Content
              <BaseSpacer direction="vertical" size="xl" />
              Footer
            </div>
          </div>
        </Frame>

        <Frame title="Navbar">
          <nav style="display:flex; align-items:center; border:1px solid #e2e8f0; border-radius:10px; padding:8px;">
            <a href="#">Home</a>
            <BaseSpacer direction="horizontal" size="lg" />
            <a href="#">Docs</a>
            <BaseSpacer direction="horizontal" grow />
            <a href="#">Login</a>
          </nav>
        </Frame>

      </div>
    `
  })
}
