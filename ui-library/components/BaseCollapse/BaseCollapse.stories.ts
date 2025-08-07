import BaseCollapse, { BaseCollapseGroup } from './BaseCollapse.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref } from 'vue'

const meta: Meta<typeof BaseCollapse> = {
  title: 'DataDisplay/BaseCollapse',
  component: BaseCollapse,
  args: {
    title: 'عنوان',
    modelValue: false,
    transition: 'collapse',
    showArrow: true,
    lazy: false,
    disabled: false,
    toggleOnHeaderClick: true,
  },
  argTypes: {
    title: { control: 'text' },
    modelValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
    transition: { control: 'select', options: ['collapse', 'fade', 'slide-down', 'none'] },
    showArrow: { control: 'boolean' },
    lazy: { control: 'boolean' },
    toggleOnHeaderClick: { control: 'boolean' },
  },
}
export default meta

const Template: StoryFn<typeof BaseCollapse> = (args) => ({
  components: { BaseCollapse },
  setup: () => ({ args }),
  template: `<BaseCollapse v-bind="args"><p style="padding:var(--space-md);">محتوا</p></BaseCollapse>`
})
export const Default = Template.bind({})

export const SlotHeader: StoryFn<typeof BaseCollapse> = (args) => ({
  components: { BaseCollapse },
  setup: () => ({ args }),
  template: `
  <BaseCollapse v-bind="args">
    <template #header><strong>سربرگ سفارشی</strong></template>
    <p style="padding:var(--space-md);">محتوا</p>
  </BaseCollapse>`
})

export const WithIcon: StoryFn<typeof BaseCollapse> = (args) => ({
  components: { BaseCollapse },
  setup: () => ({ args }),
  template: `<BaseCollapse v-bind="args" icon="fa fa-info"><p style="padding:var(--space-md);">با آیکن</p></BaseCollapse>`
})

export const LazyContent: StoryFn<typeof BaseCollapse> = (args) => ({
  components: { BaseCollapse },
  setup: () => ({ args }),
  template: `<BaseCollapse v-bind="args" lazy><p style="padding:var(--space-md);">بارگذاری تنبل</p></BaseCollapse>`
})

export const AccordionGroup: StoryFn = () => ({
  components: { BaseCollapseGroup },
  setup() {
    const expanded = ref<string[]>(['one'])
    const items = [
      { key: 'one', title: 'آیتم یک', content: 'متن یک' },
      { key: 'two', title: 'آیتم دو', content: 'متن دو' },
      { key: 'three', title: 'آیتم سه', content: 'متن سه', disabled: true },
    ]
    return { expanded, items }
  },
  template: `<BaseCollapseGroup v-model="expanded" :accordion="true" :items="items" />`
})

export const MultipleOpen: StoryFn = () => ({
  components: { BaseCollapseGroup },
  setup() {
    const expanded = ref<string[]>(['one'])
    const items = [
      { key: 'one', title: 'آیتم یک', content: 'متن یک' },
      { key: 'two', title: 'آیتم دو', content: 'متن دو' },
      { key: 'three', title: 'آیتم سه', content: 'متن سه' },
    ]
    return { expanded, items }
  },
  template: `<BaseCollapseGroup v-model="expanded" :accordion="false" :items="items" />`
})

export const Transitions: StoryFn = () => ({
  components: { BaseCollapse },
  template: `
  <div style="display:flex;flex-direction:column;gap:var(--space-md);max-width:300px;">
    <BaseCollapse title="Collapse" transition="collapse"><p style="padding:var(--space-md);">محتوا</p></BaseCollapse>
    <BaseCollapse title="Fade" transition="fade"><p style="padding:var(--space-md);">محتوا</p></BaseCollapse>
    <BaseCollapse title="Slide" transition="slide-down"><p style="padding:var(--space-md);">محتوا</p></BaseCollapse>
    <BaseCollapse title="None" transition="none"><p style="padding:var(--space-md);">محتوا</p></BaseCollapse>
  </div>`
})

export const DarkTheme: StoryFn = () => ({
  components: { BaseCollapse },
  template: `
  <div data-theme="dark" style="padding:var(--space-md);background:var(--color-surface);">
    <BaseCollapse title="دارک مود"><p style="padding:var(--space-md);">محتوا</p></BaseCollapse>
  </div>`
})

export const Disabled: StoryFn<typeof BaseCollapse> = (args) => ({
  components: { BaseCollapse },
  setup: () => ({ args }),
  template: `<BaseCollapse v-bind="args" disabled><p style="padding:var(--space-md);">غیرفعال</p></BaseCollapse>`
})

export const Controlled: StoryFn = () => ({
  components: { BaseCollapse },
  setup() {
    const open = ref(false)
    const toggle = () => (open.value = !open.value)
    return { open, toggle }
  },
  template: `
  <div>
    <button @click="toggle" style="margin-bottom:var(--space-sm);">تغییر</button>
    <BaseCollapse v-model="open" title="کنترل شده"><p style="padding:var(--space-md);">محتوا</p></BaseCollapse>
  </div>`
})
