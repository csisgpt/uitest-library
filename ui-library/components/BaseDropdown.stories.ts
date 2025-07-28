import BaseDropdown from './BaseDropdown.vue'
import type { Meta, StoryFn } from '@storybook/vue3'

// تنظیمات اصلی استوری‌بوک
const meta: Meta<typeof BaseDropdown> = {
  title: 'Form/BaseDropdown',
  component: BaseDropdown,
  args: {
    modelValue: null,
    items: [
      { title: 'Vue.js', value: 'vue' },
      { title: 'React', value: 'react' },
      { title: 'Svelte', value: 'svelte' },
      { title: 'Angular', value: 'angular' },
    ],
    placeholder: 'یک گزینه انتخاب کنید',
    label: 'فریم‌ورک',
    multiple: false,
    clearable: false,
    disabled: false,
    loading: false,
    variant: 'primary',
    size: 'md',
    itemTitle: 'title',
    itemValue: 'value',
    searchPlaceholder: 'جستجو...',
    errorMessage: '',
    successMessage: '',
    iconLeft: '',
    iconRight: '',
    fullWidth: false,
    rounded: false,
    block: false,
    hint: '',
    readonly: false,
  },
  argTypes: {
    modelValue: { control: 'object' },
    items: { control: 'object' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    multiple: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    rounded: { control: 'boolean' },
    block: { control: 'boolean' },
    readonly: { control: 'boolean' },
    variant: {
      control: 'select',
      options: [
        'primary', 'secondary', 'outline', 'ghost',
        'error', 'success', 'warning', 'info'
      ]
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    iconLeft: { control: 'text' },
    iconRight: { control: 'text' },
    errorMessage: { control: 'text' },
    successMessage: { control: 'text' },
    hint: { control: 'text' },
    itemTitle: { control: 'text' },
    itemValue: { control: 'text' },
    searchPlaceholder: { control: 'text' },
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

// یک کامپوننت Wrapper برای هر استوری (حالت حرفه‌ای)
const Wrapper = (title: string, desc: string, slot: string) => `
  <div style="max-width:340px; margin:2rem auto; background:#fff; border-radius:14px; box-shadow:0 6px 32px #2222; padding:2rem 1.5rem; font-family:var(--font-family-base);">
    <div style="font-size:1.06rem; font-weight:600; color:var(--color-primary); margin-bottom:10px;">${title}</div>
    <div style="font-size:0.93rem; color:var(--color-muted); margin-bottom:18px;">${desc}</div>
    ${slot}
  </div>
`;

// استوری پایه
const Template: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'حالت پایه',
    'انتخاب یک مقدار از لیست. کنترل کامل props از سمت راست.',
    `<BaseDropdown v-bind="args" @update:modelValue="val => console.log('selected:', val)" />`
  ),
});
export const Default = Template.bind({});

// حالت چند انتخابی
export const MultipleSelect: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'چند انتخابی',
    'می‌توانید چند مقدار را همزمان انتخاب کنید. modelValue آرایه خواهد بود.',
    `<BaseDropdown v-bind="args" multiple clearable />`
  ),
});
MultipleSelect.args = { multiple: true, modelValue: ['vue'] };

// حالت آیکون
export const WithIcon: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'آیکون سفارشی',
    'نمایش آیکون (مثلاً FontAwesome) کنار لیست.',
    `<BaseDropdown v-bind="args" iconLeft="fa fa-cube" iconRight="fa fa-angle-down" />`
  ),
});

// حالت غیرفعال
export const Disabled: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'غیرفعال',
    'انتخاب غیرفعال شده است.',
    `<BaseDropdown v-bind="args" disabled modelValue="vue" />`
  ),
});
Disabled.args = { disabled: true, modelValue: 'vue' };

// حالت بارگذاری
export const Loading: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'در حال بارگذاری',
    'هنگام بارگذاری کامپوننت غیرقابل انتخاب است.',
    `<BaseDropdown v-bind="args" loading />`
  ),
});
Loading.args = { loading: true };

// پیام خطا
export const ErrorState: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'نمایش پیام خطا',
    'پیام خطا زیر لیست نمایش داده می‌شود.',
    `<BaseDropdown v-bind="args" errorMessage="انتخاب شما صحیح نیست." />`
  ),
});
ErrorState.args = { errorMessage: 'انتخاب شما صحیح نیست.' };

// پیام موفقیت
export const SuccessState: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'نمایش پیام موفقیت',
    'پیام موفقیت سبز زیر لیست نمایش داده می‌شود.',
    `<BaseDropdown v-bind="args" successMessage="عملیات موفقیت‌آمیز بود." />`
  ),
});
SuccessState.args = { successMessage: 'عملیات موفقیت‌آمیز بود.' };

// حالت همه استایل‌ها (variants)
export const Variants: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  data: () => ({
    variants: [
      'primary', 'secondary', 'outline', 'ghost', 'error', 'success', 'warning', 'info'
    ]
  }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div v-for="v in variants" :key="v">
        ${Wrapper(
          '{{ v }}',
          'variant: ' + '{{ v }}',
          `<BaseDropdown v-bind="{ ...args, variant: v, label: 'استایل ' + v }" />`
        )}
      </div>
    </div>
  `,
});

// حالت همه سایزها
export const Sizes: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  data: () => ({ sizes: ['sm', 'md', 'lg'] }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div v-for="s in sizes" :key="s">
        ${Wrapper(
          '{{ s }}',
          'سایز: ' + '{{ s }}',
          `<BaseDropdown v-bind="{ ...args, size: s, label: 'سایز ' + s }" />`
        )}
      </div>
    </div>
  `,
});

// اسلات گزینه سفارشی
export const CustomOptionSlot: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'اسلات سفارشی گزینه',
    'ظاهر هر گزینه را با اسلات تغییر دهید.',
    `
    <BaseDropdown v-bind="args" clearable>
      <template #option="{ option }">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <span style="font-weight: 600; color: var(--color-primary);">{{ option.title }}</span>
          <span style="font-size: 0.84rem; color: var(--color-muted);">{{ option.value }}</span>
        </div>
      </template>
    </BaseDropdown>
    `
  ),
});

// راهنما
export const WithHint: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'نمایش راهنما',
    'پیام کمکی زیر کامپوننت.',
    `<BaseDropdown v-bind="args" hint="لطفاً یک گزینه انتخاب کنید." />`
  ),
});
WithHint.args = { hint: 'لطفاً یک گزینه انتخاب کنید.' };

// فقط خواندنی
export const Readonly: StoryFn = (args) => ({
  components: { BaseDropdown },
  setup: () => ({ args }),
  template: Wrapper(
    'صرفاً خواندنی',
    'کاربر فقط می‌تواند مقدار را مشاهده کند.',
    `<BaseDropdown v-bind="args" readonly modelValue="react" />`
  ),
});
Readonly.args = { readonly: true, modelValue: 'react' };
