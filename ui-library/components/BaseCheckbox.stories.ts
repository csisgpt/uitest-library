import BaseCheckbox from './BaseCheckbox.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref, watch , computed } from 'vue'

const meta: Meta<typeof BaseCheckbox> = {
  title: 'Form/BaseCheckbox',
  component: BaseCheckbox,
  args: {
    modelValue: false,
    label: 'شرایط را می‌پذیرم',
    disabled: false,
    color: 'var(--color-primary)',
    size: 'medium',
    indeterminate: false,
    advancedAnimation: true,
    showStatus: true,
  },
  argTypes: {
    modelValue: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    color: { control: 'color' },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
    indeterminate: { control: 'boolean' },
    advancedAnimation: { control: 'boolean' },
    showStatus: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f7f7fb' },
        { name: 'dark', value: '#222b45' },
      ],
    },
  },
}
export default meta

// یک کارت تمیز برای هر استوری
const Card = (title: string, desc: string, slot: string) => `
  <div style="
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 32px #2222;
    padding: 2rem 1.5rem;
    max-width: 340px;
    margin: 2rem auto;
    font-family: var(--font-family-base);
  ">
    <div style="font-size:1.08rem; font-weight:600; color:var(--color-primary); margin-bottom:8px;">
      ${title}
    </div>
    <div style="font-size:0.93rem; color:var(--color-muted); margin-bottom:18px;">
      ${desc}
    </div>
    ${slot}
  </div>
`

// ✔️ Template مرکزی برای هر استوری
const Template: StoryFn = (args) => ({
  components: { BaseCheckbox },
  setup() {
    const value = ref(args.modelValue)
    watch(() => args.modelValue, (val) => { value.value = val })
    return { args, value }
  },
  template: Card(
    'چک‌باکس مدرن',
    'تغییر مقدار هم با کلیک و هم با Controls کاملاً دوطرفه.',
    `<BaseCheckbox v-bind="args" v-model="value" />`
  ),
})

export const Default = Template.bind({})

export const Sizes: StoryFn = (args) => ({
  components: { BaseCheckbox },
  setup() {
    const value1 = ref(false)
    const value2 = ref(true)
    const value3 = ref(false)
    return { args, value1, value2, value3 }
  },
  template: Card(
    'سایزهای مختلف',
    'کوچک، متوسط و بزرگ؛ با تیک SVG کاملاً وسط.',
    `
      <div style="display:flex; flex-direction:column; gap:28px; align-items:flex-start;">
        <BaseCheckbox v-bind="args" v-model="value1" size="small" label="کوچک" />
        <BaseCheckbox v-bind="args" v-model="value2" size="medium" label="متوسط" />
        <BaseCheckbox v-bind="args" v-model="value3" size="large" label="بزرگ" />
      </div>
    `
  ),
})

export const Disabled = Template.bind({})
Disabled.args = { disabled: true }

export const Indeterminate: StoryFn = (args) => ({
  components: { BaseCheckbox },
  setup() {
    const value = ref(false)
    return { args, value }
  },
  template: Card(
    'indeterminate',
    'برای حالت‌های ناتمام، با خط وسط.',
    `<BaseCheckbox v-bind="args" v-model="value" indeterminate label="انتخاب ناتمام" />`
  ),
})
Indeterminate.args = { indeterminate: true }

export const WithoutStatus = Template.bind({})
WithoutStatus.args = { showStatus: false }

export const CustomColor: StoryFn = (args) => ({
  components: { BaseCheckbox },
  setup() {
    const value = ref(false)
    return { args, value }
  },
  template: Card(
    'رنگ سفارشی',
    'accent-color چک‌باکس را تغییر بده.',
    `<BaseCheckbox v-bind="args" v-model="value" color="#eab308" label="چک‌باکس زرد" />`
  ),
})
CustomColor.args = { color: '#eab308' }

export const Animated = Template.bind({})
Animated.args = { advancedAnimation: true, label: 'انیمیشن فعال' }

export const CustomStatusSlot: StoryFn = (args) => ({
  components: { BaseCheckbox },
  setup() {
    const value = ref(args.modelValue)
    watch(() => args.modelValue, (val) => { value.value = val })
    return { args, value }
  },
  template: Card(
    'اسلات وضعیت سفارشی',
    'status را کاملاً سفارشی کن.',
    `
      <BaseCheckbox v-bind="args" v-model="value">
        <template #status>
          <span v-if="value" style="color:var(--color-success);font-weight:700">✓ تایید شد</span>
          <span v-else style="color:var(--color-error);font-weight:700">✗ انتخاب نشده</span>
        </template>
      </BaseCheckbox>
    `
  ),
})

export const TriState: StoryFn = (args) => ({
  components: { BaseCheckbox },
  setup() {
    // state: 0 = unchecked, 1 = indeterminate, 2 = checked
    const state = ref(1)
    const checked = computed(() => state.value === 2)
    const indeterminate = computed(() => state.value === 1)

    function handleToggle() {
      state.value = (state.value + 1) % 3 // هر بار کلیک، وضعیت عوض میشه
    }

    return { args, checked, indeterminate, handleToggle }
  },
  template: Card(
    'سه‌حالته (indeterminate + checked + unchecked)',
    'با هر کلیک، وضعیت بین سه حالت جابجا می‌شود.',
    `
      <BaseCheckbox
        v-bind="args"
        :model-value="checked"
        :indeterminate="indeterminate"
        @click="handleToggle"
        label="چک‌باکس سه‌حالته (کلیک کنید)"
      />
      <div style="margin-top:1rem;">
        وضعیت: 
        <span v-if="indeterminate">indeterminate</span>
        <span v-else-if="checked">checked</span>
        <span v-else>unchecked</span>
      </div>
    `
  ),
})


export const Playground = Template.bind({})
Playground.args = {
  label: 'Playground',
  color: 'var(--color-primary)',
  size: 'medium',
  disabled: false,
  indeterminate: false,
  advancedAnimation: true,
  showStatus: true,
}
