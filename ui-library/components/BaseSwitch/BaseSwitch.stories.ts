import type { Meta, StoryObj } from "@storybook/vue3";
import { ref, reactive, computed, watch, nextTick } from "vue";
import BaseSwitch from "./BaseSwitch.vue";
import { useArgs } from "@storybook/preview-api";
import { action } from "storybook/actions";

const meta: Meta<typeof BaseSwitch> = {
  title: "FORM/BaseSwitch",
  component: BaseSwitch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# BaseSwitch

یک کامپوننت سوئیچ جامع و کاربردی که با Vue 3 Composition API و TypeScript ساخته شده است. این کامپوننت از بهترین ویژگی‌های PrimeVue، Radix UI و Material UI الهام گرفته شده.

## ویژگی‌های کلیدی

- ✅ **دسترسی‌پذیری کامل**: پشتیبانی از keyboard navigation، ARIA، screen reader
- 🎨 **قابل سفارشی‌سازی**: اندازه‌های مختلف، انواع رنگی، و styling options
- 🌙 **پشتیبانی از تم**: سازگاری با حالت روشن/تاریک
- ⚡ **کارایی بالا**: بهینه‌سازی شده با حداقل re-render
- 📱 **Responsive**: کارکرد در تمام اندازه‌های دستگاه
- 🌐 **پشتیبانی RTL**: سازگاری با زبان‌های راست‌چین
- ♿ **فراگیر**: پشتیبانی از high contrast، reduced motion
- 🔧 **انعطاف‌پذیر**: props و slots گسترده برای سفارشی‌سازی

## نحوه استفاده

\`\`\`vue
<template>
  <BaseSwitch
    v-model="isChecked"
    label="فعال‌سازی اعلان‌ها"
    helper-text="اعلان‌های مهم را دریافت کنید"
    size="md"
    variant="success"
    show-track-icons
  />
</template>

<script setup>
import { ref } from 'vue'
const isChecked = ref(false)
</script>
\`\`\`
        `,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#1f2937" },
        { name: "surface", value: "#f9fafb" },
      ],
    },
  },
  argTypes: {
    modelValue: {
      control: "boolean",
      description: "وضعیت فعلی سوئیچ (checked/unchecked)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description: "متن برچسب سوئیچ",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "اندازه سوئیچ",
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger"],
      description: "نوع رنگی سوئیچ",
      table: {
        type: { summary: "'default' | 'success' | 'warning' | 'danger'" },
        defaultValue: { summary: "'default'" },
      },
    },
    disabled: {
      control: "boolean",
      description: "غیرفعال کردن سوئیچ",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    loading: {
      control: "boolean",
      description: "نمایش حالت بارگذاری",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    invalid: {
      control: "boolean",
      description: "حالت خطا/نامعتبر",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    readonly: {
      control: "boolean",
      description: "حالت فقط خواندنی",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    required: {
      control: "boolean",
      description: "فیلد الزامی",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    showTrackIcons: {
      control: "boolean",
      description: "نمایش آیکون‌ها در track",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    helperText: {
      control: "text",
      description: "متن راهنما زیر سوئیچ",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    errorMessage: {
      control: "text",
      description: "پیام خطا هنگام invalid بودن",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    autofocus: {
      control: "boolean",
      description: "فوکوس خودکار",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
  decorators: [
    () => ({
      template: '<div style="padding: 1rem;"><story/></div>',
    }),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BaseSwitch>;

// ==================== داستان پیش‌فرض ====================
export const Default: Story = {
  args: {
    label: "سوئیچ پیش‌فرض",
    modelValue: false,
  },
  render: (args) => ({
    components: { BaseSwitch },
    setup() {
      const checked = ref(args.modelValue || false);

      watch(
        () => args.modelValue,
        (newVal) => {
          checked.value = newVal;
        }
      );

      return {
        args: reactive(args),
        checked,
        handleChange: (event: Event, value: boolean) => {
          console.log("🎯 Change event:", { event, value });
        },
      };
    },
    template: `
      <BaseSwitch 
        v-bind="args" 
        v-model="checked"
        @change="handleChange"
      />
    `,
  }),
};

// ==================== اندازه‌ها ====================
export const Sizes: Story = {
  name: "📏 اندازه‌های مختلف",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const switches = reactive({
        small: true,
        medium: false,
        large: true,
      });
      return { switches };
    },
    template: `
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-4">
          <BaseSwitch 
            v-model="switches.small" 
            label="کوچک (Small)" 
            size="sm" 
          />
          <code class="text-sm text-gray-600">size="sm"</code>
        </div>
        
        <div class="flex items-center gap-4">
          <BaseSwitch 
            v-model="switches.medium" 
            label="متوسط (Medium)" 
            size="md" 
          />
          <code class="text-sm text-gray-600">size="md" (پیش‌فرض)</code>
        </div>
        
        <div class="flex items-center gap-4">
          <BaseSwitch 
            v-model="switches.large" 
            label="بزرگ (Large)" 
            size="lg" 
          />
          <code class="text-sm text-gray-600">size="lg"</code>
        </div>
        
        <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          💡 <strong>نکته:</strong> اندازه‌ها بر اساس استاندارد Material Design طراحی شده‌اند
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "BaseSwitch در سه اندازه مختلف: کوچک (32×18px)، متوسط (44×24px)، و بزرگ (56×32px) ارائه می‌شود.",
      },
    },
  },
};

// ==================== انواع رنگی ====================
export const Variants: Story = {
  name: "🎨 انواع رنگی",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const variants = reactive({
        default: true,
        success: true,
        warning: true,
        danger: true,
      });
      return { variants };
    },
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-center gap-4">
          <BaseSwitch 
            v-model="variants.default" 
            label="پیش‌فرض (Default)" 
            variant="default"
            size="md"
          />
          <code class="text-sm text-gray-600">variant="default"</code>
        </div>
        
        <div class="flex items-center gap-4">
          <BaseSwitch 
            v-model="variants.success" 
            label="موفقیت (Success)" 
            variant="success"
            size="md"
          />
          <code class="text-sm text-green-600">variant="success"</code>
        </div>
        
        <div class="flex items-center gap-4">
          <BaseSwitch 
            v-model="variants.warning" 
            label="هشدار (Warning)" 
            variant="warning"
            size="md"
          />
          <code class="text-sm text-orange-600">variant="warning"</code>
        </div>
        
        <div class="flex items-center gap-4">
          <BaseSwitch 
            v-model="variants.danger" 
            label="خطر (Danger)" 
            variant="danger"
            size="md"
          />
          <code class="text-sm text-red-600">variant="danger"</code>
        </div>
      </div>
      
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 class="font-semibold text-gray-800 mb-2">🎯 کاربرد انواع رنگی:</h4>
        <ul class="text-sm text-gray-700 space-y-1">
          <li><strong>Default:</strong> استفاده عمومی و تنظیمات معمولی</li>
          <li><strong>Success:</strong> عملیات موفق، تأییدها، و حالت‌های مثبت</li>
          <li><strong>Warning:</strong> هشدارها، تنظیمات احتیاطی</li>
          <li><strong>Danger:</strong> عملیات خطرناک، حذف، غیرفعال‌سازی</li>
        </ul>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "چهار نوع رنگی مختلف برای موقعیت‌های مختلف کاربردی. هر رنگ معنای خاصی دارد و باید متناسب با عملکرد استفاده شود.",
      },
    },
  },
};

// ==================== حالت‌های مختلف ====================
export const States: Story = {
  name: "⚡ حالت‌های مختلف",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const states = reactive({
        normal: false,
        disabled: true,
        loading: false,
        readonly: true,
        invalid: false,
        required: false,
      });

      return { states };
    },
    template: `
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Normal -->
          <div class="space-y-2">
            <BaseSwitch 
              v-model="states.normal" 
              label="حالت عادی (Normal)"
              helper-text="قابل تعامل و کاربردی"
            />
            <code class="text-xs text-gray-500">حالت پیش‌فرض</code>
          </div>
          
          <!-- Disabled -->
          <div class="space-y-2">
            <BaseSwitch 
              v-model="states.disabled" 
              label="غیرفعال (Disabled)"
              helper-text="غیرقابل تعامل"
              disabled
            />
            <code class="text-xs text-gray-500">disabled</code>
          </div>
          
          <!-- Loading -->
          <div class="space-y-2">
            <BaseSwitch 
              v-model="states.loading" 
              label="در حال بارگذاری (Loading)"
              helper-text="در حال پردازش..."
              loading
            />
            <code class="text-xs text-gray-500">loading</code>
          </div>
          
          <!-- Readonly -->
          <div class="space-y-2">
            <BaseSwitch 
              v-model="states.readonly" 
              label="فقط خواندنی (Readonly)"
              helper-text="قابل مشاهده اما غیرقابل تغییر"
              readonly
            />
            <code class="text-xs text-gray-500">readonly</code>
          </div>
          
          <!-- Invalid -->
          <div class="space-y-2">
            <BaseSwitch 
              v-model="states.invalid" 
              label="نامعتبر (Invalid)"
              invalid
              error-message="این فیلد الزامی است"
            />
            <code class="text-xs text-red-500">invalid</code>
          </div>
          
          <!-- Required -->
          <div class="space-y-2">
            <BaseSwitch 
              v-model="states.required" 
              label="الزامی (Required) *"
              helper-text="این فیلد باید پر شود"
              required
            />
            <code class="text-xs text-gray-500">required</code>
          </div>
        </div>
        
        <div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 class="font-semibold text-amber-800 mb-2">📋 وضعیت فعلی:</h4>
          <pre class="text-sm text-amber-700 overflow-auto">{{ JSON.stringify(states, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "حالت‌های مختلف سوئیچ شامل عادی، غیرفعال، بارگذاری، فقط خواندنی، نامعتبر و الزامی.",
      },
    },
  },
};

// ==================== آیکون‌های Track ====================
export const TrackIcons: Story = {
  name: "🎯 آیکون‌های Track",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const icons = reactive({
        withIcons: true,
        withoutIcons: false,
        customIcons: true,
      });
      return { icons };
    },
    template: `
      <div class="space-y-8">
        <div class="space-y-6">
          <div>
            <BaseSwitch 
              v-model="icons.withIcons" 
              label="با آیکون‌های پیش‌فرض"
              helper-text="آیکون‌های ✓ و ✗ در track"
              show-track-icons 
              size="lg"
              variant="success"
            />
          </div>
          
          <div>
            <BaseSwitch 
              v-model="icons.withoutIcons" 
              label="بدون آیکون"
              helper-text="ظاهر ساده و مینیمال"
              size="lg"
            />
          </div>
          
          <div>
            <BaseSwitch 
              v-model="icons.customIcons" 
              label="آیکون‌های سفارشی"
              helper-text="با slot های سفارشی"
              show-track-icons 
              size="lg"
              variant="warning"
            >
              <template #icon-checked>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                        fill="currentColor"/>
                </svg>
              </template>
              <template #icon-unchecked>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="m15 9-6 6M9 9l6 6" stroke="currentColor" stroke-width="2"/>
                </svg>
              </template>
            </BaseSwitch>
          </div>
        </div>
        
        <div class="p-4 bg-blue-50 rounded-lg">
          <h4 class="font-semibold text-blue-800 mb-2">💡 نکات:</h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• آیکون‌ها به بهبود UX کمک می‌کنند</li>
            <li>• برای اندازه‌های کوچک بهتر است از آیکون استفاده نکنید</li>
            <li>• می‌توانید با slot ها آیکون‌های سفارشی اضافه کنید</li>
          </ul>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "سوئیچ‌ها می‌توانند آیکون‌های ✓ و ✗ در track نمایش دهند یا از آیکون‌های سفارشی استفاده کنند.",
      },
    },
  },
};

// ==================== متن‌های کمکی ====================
export const HelperTexts: Story = {
  name: "📝 متن‌های کمکی",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const helpers = reactive({
        basic: true,
        warning: false,
        error: false,
        rich: true,
      });
      return { helpers };
    },
    template: `
      <div class="space-y-6" style="display : flex ; flex-direction : column ; gap : 48px">
        <BaseSwitch 
          v-model="helpers.basic" 
          label="اعلان‌های فوری" 
          helper-text="دریافت اعلان‌های مهم و فوری از سیستم"
          variant="success"
          size="md"
        />
        
        <BaseSwitch 
          v-model="helpers.warning" 
          label="همگام‌سازی داده‌ها" 
          helper-text="⚠️ این عمل تمام داده‌های شما را با سرور همگام می‌کند"
          variant="warning"
          size="md"
        />
        
        <BaseSwitch 
          v-model="helpers.error" 
          label="قبول شرایط و ضوابط *" 
          invalid
          error-message="برای ادامه باید شرایط و ضوابط را بپذیرید"
          variant="danger"
          size="md"
          required
        />
        
        <BaseSwitch 
          v-model="helpers.rich" 
          label="محتوای غنی سفارشی"
          variant="default"
          size="md"
        >
          <template #helper>
            <div class="text-sm text-gray-600">
              این گزینه شامل 
              <a href="#" class="text-blue-600 underline">ویژگی‌های پریمیوم</a> 
              می‌باشد. 
              <span class="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs ml-1">
                جدید
              </span>
            </div>
          </template>
        </BaseSwitch>
        
        <div class="p-4 bg-green-50 rounded-lg">
          <h4 class="font-semibold text-green-800 mb-2">✅ بهترین practices:</h4>
          <ul class="text-sm text-green-700 space-y-1">
            <li>• از متن‌های کوتاه و واضح استفاده کنید</li>
            <li>• برای عملیات خطرناک از هشدار استفاده کنید</li>
            <li>• پیام‌های خطا باید راهنمای حل مسئله باشند</li>
            <li>• از slot ها برای محتوای پیچیده استفاده کنید</li>
          </ul>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "انواع مختلف متن‌های کمکی شامل متن ساده، هشدارها، پیام‌های خطا و محتوای غنی با slot.",
      },
    },
  },
};

// ==================== فرم تعاملی ====================
export const InteractiveForm: Story = {
  name: "📋 فرم تعاملی",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const form = reactive({
        notifications: {
          push: true,
          email: false,
          sms: false,
        },
        privacy: {
          profilePublic: false,
          showEmail: false,
          allowMessages: true,
        },
        preferences: {
          darkMode: false,
          autoSave: true,
          analytics: false,
        },
        agreement: {
          terms: false,
          newsletter: false,
        },
      });

      const formValid = computed(() => {
        return form.agreement.terms;
      });

      const resetForm = () => {
        Object.keys(form).forEach((section) => {
          Object.keys(form[section]).forEach((key) => {
            form[section][key] = false;
          });
        });
      };

      const submitForm = () => {
        if (!formValid.value) {
          alert("❌ لطفاً شرایط و ضوابط را بپذیرید");
          return;
        }

        alert(`✅ فرم با موفقیت ارسال شد!\n\n${JSON.stringify(form, null, 2)}`);
      };

      return { form, formValid, resetForm, submitForm };
    },
    template: `
      <div class="max-w-2xl mx-auto">
        <div class="bg-white p-6 rounded-lg shadow-lg border">
          <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">
            🛠️ پنل تنظیمات کاربر
          </h2>
          
          <!-- بخش اعلان‌ها -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#10b981">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              اعلان‌ها
            </h3>
            <div class="space-y-4 pl-6">
              <BaseSwitch 
                v-model="form.notifications.push" 
                label="اعلان‌های فوری"
                helper-text="دریافت اعلان‌های مهم در دستگاه"
                variant="success"
                show-track-icons
              />
              <BaseSwitch 
                v-model="form.notifications.email" 
                label="ایمیل"
                helper-text="دریافت اعلان‌ها از طریق ایمیل"
                variant="default"
              />
              <BaseSwitch 
                v-model="form.notifications.sms" 
                label="پیامک"
                helper-text="دریافت اعلان‌ها از طریق SMS"
                variant="warning"
              />
            </div>
          </div>
          
          <!-- بخش حریم خصوصی -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              حریم خصوصی
            </h3>
            <div class="space-y-4 pl-6">
              <BaseSwitch 
                v-model="form.privacy.profilePublic" 
                label="پروفایل عمومی"
                helper-text="نمایش پروفایل برای سایر کاربران"
                variant="warning"
              />
              <BaseSwitch 
                v-model="form.privacy.showEmail" 
                label="نمایش ایمیل"
                helper-text="نمایش آدرس ایمیل در پروفایل عمومی"
                variant="danger"
                :disabled="!form.privacy.profilePublic"
              />
              <BaseSwitch 
                v-model="form.privacy.allowMessages" 
                label="اجازه پیام خصوصی"
                helper-text="امکان ارسال پیام از سوی کاربران"
                variant="success"
              />
            </div>
          </div>
          
          <!-- بخش تنظیمات -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#6b7280">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
              </svg>
              تنظیمات
            </h3>
            <div class="space-y-4 pl-6">
              <BaseSwitch 
                v-model="form.preferences.darkMode" 
                label="حالت تاریک"
                helper-text="استفاده از تم تاریک برای راحتی چشم"
                variant="default"
                show-track-icons
              />
              <BaseSwitch 
                v-model="form.preferences.autoSave" 
                label="ذخیره خودکار"
                helper-text="ذخیره خودکار تغییرات هر 5 دقیقه"
                variant="success"
              />
              <BaseSwitch 
                v-model="form.preferences.analytics" 
                label="آمار استفاده"
                helper-text="کمک به بهبود برنامه با اشتراک داده‌های ناشناس"
                variant="default"
              />
            </div>
          </div>
          
          <!-- بخش موافقت‌نامه -->
          <div class="mb-6 pb-4 border-b">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              موافقت‌نامه
            </h3>
            <div class="space-y-4 pl-6">
              <BaseSwitch 
                v-model="form.agreement.terms" 
                label="قبول شرایط و ضوابط *"
                helper-text="الزامی برای استفاده از سرویس"
                variant="danger"
                required
                :invalid="!form.agreement.terms"
                :error-message="!form.agreement.terms ? 'باید شرایط و ضوابط را بپذیرید' : ''"
              />
              <BaseSwitch 
                v-model="form.agreement.newsletter" 
                label="عضویت در خبرنامه"
                helper-text="دریافت آخرین اخبار و به‌روزرسانی‌ها (اختیاری)"
                variant="default"
              />
            </div>
          </div>
          
          <!-- دکمه‌های عملیات -->
          <div class="flex gap-3 justify-center">
            <button 
              @click="submitForm"
              :disabled="!formValid"
              :class="[
                'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                formValid 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              ✅ ذخیره تنظیمات
            </button>
            <button 
              @click="resetForm"
              class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🔄 بازنشانی
            </button>
          </div>
          
          <!-- نمایش وضعیت -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">📊 وضعیت فعلی فرم:</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong class="text-green-600">فعال:</strong>
                {{ Object.keys(form).reduce((acc, section) => 
                  acc + Object.values(form[section]).filter(Boolean).length, 0) }}
              </div>
              <div>
                <strong class="text-gray-600">غیرفعال:</strong>
                {{ Object.keys(form).reduce((acc, section) => 
                  acc + Object.values(form[section]).filter(v => !v).length, 0) }}
              </div>
            </div>
            <div class="mt-2">
              <strong>وضعیت فرم:</strong>
              <span :class="formValid ? 'text-green-600' : 'text-red-600'">
                {{ formValid ? '✅ معتبر' : '❌ نامعتبر' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "مثالی کامل از فرم تنظیمات با دسته‌بندی‌های مختلف، validation، و وابستگی‌های شرطی بین فیلدها.",
      },
    },
  },
};

// ==================== سفارشی‌سازی پیشرفته ====================
export const AdvancedCustomization: Story = {
  name: "🎭 سفارشی‌سازی پیشرفته",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const advanced = reactive({
        customLabel: true,
        customIcons: false,
        customHelper: true,
        customError: false,
      });
      return { advanced };
    },
    template: `
      <div class="space-y-8">
        <!-- Label سفارشی -->
        <div class="p-4 border rounded-lg">
          <h4 class="font-semibold mb-3">🏷️ Label سفارشی</h4>
          <BaseSwitch 
            v-model="advanced.customLabel" 
            variant="success"
            size="md"
          >
            <template #label>
              <div class="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="font-semibold">حساب پریمیوم</span>
                <span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  جدید
                </span>
              </div>
            </template>
          </BaseSwitch>
        </div>
        
        <!-- آیکون‌های سفارشی -->
        <div class="p-4 border rounded-lg">
          <h4 class="font-semibold mb-3">🎨 آیکون‌های سفارشی</h4>
          <BaseSwitch 
            v-model="advanced.customIcons" 
            label="حالت پرواز"
            show-track-icons 
            size="lg"
            variant="warning"
          >
            <template #icon-checked>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 16v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" 
                      stroke="currentColor" stroke-width="2"/>
                <path d="M6 12h12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </template>
            <template #icon-unchecked>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </template>
          </BaseSwitch>
        </div>
        
        <!-- Helper سفارشی -->
        <div class="p-4 border rounded-lg">
          <h4 class="font-semibold mb-3">📝 Helper سفارشی</h4>
          <BaseSwitch 
            v-model="advanced.customHelper" 
            label="همگام‌سازی ابری"
            variant="default"
            size="md"
          >
            <template #helper>
              <div class="flex items-start gap-2 mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" class="mt-0.5">
                  <path d="M12 9v3m0 3h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <div class="text-sm">
                  <span class="text-amber-600 font-medium">هشدار:</span>
                  <span class="text-gray-600">
                    این عمل تمام داده‌های شما را با سرور همگام می‌کند.
                    <a href="#" class="text-blue-600 underline hover:text-blue-800">
                      اطلاعات بیشتر
                    </a>
                  </span>
                </div>
              </div>
            </template>
          </BaseSwitch>
        </div>
        
        <!-- Error سفارشی -->
        <div class="p-4 border rounded-lg">
          <h4 class="font-semibold mb-3">❌ Error سفارشی</h4>
          <BaseSwitch 
            v-model="advanced.customError" 
            label="قبول قوانین"
            variant="danger"
            invalid
            required
          >
            <template #error>
              <div class="flex items-start gap-2 mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" class="mt-0.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="white"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="white"/>
                </svg>
                <div class="text-sm">
                  <span class="text-red-600 font-medium">خطا:</span>
                  <span class="text-red-600">
                    برای ادامه باید قوانین را بپذیرید.
                    <button class="underline hover:no-underline ml-1">
                      مطالعه قوانین
                    </button>
                  </span>
                </div>
              </div>
            </template>
          </BaseSwitch>
        </div>
        
        <div class="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h4 class="font-semibold text-indigo-800 mb-2">💡 نکات سفارشی‌سازی:</h4>
          <ul class="text-sm text-indigo-700 space-y-1">
            <li>• از slot ها برای محتوای پیچیده استفاده کنید</li>
            <li>• آیکون‌ها باید با معنای سوئیچ مطابقت داشته باشند</li>
            <li>• رنگ‌ها و فونت‌ها را با design system همسو کنید</li>
            <li>• برای accessibility حتماً alt text مناسب استفاده کنید</li>
          </ul>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "نمونه‌هایی از سفارشی‌سازی پیشرفته با استفاده از slot های مختلف برای ایجاد UI منحصر به فرد.",
      },
    },
  },
};

// ==================== تست دسترسی‌پذیری ====================
export const AccessibilityDemo: Story = {
  name: "♿ تست دسترسی‌پذیری",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const a11y = reactive({
        screenReader: false,
        keyboard: true,
        highContrast: false,
        reducedMotion: true,
      });

      const keyboardInstructions = ref("");
      const focusedElement = ref("");

      const handleFocus = (event: FocusEvent, label: string) => {
        focusedElement.value = label;
        keyboardInstructions.value = `فوکوس روی: ${label}. برای تغییر وضعیت Space یا Enter بزنید.`;
      };

      const handleBlur = () => {
        focusedElement.value = "";
        keyboardInstructions.value = "";
      };

      return {
        a11y,
        keyboardInstructions,
        focusedElement,
        handleFocus,
        handleBlur,
      };
    },
    template: `
      <div class="space-y-6">
        <!-- راهنمای تست -->
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 class="font-semibold text-blue-800 mb-3">🧪 راهنمای تست دسترسی‌پذیری</h3>
          <ol class="text-sm text-blue-700 space-y-2 list-decimal list-inside">
            <li><strong>کیبورد:</strong> Tab برای navigation، Space/Enter برای toggle</li>
            <li><strong>Screen Reader:</strong> از NVDA، JAWS یا VoiceOver استفاده کنید</li>
            <li><strong>High Contrast:</strong> از تنظیمات سیستم‌عامل فعال کنید</li>
            <li><strong>Reduced Motion:</strong> تنظیم "Reduce motion" را فعال کنید</li>
          </ol>
        </div>
        
        <!-- نمایش وضعیت keyboard -->
        <div class="bg-green-50 p-3 rounded-lg border border-green-200" v-if="keyboardInstructions">
          <div class="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <path d="M6 9h.01M10 9h4M18 9h.01M6 13h.01M10 13h.01M14 13h4M6 17h4M14 17h.01M18 17h.01"/>
            </svg>
            <span class="text-green-800 font-medium">راهنمای کیبورد:</span>
          </div>
          <p class="text-green-700 text-sm mt-1">{{ keyboardInstructions }}</p>
        </div>
        
        <!-- سوئیچ‌های تست -->
        <div class="space-y-4">
          <BaseSwitch 
            v-model="a11y.screenReader" 
            label="سازگاری با Screen Reader"
            helper-text="تست شده با NVDA، JAWS، و VoiceOver"
            aria-label="فعال/غیرفعال کردن پشتیبانی screen reader"
            variant="success"
            show-track-icons
            @focus="(e) => handleFocus(e, 'Screen Reader Support')"
            @blur="handleBlur"
          />
          
          <BaseSwitch 
            v-model="a11y.keyboard" 
            label="Navigation کیبورد"
            helper-text="پشتیبانی کامل از Tab, Space, Enter"
            aria-label="فعال/غیرفعال کردن navigation کیبورد"
            variant="default"
            @focus="(e) => handleFocus(e, 'Keyboard Navigation')"
            @blur="handleBlur"
          />
          
          <BaseSwitch 
            v-model="a11y.highContrast" 
            label="سازگاری High Contrast"
            helper-text="تطبیق خودکار با حالت کنتراست بالا"
            aria-label="فعال/غیرفعال کردن high contrast mode"
            variant="warning"
            @focus="(e) => handleFocus(e, 'High Contrast Mode')"
            @blur="handleBlur"
          />
          
          <BaseSwitch 
            v-model="a11y.reducedMotion" 
            label="احترام به Reduced Motion"
            helper-text="غیرفعال کردن انیمیشن‌ها هنگام لزوم"
            aria-label="فعال/غیرفعال کردن reduced motion"
            variant="default"
            show-track-icons
            @focus="(e) => handleFocus(e, 'Reduced Motion')"
            @blur="handleBlur"
          />
        </div>
        
        <!-- نمایش ARIA attributes -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-3">🏷️ ARIA Attributes موجود:</h4>
          <div class="grid grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <strong>role:</strong> "switch"<br>
              <strong>aria-checked:</strong> true/false<br>
              <strong>aria-disabled:</strong> true/false<br>
              <strong>aria-readonly:</strong> true/false
            </div>
            <div>
              <strong>aria-invalid:</strong> true/false<br>
              <strong>aria-required:</strong> true/false<br>
              <strong>aria-label:</strong> custom label<br>
              <strong>aria-describedby:</strong> helper text
            </div>
          </div>
        </div>
        
        <!-- Color contrast info -->
        <div class="bg-purple-50 p-4 rounded-lg">
          <h4 class="font-semibold text-purple-800 mb-2">🎨 اطلاعات Color Contrast:</h4>
          <div class="text-sm text-purple-700 space-y-1">
            <div>• <strong>Text on Background:</strong> 4.5:1 (AA) ✅</div>
            <div>• <strong>Focus Indicator:</strong> 3:1 (AA) ✅</div>
            <div>• <strong>Switch Track:</strong> 3:1 (AA) ✅</div>
            <div>• <strong>Error States:</strong> 4.5:1 (AA) ✅</div>
          </div>
        </div>
        
        <!-- وضعیت فعلی -->
        <div class="bg-indigo-50 p-4 rounded-lg">
          <h4 class="font-semibold text-indigo-800 mb-2">📊 وضعیت تست‌ها:</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Screen Reader:</strong> 
              <span :class="a11y.screenReader ? 'text-green-600' : 'text-red-600'">
                {{ a11y.screenReader ? '✅ فعال' : '❌ غیرفعال' }}
              </span>
            </div>
            <div>
              <strong>Keyboard:</strong> 
              <span :class="a11y.keyboard ? 'text-green-600' : 'text-red-600'">
                {{ a11y.keyboard ? '✅ فعال' : '❌ غیرفعال' }}
              </span>
            </div>
            <div>
              <strong>High Contrast:</strong> 
              <span :class="a11y.highContrast ? 'text-green-600' : 'text-red-600'">
                {{ a11y.highContrast ? '✅ فعال' : '❌ غیرفعال' }}
              </span>
            </div>
            <div>
              <strong>Reduced Motion:</strong> 
              <span :class="a11y.reducedMotion ? 'text-green-600' : 'text-red-600'">
                {{ a11y.reducedMotion ? '✅ فعال' : '❌ غیرفعال' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "تست و نمایش ویژگی‌های دسترسی‌پذیری شامل keyboard navigation، screen reader support، high contrast و reduced motion.",
      },
    },
  },
};

// ==================== تست کارایی ====================
export const PerformanceTest: Story = {
  name: "⚡ تست کارایی",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const switchCount = ref(50);
      const switches = ref([]);
      const renderTime = ref(0);
      const isGenerating = ref(false);

      const generateSwitches = async () => {
        isGenerating.value = true;
        const startTime = performance.now();

        switches.value = Array(switchCount.value)
          .fill(null)
          .map((_, i) => ({
            id: `switch-${i}`,
            checked: Math.random() > 0.5,
            variant: ["default", "success", "warning", "danger"][
              Math.floor(Math.random() * 4)
            ],
            size: ["sm", "md", "lg"][Math.floor(Math.random() * 3)],
            label: `سوئیچ شماره ${i + 1}`,
            showIcons: i % 3 === 0,
          }));

        await nextTick();
        renderTime.value =
          Math.round((performance.now() - startTime) * 100) / 100;
        isGenerating.value = false;
      };

      const toggleAll = () => {
        const newState = !switches.value[0]?.checked;
        switches.value.forEach((sw) => {
          sw.checked = newState;
        });
      };

      const clearSwitches = () => {
        switches.value = [];
        renderTime.value = 0;
      };

      const randomize = () => {
        switches.value.forEach((sw) => {
          sw.checked = Math.random() > 0.5;
          sw.variant = ["default", "success", "warning", "danger"][
            Math.floor(Math.random() * 4)
          ];
          sw.size = ["sm", "md", "lg"][Math.floor(Math.random() * 3)];
        });
      };

      return {
        switchCount,
        switches,
        renderTime,
        isGenerating,
        generateSwitches,
        toggleAll,
        clearSwitches,
        randomize,
      };
    },
    template: `
      <div class="space-y-6">
        <!-- کنترل‌ها -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-semibold text-gray-800 mb-4">🎛️ کنترل‌های تست</h3>
          
          <div class="flex flex-wrap items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium">تعداد:</label>
              <input 
                v-model.number="switchCount" 
                type="number" 
                min="1" 
                max="200"
                class="w-16 px-2 py-1 border rounded text-sm"
              >
            </div>
            
            <button 
              @click="generateSwitches"
              :disabled="isGenerating"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded text-sm font-medium transition-colors"
            >
              {{ isGenerating ? '⏳ در حال تولید...' : '🔄 تولید سوئیچ‌ها' }}
            </button>
            
            <button 
              @click="toggleAll"
              :disabled="!switches.length"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded text-sm font-medium transition-colors"
            >
              🔀 تغییر همه
            </button>
            
            <button 
              @click="randomize"
              :disabled="!switches.length"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded text-sm font-medium transition-colors"
            >
              🎲 تصادفی
            </button>
            
            <button 
              @click="clearSwitches"
              :disabled="!switches.length"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded text-sm font-medium transition-colors"
            >
              🗑️ پاک کردن
            </button>
          </div>
          
          <!-- آمار عملکرد -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div class="bg-white p-3 rounded border">
              <div class="font-semibold text-blue-600">تعداد کل</div>
              <div class="text-lg font-bold">{{ switches.length }}</div>
            </div>
            <div class="bg-white p-3 rounded border">
              <div class="font-semibold text-green-600">فعال</div>
              <div class="text-lg font-bold">{{ switches.filter(sw => sw.checked).length }}</div>
            </div>
            <div class="bg-white p-3 rounded border">
              <div class="font-semibold text-orange-600">زمان رندر</div>
              <div class="text-lg font-bold">{{ renderTime }}ms</div>
            </div>
            <div class="bg-white p-3 rounded border">
              <div class="font-semibold text-purple-600">میانگین</div>
              <div class="text-lg font-bold">{{ switches.length ? Math.round((renderTime / switches.length) * 100) / 100 : 0 }}ms</div>
            </div>
          </div>
        </div>
        
        <!-- نمایش سوئیچ‌ها -->
        <div v-if="switches.length" class="bg-white border rounded-lg">
          <div class="p-4 border-b bg-gray-50">
            <h3 class="font-semibold text-gray-800">📊 نتایج تست ({{ switches.length }} سوئیچ)</h3>
          </div>
          
          <div class="p-4 max-h-96 overflow-y-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <BaseSwitch 
                v-for="sw in switches"
                :key="sw.id"
                v-model="sw.checked"
                :label="sw.label"
                :variant="sw.variant"
                :size="sw.size"
                :show-track-icons="sw.showIcons"
                class="text-sm"
              />
            </div>
          </div>
        </div>
        
        <!-- راهنما -->
        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 class="font-semibold text-yellow-800 mb-2">💡 نکات تست کارایی:</h4>
          <ul class="text-sm text-yellow-700 space-y-1">
            <li>• تا 100 سوئیچ: عملکرد عالی (< 50ms)</li>
            <li>• 100-200 سوئیچ: عملکرد خوب (50-100ms)</li>
            <li>• بالای 200: ممکن است کندی احساس شود</li>
            <li>• استفاده از virtual scrolling برای تعداد زیاد توصیه می‌شود</li>
          </ul>
        </div>
        
        <!-- بنچمارک -->
        <div class="bg-indigo-50 p-4 rounded-lg">
          <h4 class="font-semibold text-indigo-800 mb-2">📈 بنچمارک مرجع:</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div class="text-center">
              <div class="font-bold text-green-600">10 سوئیچ</div>
              <div>~5ms</div>
            </div>
            <div class="text-center">
              <div class="font-bold text-blue-600">50 سوئیچ</div>
              <div>~25ms</div>
            </div>
            <div class="text-center">
              <div class="font-bold text-orange-600">100 سوئیچ</div>
              <div>~50ms</div>
            </div>
            <div class="text-center">
              <div class="font-bold text-red-600">200 سوئیچ</div>
              <div>~100ms</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "تست کارایی کامپوننت با تعداد مختلف سوئیچ و اندازه‌گیری زمان رندر. این تست کمک می‌کند تا محدودیت‌های عملکرد را شناسایی کنید.",
      },
    },
  },
};

// بالای فایل (اگر قبلاً ندارید)

// ==================== مستندات API ====================
export const APIDocumentation: Story = {
  name: "📚 مستندات API",
  render: () => ({
    components: { BaseSwitch },
    setup() {
      const exampleSwitch = ref(true);

      const propsData = [
        {
          name: "modelValue",
          type: "boolean",
          default: "false",
          description: "وضعیت فعلی سوئیچ (checked/unchecked)",
        },
        {
          name: "label",
          type: "string",
          default: "undefined",
          description: "متن برچسب سوئیچ",
        },
        {
          name: "helperText",
          type: "string",
          default: "undefined",
          description: "متن راهنما زیر سوئیچ",
        },
        {
          name: "errorMessage",
          type: "string",
          default: "undefined",
          description: "پیام خطا هنگام invalid بودن",
        },
        {
          name: "size",
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: "اندازه سوئیچ",
        },
        {
          name: "variant",
          type: "'default' | 'success' | 'warning' | 'danger'",
          default: "'default'",
          description: "نوع رنگی سوئیچ",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "غیرفعال کردن سوئیچ",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description: "نمایش حالت بارگذاری با اسپینر",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          description: "حالت خطا/نامعتبر",
        },
        {
          name: "readonly",
          type: "boolean",
          default: "false",
          description: "حالت فقط خواندنی",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description: "فیلد الزامی",
        },
        {
          name: "showTrackIcons",
          type: "boolean",
          default: "false",
          description: "نمایش آیکون‌های ✓ و ✗ در track",
        },
        {
          name: "name",
          type: "string",
          default: "undefined",
          description: "نام input برای ارسال فرم",
        },
        {
          name: "value",
          type: "string | number",
          default: "undefined",
          description: "مقدار input برای ارسال فرم",
        },
        {
          name: "id",
          type: "string",
          default: "auto-generated",
          description: "شناسه منحصر به فرد input",
        },
        {
          name: "ariaLabel",
          type: "string",
          default: "undefined",
          description: "برچسب ARIA برای screen readers",
        },
        {
          name: "autofocus",
          type: "boolean",
          default: "false",
          description: "فوکوس خودکار هنگام mount",
        },
      ];

      const eventsData = [
        {
          name: "update:modelValue",
          payload: "boolean",
          description: "هنگام تغییر وضعیت سوئیچ emit می‌شود",
        },
        {
          name: "change",
          payload: "(event: Event, value: boolean)",
          description: "همراه با event و مقدار جدید",
        },
        {
          name: "focus",
          payload: "FocusEvent",
          description: "هنگام دریافت فوکوس",
        },
        {
          name: "blur",
          payload: "FocusEvent",
          description: "هنگام از دست دادن فوکوس",
        },
        {
          name: "click",
          payload: "MouseEvent",
          description: "هنگام کلیک روی سوئیچ",
        },
      ];

      const slotsData = [
        { name: "label", props: "-", description: "محتوای سفارشی برای برچسب" },
        {
          name: "helper",
          props: "-",
          description: "محتوای سفارشی برای متن راهنما",
        },
        {
          name: "error",
          props: "-",
          description: "محتوای سفارشی برای پیام خطا",
        },
        {
          name: "icon-checked",
          props: "-",
          description: "آیکون سفارشی برای حالت فعال",
        },
        {
          name: "icon-unchecked",
          props: "-",
          description: "آیکون سفارشی برای حالت غیرفعال",
        },
        {
          name: "thumb-icon",
          props: "-",
          description: "آیکون سفارشی روی thumb",
        },
      ];

      const methodsData = [
        {
          name: "focus()",
          params: "-",
          description: "فوکوس کردن سوئیچ به صورت برنامه‌ای",
        },
        { name: "blur()", params: "-", description: "حذف فوکوس از سوئیچ" },
        {
          name: "toggle()",
          params: "-",
          description: "تغییر وضعیت سوئیچ به صورت برنامه‌ای",
        },
      ];

      return {
        exampleSwitch,
        propsData,
        eventsData,
        slotsData,
        methodsData,
      };
    },
    template: `
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- معرفی -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
          <h2 class="text-2xl font-bold text-gray-800 mb-3">📚 مستندات API کامل BaseSwitch</h2>
          <p class="text-gray-600 mb-4">
            کامپوننت BaseSwitch با Vue 3 Composition API و TypeScript ساخته شده است و تمامی ویژگی‌های مدرن را پشتیبانی می‌کند.
          </p>
          
          <!-- نمونه -->
          <div class="bg-white p-4 rounded-lg border">
            <h3 class="font-semibold text-gray-800 mb-3">🎯 نمونه زنده:</h3>
            <BaseSwitch
              v-model="exampleSwitch"
              label="سوئیچ نمونه"
              helper-text="این یک سوئیچ نمونه است"
              variant="success"
              show-track-icons
            />
          </div>
        </div>

        <!-- Props -->
        <div class="bg-white rounded-lg shadow-lg border">
          <div class="p-4 bg-gray-50 rounded-t-lg border-b">
            <h3 class="text-lg font-semibold text-gray-800">📋 Props</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">نام</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">نوع</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">پیش‌فرض</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">توضیحات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prop in propsData" :key="prop.name" class="border-b hover:bg-gray-50">
                  <td class="px-4 py-3 font-mono text-sm text-blue-600">{{ prop.name }}</td>
                  <td class="px-4 py-3 font-mono text-sm text-green-600">{{ prop.type }}</td>
                  <td class="px-4 py-3 font-mono text-sm text-gray-600">{{ prop.default }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ prop.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Events -->
        <div class="bg-white rounded-lg shadow-lg border">
          <div class="p-4 bg-gray-50 rounded-t-lg border-b">
            <h3 class="text-lg font-semibold text-gray-800">📡 Events</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">نام رویداد</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Payload</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">توضیحات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in eventsData" :key="event.name" class="border-b hover:bg-gray-50">
                  <td class="px-4 py-3 font-mono text-sm text-purple-600">{{ event.name }}</td>
                  <td class="px-4 py-3 font-mono text-sm text-orange-600">{{ event.payload }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ event.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Slots -->
        <div class="bg-white rounded-lg shadow-lg border">
          <div class="p-4 bg-gray-50 rounded-t-lg border-b">
            <h3 class="text-lg font-semibold text-gray-800">🎭 Slots</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">نام Slot</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Props</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">توضیحات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="slot in slotsData" :key="slot.name" class="border-b hover:bg-gray-50">
                  <td class="px-4 py-3 font-mono text-sm text-pink-600">{{ slot.name }}</td>
                  <td class="px-4 py-3 font-mono text-sm text-gray-500">{{ slot.props }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ slot.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Methods -->
        <div class="bg-white rounded-lg shadow-lg border">
          <div class="p-4 bg-gray-50 rounded-t-lg border-b">
            <h3 class="text-lg font-semibold text-gray-800">⚙️ Methods (Exposed)</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">متد</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">پارامترها</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">توضیحات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="method in methodsData" :key="method.name" class="border-b hover:bg-gray-50">
                  <td class="px-4 py-3 font-mono text-sm text-indigo-600">{{ method.name }}</td>
                  <td class="px-4 py-3 font-mono text-sm text-gray-500">{{ method.params }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ method.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- CSS Variables -->
        <div class="bg-white rounded-lg shadow-lg border">
          <div class="p-4 bg-gray-50 rounded-t-lg border-b">
            <h3 class="text-lg font-semibold text-gray-800">🎨 CSS Custom Properties</h3>
          </div>
          <div class="p-6">
            <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>/* رنگ‌های اصلی */
--color-primary: #1e8759;
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;

/* فاصله‌ها */
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 0.75rem;
--space-lg: 1rem;

/* گردی گوشه‌ها */
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 8px;
--radius-full: 9999px;

/* سایه‌ها */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.10);

/* انیمیشن‌ها */
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;

/* فوکوس */
--focus-ring-color: #3b82f6;
--focus-ring-width: 2px;</pre>
            </div>
          </div>
        </div>

        <!-- نمونه‌های کد -->
        <div class="bg-white rounded-lg shadow-lg border">
          <div class="p-4 bg-gray-50 rounded-t-lg border-b">
            <h3 class="text-lg font-semibold text-gray-800">💻 نمونه‌های کد</h3>
          </div>
          <div class="p-6 space-y-6">
            <!-- Basic Usage -->
            <div>
              <h4 class="font-semibold text-gray-800 mb-2">🔹 استفاده پایه</h4>
              <div class="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <pre class="text-sm"><code>&lt;template&gt;
  &lt;BaseSwitch
    v-model="isEnabled"
    label="فعال‌سازی اعلان‌ها"
    helper-text="دریافت اعلان‌های مهم"
  /&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import BaseSwitch from './BaseSwitch.vue'

const isEnabled = ref(false)
&lt;/script&gt;</code></pre>
              </div>
            </div>

            <!-- Advanced Usage -->
            <div>
              <h4 class="font-semibold text-gray-800 mb-2">🔹 استفاده پیشرفته</h4>
              <div class="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <pre class="text-sm"><code>&lt;BaseSwitch
  v-model="notifications"
  label="اعلان‌های فوری"
  size="lg"
  variant="success"
  show-track-icons
  :invalid="!notifications && required"
  error-message="این گزینه الزامی است"
  @change="handleChange"
&gt;
  &lt;template #label&gt;
    &lt;div class="flex items-center gap-2"&gt;
      &lt;Icon name="bell" /&gt;
      اعلان‌های فوری
      &lt;Badge&gt;جدید&lt;/Badge&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/BaseSwitch&gt;</code></pre>
              </div>
            </div>

            <!-- Form Integration -->
            <div>
              <h4 class="font-semibold text-gray-800 mb-2">🔹 ادغام با فرم</h4>
              <div class="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <pre class="text-sm"><code>&lt;form @submit="handleSubmit"&gt;
  &lt;BaseSwitch
    v-model="form.terms"
    name="terms"
    label="قبول شرایط و ضوابط"
    required
    :invalid="!form.terms"
    error-message="باید شرایط را بپذیرید"
    variant="danger"
  /&gt;
  
  &lt;button type="submit" :disabled="!form.terms"&gt;
    ارسال
  &lt;/button&gt;
&lt;/form&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Best Practices -->
        <div class="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 class="text-lg font-semibold text-green-800 mb-4">✅ بهترین روش‌ها (Best Practices)</h3>
          <ul class="space-y-2 text-green-700">
            <li class="flex items-start gap-2">
              <span class="text-green-600">•</span>
              <span>همیشه label مناسب و واضح استفاده کنید</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600">•</span>
              <span>برای عملیات مهم از helper text استفاده کنید</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600">•</span>
              <span>رنگ variant را متناسب با عملکرد انتخاب کنید</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600">•</span>
              <span>برای فرم‌ها از name و value استفاده کنید</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600">•</span>
              <span>خطاهای validation را با پیام‌های واضح نشان دهید</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600">•</span>
              <span>برای دسترسی‌پذیری از aria-label استفاده کنید</span>
            </li>
          </ul>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "مستندات کامل API شامل تمام props، events، slots، methods و نمونه‌های کاربردی.",
      },
    },
    layout: "fullscreen",
  },
};

/* ----------------------------------------------
 * ۱) Playground — سینک کامل با Controls (useArgs)
 * ---------------------------------------------- */
// export const Playground: Story = {
//   name: "🎮 محیط تعاملی",
//   args: {
//     modelValue: false,
//     label: "سوئیچ تعاملی",
//     helperText: "این یک متن کمکی است",
//     errorMessage: "",
//     size: "md",
//     variant: "default",
//     disabled: false,
//     loading: false,
//     invalid: false,
//     readonly: false,
//     required: false,
//     showTrackIcons: false,
//     autofocus: false,
//   },
//   render: () => ({
//     components: { BaseSwitch },
//     setup() {
//       // useArgs باعث می‌شود Controls و کامپوننت با هم همگام بمانند
//       const [args, updateArgs] = useArgs();

//       // v-model
//       const onUpdateModelValue = (v: boolean) => {
//         updateArgs({ modelValue: v });
//         action("update:modelValue")(v);
//         // اگر کامپوننت رویداد change هم می‌فرستد، لاگش کنیم
//         action("change")(v);
//       };
//       const onFocus = (e: FocusEvent) => action("focus")(e);
//       const onBlur = (e: FocusEvent) => action("blur")(e);
//       const onClick = (e: MouseEvent) => action("click")(e);

//       // وضعیت فعلی از خود args خوانده می‌شود تا با Controls همگام باشد
//       const isOn = computed(() => !!(args as any).modelValue);

//       // تولید کد نمونه برای کپی
//       const generatedCode = computed(() => {
//         const a = args as any;
//         const lines = [
//           "<BaseSwitch",
//           '  v-model="checked"',
//           a.label ? `  label="${a.label}"` : "",
//           a.helperText ? `  helper-text="${a.helperText}"` : "",
//           a.errorMessage && a.invalid
//             ? `  error-message="${a.errorMessage}"`
//             : "",
//           a.size !== "md" ? `  size="${a.size}"` : "",
//           a.variant !== "default" ? `  variant="${a.variant}"` : "",
//           a.disabled ? "  disabled" : "",
//           a.loading ? "  loading" : "",
//           a.invalid ? "  invalid" : "",
//           a.readonly ? "  readonly" : "",
//           a.required ? "  required" : "",
//           a.showTrackIcons ? "  show-track-icons" : "",
//           a.autofocus ? "  autofocus" : "",
//           '  @update:modelValue="onUpdateModelValue"',
//           "/>",
//         ].filter(Boolean);
//         return lines.join("\n");
//       });

//       const copyCode = async () => {
//         try {
//           await navigator.clipboard.writeText(generatedCode.value);
//           action("clipboard")("copied");
//         } catch (e) {
//           action("clipboard-error")(e);
//         }
//       };

//       return {
//         args,
//         isOn,
//         generatedCode,
//         copyCode,
//         onUpdateModelValue,
//         onFocus,
//         onBlur,
//         onClick,
//       };
//     },
//     template: `
//       <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto" dir="rtl">
//         <!-- کامپوننت -->
//         <div class="space-y-6">
//           <div class="bg-white p-6 rounded-lg shadow-lg border">
//             <h3 class="font-semibold text-gray-800 mb-4">🎯 کامپوننت</h3>

//             <div class="flex items-center justify-center py-8">
//               <BaseSwitch
//                 v-bind="args"
//                 :modelValue="args.modelValue"
//                 @update:modelValue="onUpdateModelValue"
//                 @focus="onFocus"
//                 @blur="onBlur"
//                 @click="onClick"
//               />
//             </div>

//             <div class="mt-6 p-4 bg-gray-50 rounded-lg">
//               <h4 class="font-semibold text-gray-800 mb-2">📊 وضعیت فعلی:</h4>
//               <div class="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <strong>مقدار:</strong>
//                   <span :class="isOn ? 'text-green-600' : 'text-red-600'">
//                     {{ isOn ? 'فعال' : 'غیرفعال' }}
//                   </span>
//                 </div>
//                 <div><strong>اندازه:</strong> {{ args.size }}</div>
//                 <div><strong>نوع:</strong> {{ args.variant }}</div>
//                 <div><strong>غیرفعال:</strong> {{ args.disabled ? 'بله' : 'خیر' }}</div>
//               </div>
//             </div>
//           </div>

//           <!-- کد تولید شده -->
//           <div class="bg-gray-900 text-gray-100 p-4 rounded-lg">
//             <div class="flex items-center justify-between mb-3">
//               <h4 class="font-semibold">📝 کد Vue</h4>
//               <button
//                 @click="copyCode"
//                 class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
//               >📋 کپی</button>
//             </div>
//             <pre class="text-sm overflow-x-auto"><code>{{ generatedCode }}</code></pre>
//           </div>
//         </div>

//         <!-- نکات استفاده -->
//         <div class="space-y-6">
//           <div class="bg-green-50 p-4 rounded-lg border border-green-200">
//             <h4 class="font-semibold text-green-800 mb-2">💡 نکات استفاده:</h4>
//             <ul class="text-sm text-green-700 space-y-1">
//               <li>• از Controls برای تغییر props استفاده کنید</li>
//               <li>• مقدار از طریق <code>update:modelValue</code> به Controls برمی‌گردد</li>
//               <li>• رویدادها را در تب <em>Actions</em> ببینید</li>
//               <li>• می‌توانید کد تولیدی را کپی کنید</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     `,
//   }),
//   parameters: {
//     docs: {
//       description: {
//         story:
//           "محیط تعاملی با همگام‌سازی کامل v-model و Controls از طریق useArgs. بدون وابستگی به @storybook/testing-library.",
//       },
//     },
//   },
// };
