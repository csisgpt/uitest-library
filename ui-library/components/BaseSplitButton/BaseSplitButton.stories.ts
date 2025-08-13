import type { Meta, StoryObj } from '@storybook/vue3'
import BaseSplitButton, { type SplitItem } from './BaseSplitButton.vue'

const meta: Meta<typeof BaseSplitButton> = {
  title: 'SplitButton',
  component: BaseSplitButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['solid','soft','outline','ghost','link','text'] },
    tone: { control: 'select', options: ['primary','secondary','success','warning','info','error','neutral'] },
    size: { control: 'select', options: ['sm','md','lg'] },
    placement: { control: 'select', options: ['auto','bottom-start','bottom-end','top-start','top-end'] },
    matchTriggerWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    label: { control: 'text' },
    icon: { control: 'text' },
    menuAriaLabel: { control: 'text' },
    onClick: { action: 'click' },
    onOpen: { action: 'open' },
    onClose: { action: 'close' },
    onSelect: { action: 'select' },
  },
  args: {
    label: 'اقدام',
    variant: 'solid',
    tone: 'primary',
    size: 'md',
    placement: 'auto',
    matchTriggerWidth: true,
    items: [
      { label: 'ویرایش', icon: 'i-mdi-pencil' },
      { label: 'اشتراک‌گذاری', icon: 'i-mdi-share-variant' },
      { divider: true },
      { label: 'حذف', icon: 'i-mdi-delete', danger: true },
    ] as SplitItem[],
  },
}

export default meta
type Story = StoryObj<typeof BaseSplitButton>

export const Playground: Story = {
  render: (args: any) => ({
    components: { BaseSplitButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
        <BaseSplitButton v-bind="args"
          @click="args.onClick"
          @open="args.onOpen"
          @close="args.onClose"
          @select="args.onSelect"
        />
      </div>
    `,
  }),
}

export const VariantsTones: Story = {
  render: () => ({
    components: { BaseSplitButton },
    template: `
      <div style="display:grid; gap:12px;">
        <div v-for="variant in ['solid','soft','outline','ghost']" :key="variant" style="display:flex; gap:8px; flex-wrap:wrap;">
          <strong style="min-width:90px;">{{ variant }}</strong>
          <BaseSplitButton
            v-for="tone in ['primary','secondary','success','warning','info','error','neutral']"
            :key="tone+variant"
            :label="tone"
            :variant="variant"
            :tone="tone"
            :items="[
              { label:'نمایش', icon:'i-mdi-eye' },
              { label:'کپی لینک', icon:'i-mdi-link' },
              { divider:true },
              { label:'حذف', icon:'i-mdi-delete', danger:true }
            ]"
          />
        </div>
      </div>
    `,
  }),
}

export const CustomSlots: Story = {
  render: () => ({
    components: { BaseSplitButton },
    template: `
      <BaseSplitButton
        :variant="'soft'"
        :tone="'secondary'"
        :items="[
          { label:'دانلود PDF', icon:'i-mdi-file-pdf-box' },
          { label:'دانلود CSV', icon:'i-mdi-file-delimited' },
          { label:'دانلود XLSX', icon:'i-mdi-file-excel' }
        ]"
      >
        <template #button="{ onClick, disabled, loading }">
          <button
            @click="onClick"
            :disabled="disabled || loading"
            style="padding:8px 12px; border-radius:6px; border:1px dashed var(--color-secondary); background:transparent; color:var(--color-text);"
          >
            دکمه سفارشی
          </button>
        </template>

        <template #item="{ item }">
          <span style="display:inline-flex; gap:8px; align-items:center;">
            <i v-if="item.icon" :class="item.icon" aria-hidden="true"></i>
            <span>{{ item.label }}</span>
          </span>
        </template>
      </BaseSplitButton>
    `,
  }),
}

/** تست تعاملی ساده: بازکردن منو و انتخاب آیتم اول */
export const WithPlay: Story = {
  render: (args: any) => ({
    components: { BaseSplitButton },
    setup: () => ({ args }),
    template: `<BaseSplitButton v-bind="args" />`,
  }),
  play: async ({ canvasElement }) => {
    // نمونه ساده (اجرای کامل به test-runner شما بستگی دارد)
    const toggle = canvasElement.querySelector('[data-part="toggle"]') as HTMLElement
    toggle?.click()
    // انتخاب آیتم اول
    setTimeout(() => {
      const first = canvasElement.querySelector('[role="menuitem"]') as HTMLElement
      first?.click()
    }, 50)
  },
}
