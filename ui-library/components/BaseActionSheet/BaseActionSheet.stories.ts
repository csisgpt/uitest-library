// BaseActionSheet.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
// import { within, userEvent, expect } from '@storybook/test'
import { ref, onMounted, onUnmounted, defineComponent, h } from 'vue'
import BaseActionSheet from './BaseActionSheet.vue'

/** --- آیکن نمونه (کامپوننت) برای تست prop icon (object component) --- */
const IconShare = defineComponent({
  name: 'IconShare',
  setup() {
    return () =>
      h(
        'svg',
        { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
        [h('circle', { cx: 18, cy: 5, r: 3 }), h('circle', { cx: 6, cy: 12, r: 3 }), h('circle', { cx: 18, cy: 19, r: 3 }), h('path', { d: 'M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49' })]
      )
  },
})

const meta: Meta<typeof BaseActionSheet> = {
  title: 'FEEDBACK/BaseActionSheet',
  component: BaseActionSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'Action Sheet با Vue 3 + TS و CSS Modules که تمام حالت‌های رایج (تریگر، هدر، Async، RTL، Dark، اسکرول داخلی، آیکن، Badge، Disabled، بدون‌تلپورت و …) را پوشش می‌دهد.',
      },
    },
    // هندل خودکار ایونت‌ها در پنل Actions
    actions: {
      handles: [
        'open',
        'close',
        'before-open',
        'after-open',
        'before-close',
        'after-close',
        'action-click',
        'update:modelValue',
      ],
    },
  },
  argTypes: {
    modelValue: { control: 'boolean' },
    trigger: { control: 'inline-radio', options: ['click', 'manual'] },
    disabled: { control: 'boolean' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    triggerText: { control: 'text' },
    actions: { control: 'object' },
    showCloseButton: { control: 'boolean' },
    showCancel: { control: 'boolean' },
    cancelText: { control: 'text' },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    shouldTeleport: { control: 'boolean' },
    transition: { control: 'text' },
    triggerClass: { control: 'text' },
    actionSheetClass: { control: 'text' },
    headerClass: { control: 'text' },
    // اسلات‌ها از کنترل خارج‌اند؛ در استوری‌های اختصاصی Demo می‌گذاریم
  },
  args: {
    modelValue: false,
    trigger: 'click',
    disabled: false,
    title: 'گزینه‌های عملیات',
    subtitle: 'یک مورد را انتخاب کنید',
    triggerText: 'باز کردن اکشن‌شیت',
    showCloseButton: true,
    showCancel: true,
    cancelText: 'لغو',
    closeOnOverlayClick: true,
    closeOnEscape: true,
    shouldTeleport: true,
    transition: 'action-sheet',
    actions: [
      { id: 'edit', text: 'ویرایش', description: 'ویرایش آیتم انتخابی', icon: '✏️' },
      { id: 'share', text: 'اشتراک‌گذاری', description: 'ارسال برای دیگران', icon: IconShare, badge: 'جدید' },
      { id: 'delete', text: 'حذف', role: 'destructive', description: 'غیرقابل بازگشت', icon: '🗑️' },
    ],
  },
}
export default meta
type Story = StoryObj<typeof BaseActionSheet>

/** کمک‌تابع رندر با v-model کنترل‌شده */
const withVModel =
  (templateSlots?: string) =>
  (args: any) => ({
    components: { BaseActionSheet, IconShare },
    setup() {
      const value = ref<boolean>(args.modelValue)
      return { args, value }
    },
    template: `
      <div style="min-height: 240px; display:flex; align-items:center; justify-content:center;">
        <BaseActionSheet
          v-bind="args"
          v-model="value"
        >
          ${templateSlots ?? ''}
        </BaseActionSheet>
      </div>
    `,
  })

/* 1) پیش‌فرض */
export const Default: Story = {
  render: withVModel(),
}

/* 2) لیست طولانی + اسکرول داخلی */
export const LongList: Story = {
  render: withVModel(),
  args: {
    title: 'لیست بلند',
    subtitle: 'اسکرول داخلی را مشاهده کنید',
    actions: Array.from({ length: 32 }, (_, i) => ({
      id: `a-${i + 1}`,
      text: `اکشن شماره ${i + 1}`,
      description: i % 3 === 0 ? 'توضیح نمونه' : undefined,
      disabled: i % 10 === 0,
    })),
  },
}

/* 3) اکشن‌های تخریبی/غیرفعال/Badge و آیکن‌های متنوع */
export const VariantsAndIcons: Story = {
  render: withVModel(),
  args: {
    actions: [
      { id: 'copy', text: 'کپی', icon: '📋' },
      { id: 'rename', text: 'تغییر نام', disabled: true, description: 'مجوز ندارید', icon: '🔒' },
      { id: 'move', text: 'جابجایی', badge: 'Beta', icon: '📦' },
      { id: 'link', text: 'گرفتن لینک', icon: IconShare },
      { id: 'delete', text: 'حذف', role: 'destructive', description: 'غیرقابل بازگشت', icon: '🗑️' },
    ],
  },
}

/* 4) تریگر سفارشی (اسلات trigger) */
export const CustomTrigger: Story = {
  render: withVModel(`
    <template #trigger="{ isOpen, open }">
      <button
        style="padding: 10px 16px; border-radius: 10px; border: 1px solid var(--color-primary); background: transparent; color: var(--color-primary);"
        @click="open"
      >
        {{ isOpen ? 'باز است' : 'تریگر سفارشی' }}
      </button>
    </template>
  `),
}

/* 5) حالت دستی (trigger='manual') + API برنامه‌ای با ref از بیرون (کنترل شده) */
export const ManualTrigger: Story = {
  render: (args: any) => ({
    components: { BaseActionSheet },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div style="display:flex; gap:12px; align-items:center;">
        <button style="padding:8px 12px; border-radius:8px; border:1px solid var(--color-border);" @click="open = true">باز کن (دستی)</button>
        <button style="padding:8px 12px; border-radius:8px; border:1px solid var(--color-border);" @click="open = false">ببند (دستی)</button>

        <BaseActionSheet
          v-bind="args"
          :trigger="'manual'"
          v-model="open"
        />
      </div>
    `,
  }),
  args: { trigger: 'manual' },
}

/* 6) پایدار: بدون دکمه Cancel و غیرقابل بستن با Overlay/Escape */
export const Persistent: Story = {
  render: withVModel(),
  args: {
    showCancel: false,
    closeOnOverlayClick: false,
    closeOnEscape: false,
    title: 'پنجره پایدار',
    subtitle: 'فقط با اکشن‌ها یا کنترل بیرونی بسته می‌شود',
  },
}

/* 7) اکشن‌های Async + نمایش لودینگ در Story (با تغییر متن/Badge موقتی) */
export const AsyncActions: Story = {
  render: (args: any) => ({
    components: { BaseActionSheet },
    setup() {
      const val = ref(false)
      const working = ref(false)
      const actions = [
        {
          id: 'download',
          text: () => (working.value ? 'در حال دانلود…' : 'دانلود'),
          description: '۳ ثانیه زمان می‌برد',
          badge: () => (working.value ? 'در حال انجام' : undefined),
          async handler() {
            working.value = true
            await new Promise((r) => setTimeout(r, 3000))
            working.value = false
          },
        },
        { id: 'share', text: 'اشتراک‌گذاری' },
        { id: 'cancel', text: 'انصراف', role: 'cancel' },
      ]
      // map reactive into plain actions for component
      const mapped = () =>
        actions.map((a) => ({
          ...a,
          text: typeof a.text === 'function' ? a.text() : a.text,
          badge: typeof a.badge === 'function' ? a.badge() : a.badge,
        }))
      return { args, val, working, mapped }
    },
    template: `
      <BaseActionSheet
        v-bind="{...args, actions: mapped() }"
        v-model="val"
        title="اکشن Async با شبیه‌سازی لودینگ"
      />
    `,
  }),
}

/* 8) هدر سفارشی (اسلات header) */
export const CustomHeaderSlot: Story = {
  render: withVModel(`
    <template #header="{ close }">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:16px;">
        <div style="font-weight:700;">سربرگ سفارشی</div>
        <button @click="close" style="border:none; background:transparent; padding:8px; cursor:pointer;">✕</button>
      </div>
    </template>
  `),
  args: { title: undefined, subtitle: undefined },
}

/* 9) محتوای پیش‌فرض سفارشی (جایگزین لیست اکشن‌ها) با اسلات default */
export const CustomContentSlot: Story = {
  render: withVModel(`
    <div style="padding: 16px;">
      <p style="margin:0 0 8px">محتوای سفارشی شما اینجاست ✨</p>
      <button style="padding:8px 12px; border-radius:8px; border:1px solid var(--color-border);">دکمهٔ ۱</button>
    </div>
  `),
  args: { actions: [] },
}

/* 10) بدون Teleport (نمایش داخل کانتینر محلی + تست z-index) */
export const NoTeleport: Story = {
  render: (args: any) => ({
    components: { BaseActionSheet },
    setup() {
      const value = ref(false)
      return { args, value }
    },
    template: `
      <div style="position:relative; border:1px dashed var(--color-border); padding:24px; width:360px; height:320px; overflow:hidden;">
        <div style="position:absolute; top:8px; right:8px; opacity:0.7;">Header محلی</div>
        <BaseActionSheet v-bind="args" v-model="value" />
      </div>
    `,
  }),
  args: { shouldTeleport: false, triggerText: 'باز کن (بدون Teleport)' },
}

/* 11) چند اکشن‌شیت هم‌زمان در صفحه */
export const MultipleSheets: Story = {
  render: (args: any) => ({
    components: { BaseActionSheet },
    setup() {
      const v1 = ref(false)
      const v2 = ref(false)
      return { args, v1, v2 }
    },
    template: `
      <div style="display:flex; gap:24px;">
        <BaseActionSheet
          v-bind="args"
          v-model="v1"
          :triggerText="'شیت ۱'"
          :title="'گزینه‌های ۱'"
        />
        <BaseActionSheet
          v-bind="args"
          v-model="v2"
          :triggerText="'شیت ۲'"
          :title="'گزینه‌های ۲'"
          :actions="[{ id:'info', text:'اطلاعات' }, { id:'cancel', text:'انصراف', role:'cancel' }]"
        />
      </div>
    `,
  }),
}

/* 12) کلاس‌های سفارشی برای Container/Header (دموی استایل‌پذیری) */
export const CustomClassesStyling: Story = {
  render: withVModel(`
    <style>
      .demoSheet {
        border: 2px dashed var(--color-primary);
      }
      .demoHeader {
        background: linear-gradient(90deg, rgba(0,0,0,0.03), transparent);
      }
    </style>
  `),
  args: {
    actionSheetClass: 'demoSheet',
    headerClass: 'demoHeader',
  },
}

/* 13) RTL */
export const RTL: Story = {
  render: withVModel(),
  args: { title: 'حالت راست‌به‌چپ' },
  decorators: [
    () => ({
      template: '<div dir="rtl"><story/></div>',
    }),
  ],
}

/* 14) Dark Mode */
export const DarkMode: Story = {
  render: withVModel(),
  args: { title: 'دارک مود' },
  decorators: [
    () => ({
      setup() {
        onMounted(() => document.documentElement.setAttribute('data-theme', 'dark'))
        onUnmounted(() => document.documentElement.removeAttribute('data-theme'))
        return {}
      },
      template: '<div><story/></div>',
    }),
  ],
}

/* 15) Disabled Trigger */
export const DisabledTrigger: Story = {
  render: withVModel(),
  args: { disabled: true },
}

/* 16) محلی‌سازی متن‌ها */
export const I18nLocalized: Story = {
  render: withVModel(),
  args: {
    triggerText: 'Open Sheet',
    title: 'Actions',
    subtitle: 'Choose one',
    cancelText: 'Cancel',
    actions: [
      { id: 'edit', text: 'Edit' },
      { id: 'share', text: 'Share' },
      { id: 'delete', text: 'Delete', role: 'destructive' },
    ],
  },
}

/* 17) کنترل‌شده از بیرون (Controlled) با دکمه‌های Parent */
export const ExternallyControlled: Story = {
  render: (args: any) => ({
    components: { BaseActionSheet },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
        <div style="display:flex; gap:8px;">
          <button style="padding:8px 12px; border:1px solid var(--color-border); border-radius:8px;" @click="open = true">باز کن</button>
          <button style="padding:8px 12px; border:1px solid var(--color-border); border-radius:8px;" @click="open = false">ببند</button>
        </div>
        <BaseActionSheet v-bind="args" v-model="open" :trigger="'manual'"/>
      </div>
    `,
  }),
}

/* 18) Empty State (بدون اکشن) + اسلات پیش‌فرض سفارشی Empty */
export const EmptyState: Story = {
  render: withVModel(`
    <div style="padding:24px; text-align:center; color: var(--color-muted);">
      فعلاً اکشنی موجود نیست.
    </div>
  `),
  args: { actions: [] },
}

/* 19) تست تعاملی کیبورد: Enter/Space/Arrow/Escape */
// export const KeyboardInteractions: Story = {
//   ...Default,
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement as HTMLElement)

//     await step('بازکردن با کلیک روی تریگر', async () => {
//       const trigger = await canvas.findByRole('button', { name: /باز کردن اکشن‌شیت/i })
//       await userEvent.click(trigger)
//       await expect(await canvas.findByRole('dialog')).toBeInTheDocument()
//     })

//     await step('پیمایش بین اکشن‌ها با ArrowDown/ArrowUp', async () => {
//       // فوکوس روی اولین دکمهٔ اکشن قرار می‌گیرد
//       await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}')
//     })

//     await step('بستن با Escape', async () => {
//       await userEvent.keyboard('{Escape}')
//     })
//   },
// }

/* 20) تست تعاملی اکشن Async (فقط باز/کلیک/انتظار کوتاه) */
// export const AsyncPlayTest: Story = {
//   ...AsyncActions,
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement as HTMLElement)
//     await step('بازکردن', async () => {
//       const trigger = await canvas.findByRole('button')
//       await userEvent.click(trigger)
//     })
//     await step('کلیک روی "دانلود"', async () => {
//       const btn = await canvas.findByRole('button', { name: /دانلود|در حال دانلود/i })
//       await userEvent.click(btn)
//     })
//   },
// }
