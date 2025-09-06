import type { Meta, StoryObj } from "@storybook/vue3";
import { ref, computed } from "vue";
import BaseSelect from "./BaseSelect.vue";

// Mock data for stories
const basicOptions = [
  "تهران",
  "اصفهان",
  "مشهد",
  "شیراز",
  "تبریز",
  "کرج",
  "اهواز",
  "قم",
  "کرمانشاه",
  "ارومیه",
];

const skillsOptions = [
  "Vue.js",
  "React",
  "Angular",
  "TypeScript",
  "JavaScript",
  "Python",
  "PHP",
  "Laravel",
  "Node.js",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "Git",
  "AWS",
  "Azure",
  "GraphQL",
  "REST API",
  "UI/UX Design",
];

const countriesOptions = [
  "افغانستان",
  "ایران",
  "عراق",
  "آذربایجان",
  "ارمنستان",
  "بحرین",
  "بنگلادش",
  "بوتان",
  "برونئی",
  "کامبوج",
  "چین",
  "قبرس",
  "گرجستان",
  "هند",
  "اندونزی",
  "ژاپن",
  "اردن",
  "قزاقستان",
  "کویت",
  "قرقیزستان",
  "لبنان",
  "مالزی",
  "مالدیو",
  "مغولستان",
  "میانمار",
  "نپال",
  "کره شمالی",
  "عمان",
  "پاکستان",
  "فلسطین",
  "فیلیپین",
  "قطر",
  "عربستان سعودی",
  "سنگاپور",
  "کره جنوبی",
  "سری‌لانکا",
  "سوریه",
  "تایوان",
  "تاجیکستان",
  "تایلند",
  "ترکیه",
  "ترکمنستان",
  "امارات متحده عربی",
  "ازبکستان",
  "ویتنام",
  "یمن",
];

const usersOptions = [
  {
    id: 1,
    name: "علی احمدی",
    email: "ali.ahmadi@example.com",
    role: "مدیر",
    active: true,
  },
  {
    id: 2,
    name: "فاطمه کریمی",
    email: "fateme.karimi@example.com",
    role: "توسعه‌دهنده",
    active: true,
  },
  {
    id: 3,
    name: "محمد رضایی",
    email: "mohammad.rezaei@example.com",
    role: "طراح",
    active: false,
  },
  {
    id: 4,
    name: "زهرا موسوی",
    email: "zahra.mousavi@example.com",
    role: "تحلیل‌گر",
    active: true,
  },
  {
    id: 5,
    name: "حسن صادقی",
    email: "hasan.sadeghi@example.com",
    role: "تست‌کننده",
    active: true,
  },
  {
    id: 6,
    name: "مریم جعفری",
    email: "maryam.jafari@example.com",
    role: "مدیر محصول",
    active: false,
  },
  {
    id: 7,
    name: "رضا نوری",
    email: "reza.nouri@example.com",
    role: "DevOps",
    active: true,
  },
  {
    id: 8,
    name: "سارا حسینی",
    email: "sara.hosseini@example.com",
    role: "UI/UX",
    active: true,
  },
];

const categoryOptions = [
  { value: "tech", label: "فناوری", icon: "💻", disabled: false },
  { value: "design", label: "طراحی", icon: "🎨", disabled: false },
  { value: "marketing", label: "بازاریابی", icon: "📈", disabled: false },
  { value: "sales", label: "فروش", icon: "💰", disabled: true },
  { value: "support", label: "پشتیبانی", icon: "🎧", disabled: false },
  { value: "hr", label: "منابع انسانی", icon: "👥", disabled: false },
  { value: "finance", label: "مالی", icon: "💼", disabled: true },
  { value: "legal", label: "حقوقی", icon: "⚖️", disabled: false },
];

// Generate large dataset for performance testing
const generateLargeDataset = (size: number) => {
  const names = [
    "احمد",
    "علی",
    "محمد",
    "حسن",
    "رضا",
    "مهدی",
    "امیر",
    "سعید",
    "فرهاد",
    "کیوان",
  ];
  const surnames = [
    "احمدی",
    "محمدی",
    "کریمی",
    "رضایی",
    "موسوی",
    "صادقی",
    "نوری",
    "حسینی",
    "جعفری",
    "یوسفی",
  ];

  return Array.from({ length: size }, (_, i) => {
    const name = names[i % names.length];
    const surname = surnames[Math.floor(i / names.length) % surnames.length];
    return {
      id: i + 1,
      value: `user_${i + 1}`,
      label: `${name} ${surname} ${i + 1}`,
      email: `${name.toLowerCase()}.${surname.toLowerCase()}${
        i + 1
      }@example.com`,
    };
  });
};

const meta: Meta<typeof BaseSelect> = {
  title: "FORM/BaseSelect",
  component: BaseSelect,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# BaseSelect Component

کامپوننت BaseSelect یک انتخابگر پیشرفته و کامل است که تمام قابلیت‌های مورد نیاز یک انتخابگر مدرن را فراهم می‌کند.

## ویژگی‌ها

- 🔥 انتخاب تکی و چندگانه
- 🔍 جستجو و فیلتر در گزینه‌ها
- 🎨 سه نوع استایل (default, outlined, filled)
- 📏 سه اندازه (small, medium, large)
- ♿ پشتیبانی کامل از accessibility
- ⌨️ پشتیبانی کامل از کیبورد
- 🌙 پشتیبانی از تم تاریک و روشن
- 📱 طراحی responsive
- 🚀 بهینه‌سازی شده برای عملکرد
- 🌍 پشتیبانی از RTL
- 🎯 TypeScript support

## استفاده

\`\`\`vue
<BaseSelect
  v-model="selectedValue"
  :options="options"
  label="انتخاب کنید"
  placeholder="گزینه‌ای را انتخاب کنید"
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "outlined", "filled"],
      description: "نوع ظاهری کامپوننت",
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "اندازه کامپوننت",
    },
    multiple: {
      control: { type: "boolean" },
      description: "امکان انتخاب چندگانه",
    },
    filterable: {
      control: { type: "boolean" },
      description: "امکان جستجو در گزینه‌ها",
    },
    clearable: {
      control: { type: "boolean" },
      description: "نمایش دکمه پاک کردن",
    },
    disabled: {
      control: { type: "boolean" },
      description: "غیرفعال کردن کامپوننت",
    },
    loading: {
      control: { type: "boolean" },
      description: "نمایش حالت بارگذاری",
    },
    invalid: {
      control: { type: "boolean" },
      description: "نمایش حالت خطا",
    },
    required: {
      control: { type: "boolean" },
      description: "اجباری بودن فیلد",
    },
    options: {
      control: { type: "object" },
      description: "آرایه گزینه‌ها",
    },
    placeholder: {
      control: { type: "text" },
      description: "متن راهنما",
    },
    label: {
      control: { type: "text" },
      description: "برچسب فیلد",
    },
    helpText: {
      control: { type: "text" },
      description: "متن راهنمای اضافی",
    },
    errorMessage: {
      control: { type: "text" },
      description: "پیام خطا",
    },
    emptyMessage: {
      control: { type: "text" },
      description: "پیام عدم وجود نتیجه",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default Story
export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: "شهری را انتخاب کنید",
    label: "شهر",
  },
  render: (args) => ({
    components: { BaseSelect },
    setup() {
      const selectedValue = ref(null);
      return { args, selectedValue };
    },
    template: `
      <div style="width: 300px;">
        <BaseSelect v-bind="args" v-model="selectedValue" />
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 14px;">
          <strong>انتخاب شده:</strong> {{ selectedValue || 'هیچ' }}
        </div>
      </div>
    `,
  }),
};

// Multiple Selection
export const Multiple: Story = {
  args: {
    options: skillsOptions,
    multiple: true,
    clearable: true,
    placeholder: "مهارت‌های خود را انتخاب کنید",
    label: "مهارت‌ها",
    helpText: "می‌توانید چندین مهارت انتخاب کنید",
  },
  render: (args) => ({
    components: { BaseSelect },
    setup() {
      const selectedValues = ref([]);
      return { args, selectedValues };
    },
    template: `
      <div style="width: 400px;">
        <BaseSelect v-bind="args" v-model="selectedValues" />
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 14px;">
          <strong>انتخاب شده:</strong> {{ selectedValues.length }} مورد
          <ul style="margin: 8px 0 0 0; padding: 0 0 0 20px;">
            <li v-for="item in selectedValues" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    `,
  }),
};

// Filterable/Searchable
export const Filterable: Story = {
  args: {
    options: countriesOptions,
    filterable: true,
    clearable: true,
    placeholder: "نام کشور را تایپ کنید",
    label: "کشور",
    emptyMessage: "کشوری با این نام یافت نشد",
  },
  render: (args) => ({
    components: { BaseSelect },
    setup() {
      const selectedValue = ref(null);
      return { args, selectedValue };
    },
    template: `
      <div style="width: 350px;">
        <BaseSelect v-bind="args" v-model="selectedValue" />
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 14px;">
          <strong>انتخاب شده:</strong> {{ selectedValue || 'هیچ' }}
        </div>
      </div>
    `,
  }),
};

// Object Options with Custom Template
export const ObjectOptions: Story = {
  args: {
    options: usersOptions,
    optionLabel: "name",
    optionValue: "id",
    optionDisabled: (option: any) => !option.active,
    filterable: true,
    clearable: true,
    placeholder: "یک کاربر انتخاب کنید",
    label: "کاربر",
  },
  render: (args) => ({
    components: { BaseSelect },
    setup() {
      const selectedValue = ref(null);
      const selectedUser = computed(() =>
        usersOptions.find((user) => user.id === selectedValue.value)
      );
      return { args, selectedValue, selectedUser };
    },
    template: `
      <div style="width: 400px;">
        <BaseSelect v-bind="args" v-model="selectedValue">
          <template #option="{ option }">
            <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
              <div style="
                width: 40px; 
                height: 40px; 
                border-radius: 50%; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: bold;
                font-size: 16px;
              ">
                {{ option.name.charAt(0) }}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 500; color: #1f2937;">{{ option.name }}</div>
                <div style="font-size: 12px; color: #6b7280;">{{ option.email }}</div>
                <div style="font-size: 11px; color: #9ca3af;">{{ option.role }}</div>
              </div>
              <div v-if="!option.active" style="
                padding: 2px 6px; 
                background: #fef2f2; 
                color: #dc2626; 
                border-radius: 4px; 
                font-size: 10px;
                font-weight: 500;
              ">
                غیرفعال
              </div>
            </div>
          </template>
        </BaseSelect>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 14px;">
          <strong>انتخاب شده:</strong>
          <div v-if="selectedUser" style="margin-top: 8px;">
            <div><strong>نام:</strong> {{ selectedUser.name }}</div>
            <div><strong>ایمیل:</strong> {{ selectedUser.email }}</div>
            <div><strong>نقش:</strong> {{ selectedUser.role }}</div>
          </div>
          <div v-else>هیچ کاربری انتخاب نشده</div>
        </div>
      </div>
    `,
  }),
};

// Size Variants
export const Sizes: Story = {
  render: () => ({
    components: { BaseSelect },
    setup() {
      const smallValue = ref(null);
      const mediumValue = ref(null);
      const largeValue = ref(null);
      return {
        basicOptions,
        smallValue,
        mediumValue,
        largeValue,
      };
    },
    template: `
      <div style="width: 400px; display: flex; flex-direction: column; gap: 24px;">
        <BaseSelect 
          v-model="smallValue"
          :options="basicOptions"
          size="small"
          label="سایز کوچک"
          placeholder="انتخاب کنید"
        />
        <BaseSelect 
          v-model="mediumValue"
          :options="basicOptions"
          size="medium"
          label="سایز متوسط (پیش‌فرض)"
          placeholder="انتخاب کنید"
        />
        <BaseSelect 
          v-model="largeValue"
          :options="basicOptions"
          size="large"
          label="سایز بزرگ"
          placeholder="انتخاب کنید"
        />
      </div>
    `,
  }),
};

// Style Variants
export const Variants: Story = {
  render: () => ({
    components: { BaseSelect },
    setup() {
      const defaultValue = ref(null);
      const outlinedValue = ref(null);
      const filledValue = ref(null);
      return {
        basicOptions,
        defaultValue,
        outlinedValue,
        filledValue,
      };
    },
    template: `
      <div style="width: 400px; display: flex; flex-direction: column; gap: 24px;">
        <BaseSelect 
          v-model="defaultValue"
          :options="basicOptions"
          variant="default"
          label="پیش‌فرض"
          placeholder="انتخاب کنید"
        />
        <BaseSelect 
          v-model="outlinedValue"
          :options="basicOptions"
          variant="outlined"
          label="Outlined"
          placeholder="انتخاب کنید"
        />
        <BaseSelect 
          v-model="filledValue"
          :options="basicOptions"
          variant="filled"
          label="Filled"
          placeholder="انتخاب کنید"
        />
      </div>
    `,
  }),
};

// States
export const States: Story = {
  render: () => ({
    components: { BaseSelect },
    setup() {
      const normalValue = ref(null);
      const loadingValue = ref(null);
      const disabledValue = ref(null);
      const invalidValue = ref(null);
      const isLoading = ref(false);

      const toggleLoading = () => {
        isLoading.value = !isLoading.value;
      };

      return {
        basicOptions,
        normalValue,
        loadingValue,
        disabledValue,
        invalidValue,
        isLoading,
        toggleLoading,
      };
    },
    template: `
      <div style="width: 400px; display: flex; flex-direction: column; gap: 24px;">
        <BaseSelect 
          v-model="normalValue"
          :options="basicOptions"
          label="حالت عادی"
          placeholder="انتخاب کنید"
          clearable
        />
        
        <div>
          <BaseSelect 
            v-model="loadingValue"
            :options="basicOptions"
            :loading="isLoading"
            label="در حال بارگذاری"
            placeholder="انتخاب کنید"
          />
          <button 
            @click="toggleLoading"
            style="
              margin-top: 8px; 
              padding: 6px 12px; 
              border: 1px solid #d1d5db; 
              border-radius: 6px; 
              background: #f9fafb; 
              cursor: pointer;
              font-size: 14px;
            "
          >
            {{ isLoading ? 'توقف' : 'شروع' }} بارگذاری
          </button>
        </div>
        
        <BaseSelect 
          v-model="disabledValue"
          :options="basicOptions"
          disabled
          label="غیرفعال"
          placeholder="انتخاب کنید"
        />
        
        <BaseSelect 
          v-model="invalidValue"
          :options="basicOptions"
          invalid
          required
          label="نامعتبر و اجباری"
          placeholder="انتخاب کنید"
          error-message="این فیلد اجباری است و باید پر شود"
        />
      </div>
    `,
  }),
};

// Advanced Features
export const Advanced: Story = {
  args: {
    options: categoryOptions,
    optionDisabled: "disabled",
    multiple: true,
    filterable: true,
    clearable: true,
    filter: (searchTerm: string, option: any) => {
      return (
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    placeholder: "دسته‌بندی‌ها را جستجو کنید",
    label: "دسته‌بندی",
    helpText: "برخی گزینه‌ها غیرفعال هستند",
    emptyMessage: "دسته‌بندی مورد نظر یافت نشد",
  },
  render: (args) => ({
    components: { BaseSelect },
    setup() {
      const selectedValues = ref([]);
      return { args, selectedValues };
    },
    template: `
      <div style="width: 400px;">
        <BaseSelect v-bind="args" v-model="selectedValues">
          <template #option="{ option }">
            <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
              <span style="font-size: 20px;">{{ option.icon }}</span>
              <span style="flex: 1;">{{ option.label }}</span>
              <span v-if="option.disabled" style="
                font-size: 10px; 
                padding: 2px 6px; 
                background: #fee2e2; 
                color: #dc2626; 
                border-radius: 4px;
                font-weight: 500;
              ">
                غیرفعال
              </span>
            </div>
          </template>
        </BaseSelect>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 14px;">
          <strong>انتخاب شده:</strong> {{ selectedValues.length }} مورد
          <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px;">
            <span 
              v-for="value in selectedValues" 
              :key="value"
              style="
                padding: 2px 8px; 
                background: #e0e7ff; 
                color: #3730a3; 
                border-radius: 12px; 
                font-size: 12px;
                font-weight: 500;
              "
            >
              {{ categoryOptions.find(opt => opt.value === value)?.label }}
            </span>
          </div>
        </div>
      </div>
    `,
  }),
};

// Performance Test
export const Performance: Story = {
  render: () => ({
    components: { BaseSelect },
    setup() {
      const selectedValues = ref([]);
      const largeDataset = generateLargeDataset(1000);

      return {
        selectedValues,
        largeDataset,
      };
    },
    template: `
      <div style="width: 500px;">
        <BaseSelect 
          v-model="selectedValues"
          :options="largeDataset"
          option-label="label"
          option-value="value"
          multiple
          filterable
          clearable
          placeholder="جستجو در ۱۰۰۰ گزینه..."
          label="تست عملکرد"
          help-text="این لیست شامل ۱۰۰۰ گزینه است"
          scroll-height="300px"
        />
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 14px;">
          <div><strong>تعداد کل گزینه‌ها:</strong> {{ largeDataset.length.toLocaleString('fa-IR') }}</div>
          <div><strong>انتخاب شده:</strong> {{ selectedValues.length.toLocaleString('fa-IR') }} مورد</div>
        </div>
      </div>
    `,
  }),
};

// Events Demo
export const EventsDemo: Story = {
  render: () => ({
    components: { BaseSelect },
    setup() {
      const selectedValue = ref(null);
      const eventLog = ref<Array<{ type: string; data: string; time: string }>>(
        []
      );

      const addEvent = (type: string, data: any) => {
        const time = new Date().toLocaleTimeString("fa-IR");
        eventLog.value.unshift({
          type,
          data: typeof data === "object" ? JSON.stringify(data) : String(data),
          time,
        });

        // Keep only last 10 events
        if (eventLog.value.length > 10) {
          eventLog.value = eventLog.value.slice(0, 10);
        }
      };

      const clearLog = () => {
        eventLog.value = [];
      };

      return {
        basicOptions,
        selectedValue,
        eventLog,
        addEvent,
        clearLog,
      };
    },
    template: `
      <div style="width: 500px;">
        <BaseSelect 
          v-model="selectedValue"
          :options="basicOptions"
          filterable
          clearable
          placeholder="انتخاب کنید و رویدادها را مشاهده کنید"
          label="تست رویدادها"
          @change="addEvent('change', $event)"
          @focus="addEvent('focus', 'فوکوس شد')"
          @blur="addEvent('blur', 'فوکوس از دست رفت')"
          @filter="addEvent('filter', $event)"
          @show="addEvent('show', 'لیست باز شد')"
          @hide="addEvent('hide', 'لیست بسته شد')"
          @clear="addEvent('clear', 'پاک شد')"
        />
        
        <div style="margin-top: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="margin: 0; color: #374151;">لاگ رویدادها</h4>
            <button 
              @click="clearLog"
              style="
                padding: 4px 8px; 
                border: 1px solid #d1d5db; 
                border-radius: 4px; 
                background: #f9fafb; 
                cursor: pointer;
                font-size: 12px;
              "
            >
              پاک کردن
            </button>
          </div>
          
          <div style="
            max-height: 200px; 
            overflow-y: auto; 
            border: 1px solid #e5e7eb; 
            border-radius: 6px; 
            background: #f9fafb;
          ">
            <div v-if="eventLog.length === 0" style="padding: 16px; text-align: center; color: #6b7280;">
              هنوز رویدادی ثبت نشده
            </div>
            <div 
              v-for="(event, index) in eventLog" 
              :key="index"
              style="
                padding: 8px 12px; 
                border-bottom: 1px solid #e5e7eb; 
                font-size: 13px;
                font-family: 'Courier New', monospace;
              "
            >
              <span style="color: #059669; font-weight: bold;">{{ event.time }}</span>
              <span style="color: #dc2626; font-weight: bold; margin: 0 8px;">{{ event.type }}:</span>
              <span style="color: #374151;">{{ event.data }}</span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

// Playground
export const Playground: Story = {
  args: {
    options: skillsOptions,
    multiple: false,
    filterable: false,
    clearable: false,
    disabled: false,
    loading: false,
    invalid: false,
    required: false,
    variant: "default",
    size: "medium",
    placeholder: "انتخاب کنید...",
    label: "گزینه‌ها",
    helpText: "",
    errorMessage: "این فیلد دارای خطا است",
    emptyMessage: "نتیجه‌ای یافت نشد",
  },
  render: (args) => ({
    components: { BaseSelect },
    setup() {
      const selectedValue = ref(null);
      return { args, selectedValue };
    },
    template: `
      <div style="width: 400px;">
        <BaseSelect v-bind="args" v-model="selectedValue" />
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 14px;">
          <strong>مقدار فعلی:</strong>
          <pre style="margin: 8px 0 0 0; font-size: 12px; background: white; padding: 8px; border-radius: 4px; overflow-x: auto;">{{ JSON.stringify(selectedValue, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
};

// Form Integration
export const FormIntegration: Story = {
  render: () => ({
    components: { BaseSelect },
    setup() {
      const formData = ref({
        city: null,
        skills: [],
        country: null,
        category: null,
      });

      const submitForm = () => {
        alert("فرم ارسال شد!\n\n" + JSON.stringify(formData.value, null, 2));
      };

      const resetForm = () => {
        formData.value = {
          city: null,
          skills: [],
          country: null,
          category: null,
        };
      };

      return {
        formData,
        submitForm,
        resetForm,
        basicOptions,
        skillsOptions,
        countriesOptions,
        categoryOptions,
      };
    },
    template: `
      <div style="width: 500px;">
        <form @submit.prevent="submitForm" style="display: flex; flex-direction: column; gap: 20px;">
          <BaseSelect 
            v-model="formData.city"
            :options="basicOptions"
            label="شهر محل سکونت"
            placeholder="شهر خود را انتخاب کنید"
            required
            clearable
          />
          
          <BaseSelect 
            v-model="formData.skills"
            :options="skillsOptions"
            multiple
            filterable
            clearable
            label="مهارت‌های فنی"
            placeholder="مهارت‌های خود را انتخاب کنید"
            help-text="حداقل ۳ مهارت انتخاب کنید"
          />
          
          <BaseSelect 
            v-model="formData.country"
            :options="countriesOptions"
            filterable
            clearable
            label="کشور"
            placeholder="کشور خود را تایپ کنید"
          />
          
          <BaseSelect 
            v-model="formData.category"
            :options="categoryOptions"
            option-label="label"
            option-value="value"
            option-disabled="disabled"
            label="دسته‌بندی شغلی"
            placeholder="دسته‌بندی را انتخاب کنید"
          />
          
          <div style="display: flex; gap: 12px; margin-top: 16px;">
            <button 
              type="submit"
              style="
                padding: 12px 24px; 
                background: #059669; 
                color: white; 
                border: none; 
                border-radius: 6px; 
                cursor: pointer;
                font-weight: 500;
              "
            >
              ارسال فرم
            </button>
            <button 
              type="button"
              @click="resetForm"
              style="
                padding: 12px 24px; 
                background: #6b7280; 
                color: white; 
                border: none; 
                border-radius: 6px; 
                cursor: pointer;
                font-weight: 500;
              "
            >
              پاک کردن
            </button>
          </div>
        </form>
        
        <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 6px;">
          <h4 style="margin: 0 0 12px 0; color: #374151;">داده‌های فرم:</h4>
          <pre style="font-size: 12px; background: white; padding: 12px; border-radius: 4px; overflow-x: auto; margin: 0;">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
};
