import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import BaseGrid from './BaseGrid.vue'
import BaseGridItem from './BaseGridItem/BaseGridItem.vue'

/* ---------------------------------------------
   Local demo helpers
---------------------------------------------- */
const Card = defineComponent({
  name: 'DemoCard',
  props: { label: { type: String, required: true } },
  template: `
    <div style="
      background:#fff; border:1px solid #e2e8f0; border-radius:10px;
      padding:12px; text-align:center; color:#0f172a; font:500 12px/1 system-ui;
      box-shadow:0 2px 6px rgba(2,8,23,.06)">
      {{ label }}
    </div>
  `
})

const Section = defineComponent({
  name: 'Section',
  props: { title: { type: String, default: '' }, note: { type: String, default: '' } },
  template: `
    <section style="border:1px solid #e2e8f0; border-radius:12px; padding:16px; background:#fff;
                    box-shadow:0 6px 18px rgba(2,8,23,.06);">
      <header v-if="title" style="font:600 13px/1 system-ui; color:#0f172a; margin-bottom:10px;">
        {{ title }}
      </header>
      <div style="display:grid; gap:12px;"><slot /></div>
      <footer v-if="note" style="margin-top:8px; font:12px/1.4 system-ui; color:#475569;">{{ note }}</footer>
    </section>
  `
})

/* ---------------------------------------------
   Meta (Docs مشابه BaseContainer)
---------------------------------------------- */
const meta: Meta<typeof BaseGrid> = {
  title: 'Layout/BaseGrid/Full Showcase',
  component: BaseGrid,
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
`**BaseGrid** سیستم گرید واکنشیِ مبتنی بر CSS Grid:
- ستون‌های ۱..۱۲ یا \`auto\` (auto-fit) با \`minWidth/maxWidth\`.
- \`gap\` توکنی/سفارشی، \`align/justify\` آیتم‌ها، \`flow\` (row/column/dense).
- ریسپانسیو با \`responsive\` (sm/md/lg/xl) از طریق data-attrs.
- آیتم‌ها با **BaseGridItem**: \`colSpan/rowSpan/full\`، \`order\`، \`alignSelf/justifySelf\`، \`area\`.`
      }
    }
  },
  argTypes: {
    as: { control: 'text' },
    cols: { control: 'select', options: ['auto',1,2,3,4,5,6,7,8,9,10,11,12] },
    gap: { control: 'text' },
    align: { control: 'select', options: ['start','center','end','stretch'] },
    justify: { control: 'select', options: ['start','center','end','stretch'] },
    flow: { control: 'select', options: ['row','column','row-dense','column-dense'] },
    responsive: { control: 'object' },
    autoFit: { control: 'object' },
    customProperties: { control: 'object' },
    className: { control: 'text' }
  },
  decorators: [
    () => ({
      template: `
        <div style="
          min-height: 100vh; padding: 28px;
          background:
            linear-gradient(transparent 23px, rgba(60,60,60,.05) 24px) 0 0/100% 24px,
            linear-gradient(90deg, transparent 23px, rgba(60,60,60,.05) 24px) 0 0/24px 100%,
            #fff;">
          <story />
        </div>
      `
    })
  ]
}
export default meta
type Story = StoryObj<typeof meta>

/* ---------------------------------------------
   1) Playground (کنترل همه‌ی پراپ‌ها)
---------------------------------------------- */
export const Playground: Story = {
  args: {
    cols: 4,
    gap: 'md',
    align: 'stretch',
    justify: 'stretch',
    flow: 'row',
    responsive: { sm: 2, md: 3, lg: 4 }
  },
  render: (args) => ({
    components: { BaseGrid, BaseGridItem, Card, Section },
    setup: () => ({ args }),
    template: `
      <Section title="Playground" note="از Controls برای تغییر props استفاده کنید.">
        <BaseGrid v-bind="args" style="padding:20px;">
          <BaseGridItem v-for="i in 8" :key="i"><Card :label="'Item '+i" /></BaseGridItem>
        </BaseGrid>
      </Section>
    `
  })
}

/* ---------------------------------------------
   2) Columns Matrix (۱..۱۲)
---------------------------------------------- */
export const ColumnsMatrix: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Card, Section },
    template: `
      <div style="display:grid; gap:24px;">
        <Section v-for="c in 6" :key="c" :title="'cols='+(c*2)">
          <BaseGrid :cols="c*2" gap="sm">
            <BaseGridItem v-for="i in c*2" :key="i"><Card :label="'#'+i" /></BaseGridItem>
          </BaseGrid>
        </Section>
      </div>
    `
  })
}

/* ---------------------------------------------
   3) Gap Tokens + Custom lengths
---------------------------------------------- */
export const GapsShowcase: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Card, Section },
    template: `
      <div style="display:grid; gap:24px;">
        <Section v-for="g in ['none','xs','sm','md','lg','xl','2xl']" :key="g" :title="'gap='+g">
          <BaseGrid :cols="4" :gap="g">
            <BaseGridItem v-for="i in 8" :key="g+'-'+i"><Card :label="g+'-'+i" /></BaseGridItem>
          </BaseGrid>
        </Section>
        <Section title="gap='28px' (custom)">
          <BaseGrid :cols="4" gap="28px">
            <BaseGridItem v-for="i in 8" :key="'c-'+i"><Card :label="'c-'+i" /></BaseGridItem>
          </BaseGrid>
        </Section>
      </div>
    `
  })
}

/* ---------------------------------------------
   4) Auto-fit Gallery (min/max)
---------------------------------------------- */
export const AutoFitCards: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Card, Section },
    template: `
      <Section title="auto-fit: min 220px, max 1fr" note="عرض کانتینر را تغییر دهید.">
        <BaseGrid cols="auto" :autoFit="{ minWidth: '220px', maxWidth: '1fr' }" gap="lg">
          <BaseGridItem v-for="i in 10" :key="i"><Card :label="'Card '+i" /></BaseGridItem>
        </BaseGrid>
      </Section>
    `
  })
}

/* ---------------------------------------------
   5) Dense Packing (spanهای متفاوت)
---------------------------------------------- */
export const DensePacking: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Card, Section },
    template: `
      <Section title="Dense Packing (row-dense)">
        <BaseGrid :cols="6" gap="sm" flow="row-dense" style="align-items:start;">
          <!-- span های متفاوت برای پرشدن فضا -->
          <BaseGridItem v-for="i in 14" :key="i"
                        :colSpan="i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1"
                        :rowSpan="i % 4 === 0 ? 2 : 1"
                        :style="i % 4 === 0 ? 'height:120px' : 'height:auto'">
            <Card :label="'Item '+i" />
          </BaseGridItem>
        </BaseGrid>
      </Section>
    `
  })
}

/* ---------------------------------------------
   6) Alignment (align/justify)
---------------------------------------------- */
export const AlignmentShowcase: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Card, Section },
    template: `
      <div style="display:grid; gap:24px;">
        <Section title="align=center, justify=center">
          <BaseGrid :cols="4" gap="lg" align="center" justify="center" style="min-block-size:160px;">
            <BaseGridItem v-for="i in 4" :key="i"><Card :label="'C'+i" /></BaseGridItem>
          </BaseGrid>
        </Section>

        <Section title="align=end, justify=end">
          <BaseGrid :cols="4" gap="lg" align="end" justify="end" style="min-blocksize:160px;">
            <BaseGridItem v-for="i in 4" :key="'e'+i"><Card :label="'E'+i" /></BaseGridItem>
          </BaseGrid>
        </Section>
      </div>
    `
  })
}

/* ---------------------------------------------
   7) Responsive breakpoints (با نشانگر عرض)
---------------------------------------------- */
export const ResponsiveBreakpoints: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Card, Section },
    setup() {
      const ww = ref(0)
      const onResize = () => ww.value = window.innerWidth
      onMounted(() => { onResize(); window.addEventListener('resize', onResize) })
      onBeforeUnmount(() => window.removeEventListener('resize', onResize))
      return { ww }
    },
    template: `
      <Section title="Responsive (sm/md/lg/xl)" :note="'width: '+ww+'px'">
        <BaseGrid :cols="2" :responsive="{ sm: 2, md: 3, lg: 4, xl: 6 }" gap="md">
          <BaseGridItem v-for="i in 12" :key="i"><Card :label="'#'+i" /></BaseGridItem>
        </BaseGrid>
      </Section>
    `
  })
}

/* ---------------------------------------------
   8) RTL آزمایشی
---------------------------------------------- */
export const RTLMode: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Card, Section },
    template: `
      <Section title="RTL (dir='rtl')">
        <BaseGrid :cols="4" gap="md" dir="rtl" style="text-align:right;">
          <BaseGridItem v-for="i in 8" :key="i"><Card :label="'آیتم '+i" /></BaseGridItem>
        </BaseGrid>
      </Section>
    `
  })
}

/* ---------------------------------------------
   9) Grid Areas – داشبورد ساده
---------------------------------------------- */
export const DashboardAreas: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Card, Section },
    template: `
      <Section title="Grid Areas (Header/Nav/Main/Footer)">
        <BaseGrid :cols="12" gap="md"
          :style="{
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gridTemplateAreas: '\\'header header\\' \\'nav main\\' \\'footer footer\\''
          }">
          <BaseGridItem area="header"><Card label="Header" /></BaseGridItem>
          <BaseGridItem area="nav"><Card label="Nav" /></BaseGridItem>
          <BaseGridItem area="main"><Card label="Main" /></BaseGridItem>
          <BaseGridItem area="footer"><Card label="Footer" /></BaseGridItem>
        </BaseGrid>
      </Section>
    `
  })
}

/* ---------------------------------------------
   10) Form Two-Column (واقعی)
---------------------------------------------- */
export const TwoColumnForm: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Section },
    template: `
      <Section title="Two-column Form (responsive)">
        <BaseGrid :cols="12" :responsive="{ sm: 12, md: 12, lg: 12 }" gap="lg">
          <BaseGridItem :colSpan="6">
            <label>First name</label>
            <input style="display:block; width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:8px" />
          </BaseGridItem>
          <BaseGridItem :colSpan="6">
            <label>Last name</label>
            <input style="display:block; width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:8px" />
          </BaseGridItem>
          <BaseGridItem :colSpan="12">
            <label>Email</label>
            <input style="display:block; width:100%; padding:8px; border:1px solid #e2e8f0; border-radius:8px" />
          </BaseGridItem>
          <BaseGridItem :colSpan="12" style="text-align:right;">
            <button style="padding:8px 12px; border:1px solid #e2e8f0; border-radius:8px; background:#fff;">Submit</button>
          </BaseGridItem>
        </BaseGrid>
      </Section>
    `
  })
}

/* ---------------------------------------------
   11) Marketing Cards (Auto-fit + Content)
---------------------------------------------- */
export const MarketingCards: Story = {
  render: () => ({
    components: { BaseGrid, BaseGridItem, Section },
    template: `
      <Section title="Marketing Cards (auto-fit)">
        <BaseGrid cols="auto" :autoFit="{ minWidth: '260px', maxWidth: '1fr' }" gap="xl">
          <BaseGridItem v-for="i in 9" :key="i">
            <div style="display:grid; gap:8px; background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
              <div :style="{ background:'#c7d2fe', height:(120 + (i%3)*30)+'px' }"></div>
              <div style="padding:12px;">
                <div style="font:600 14px/1.2 system-ui; color:#0f172a">Card {{ i }}</div>
                <div style="font:12px/1.4 system-ui; color:#475569">Some description text…</div>
              </div>
            </div>
          </BaseGridItem>
        </BaseGrid>
      </Section>
    `
  })
}
