import type { Meta, StoryObj } from "@storybook/vue3";
import { ref, watch } from "vue";
import { action } from "storybook/actions";
import BaseStepper from "./BaseStepper.vue";
import type { StepItem } from "./BaseStepper.vue";

const meta: Meta<typeof BaseStepper> = {
  title: "FORM/BaseStepper",
  component: BaseStepper,
  args: {
    allowStepValidation: false,
    // می‌تونی اینا رو هم بذاری تا تجربه دمویی بهتر شه:
    showControls: true,
    showIndicators: true,
    showStepHeaders: true,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# BaseStepper

کامپوننت BaseStepper یک رابط کاربری قدرتمند و انعطاف‌پذیر برای هدایت کاربران در فرآیندهای چندمرحله‌ای است.
این کامپوننت ترکیبی از بهترین ویژگی‌های PrimeVue و Material-UI ارائه می‌دهد.

## ویژگی‌های کلیدی:
- پشتیبانی از حالت‌های خطی و غیرخطی
- قابلیت ناوبری از طریق هدر
- نمایش پیشرفت با نوار پیشرفت
- پشتیبانی کامل از accessibility
- انیمیشن‌های روان و زیبا
- پشتیبانی از تم تاریک و روشن
- طراحی ریسپانسیو
- پشتیبانی از RTL
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "جهت نمایش مراحل",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "اندازه کامپوننت",
    },
    linear: {
      control: "boolean",
      description: "آیا مراحل باید به ترتیب طی شوند",
    },
    showControls: {
      control: "boolean",
      description: "نمایش دکمه‌های ناوبری",
    },
    showIndicators: {
      control: "boolean",
      description: "نمایش نشانگرهای مراحل",
    },
    showProgressBar: {
      control: "boolean",
      description: "نمایش نوار پیشرفت",
    },
    showStepHeaders: {
      control: "boolean",
      description: "نمایش هدر مراحل",
    },
    headerNavigation: {
      control: "boolean",
      description: "امکان ناوبری از طریق هدر",
    },
    allowStepValidation: {
      control: "boolean",
      description: "الزام تکمیل شدن مرحله فعلی برای رفتن به بعدی",
    },
    iconSize: {
      control: { type: "number", min: 12, max: 48, step: 1 },
      description: "سایز آیکن مرحله",
    },
    nextLabel: { control: "text" },
    backLabel: { control: "text" },
    finishLabel: { control: "text" },
    headerLabel: { control: "text" },
    readonly: {
      control: "boolean",
      description: "حالت فقط خواندنی",
    },
    disabled: {
      control: "boolean",
      description: "غیرفعال کردن کامپوننت",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BaseStepper>;

// ---------- Sample data ----------
const basicSteps: StepItem[] = [
  {
    label: "اطلاعات شخصی",
    description: "وارد کردن اطلاعات پایه",
    icon: "user",
  },
  {
    label: "تنظیمات حساب",
    description: "پیکربندی حساب کاربری",
    icon: "settings",
  },
  { label: "تأیید نهایی", description: "بررسی و تأیید اطلاعات", icon: "check" },
];

const extendedSteps: StepItem[] = [
  { label: "شروع", description: "خوش آمدید! بیایید شروع کنیم", icon: "home" },
  {
    label: "اطلاعات کاربری",
    description: "وارد کردن نام، ایمیل و شماره تلفن",
    icon: "user",
  },
  {
    label: "آدرس و مکان",
    description: "اطلاعات آدرس و محل سکونت",
    icon: "info",
  },
  {
    label: "تنظیمات امنیتی",
    description: "رمز عبور و تنظیمات دوفاکتوره",
    icon: "settings",
    optional: true,
  },
  { label: "پرداخت", description: "اطلاعات کارت و صورتحساب", icon: "info" },
  {
    label: "تکمیل ثبت‌نام",
    description: "تأیید نهایی و ایجاد حساب",
    icon: "check",
  },
];

const stepsWithErrors: StepItem[] = [
  {
    label: "اطلاعات شخصی",
    description: "وارد کردن اطلاعات پایه",
    icon: "user",
    completed: true,
  },
  {
    label: "تنظیمات حساب",
    description: "خطا در اعتبارسنجی رمز عبور",
    icon: "settings",
    error: true,
  },
  {
    label: "تأیید نهایی",
    description: "بررسی و تأیید اطلاعات",
    icon: "check",
    disabled: true,
  },
];

// ---------- Actions ----------
const log = {
  emitModelUpdate: action("update:modelValue"), // ← فقط این یکی rename شد
  onStepChange: action("step-change"),
  onBeforeStepChange: action("before-step-change"),
  onStepComplete: action("step-complete"),
  onFinish: action("finish"),
  onBack: action("back"),
  onNext: action("next"),
};

// ---------- Stories ----------

// Default
export const Default: Story = {
  args: { steps: basicSteps, modelValue: 0, allowStepValidation: false },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(args.modelValue || 0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate, ...log };
    },
    //   <input type="checkbox" v-model="step.completed" style="margin: 0;" />

    template: `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <BaseStepper
          v-bind="args"
          :model-value="currentStep"
          @update:modelValue="onUpdate"
          @step-change="onStepChange"
          @finish="onFinish"
        >
          <template v-slot:['step-0']="{ step }">
            <div style="; text-align: center; direction: rtl;">
              <h3 style="margin-bottom: 16px; color: var(--color-text);">{{ step.label }}</h3>
              <p style="color: var(--color-muted); margin-bottom: 24px;">لطفاً اطلاعات شخصی خود را وارد کنید</p>
              <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; margin: 0 auto;">
                <input type="text" placeholder="نام کامل" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <input type="email" placeholder="ایمیل" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <input type="tel" placeholder="شماره تلفن" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />



              </div>
            </div>
          </template>

          <template v-slot:['step-1']="{ step }">
            <div style="; text-align: center; direction: rtl;">
              <h3 style="margin-bottom: 16px; color: var(--color-text);">{{ step.label }}</h3>
              <p style="color: var(--color-muted); margin-bottom: 24px;">تنظیمات حساب کاربری خود را انجام دهید</p>
              <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; margin: 0 auto;">
                <input type="text" placeholder="نام کاربری" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <input type="password" placeholder="رمز عبور" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <input type="password" placeholder="تکرار رمز عبور" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
              </div>
            </div>
          </template>

          <template v-slot:['step-2']="{ step }">
            <div style="; text-align: center; direction: rtl;">
              <h3 style="margin-bottom: 16px; color: var(--color-success);">{{ step.label }}</h3>
              <p style="color: var(--color-muted); margin-bottom: 24px;">اطلاعات شما با موفقیت ثبت شد</p>
              <div style="padding: 20px; background: var(--color-surface); border-radius: 8px; border: 1px solid var(--color-border);">
                <h4 style="margin: 0 0 12px 0; color: var(--color-text);">خلاصه اطلاعات:</h4>
                <ul style="text-align: right; color: var(--color-muted); line-height: 1.6;">
                  <li>اطلاعات شخصی: ✓ تکمیل شده</li>
                  <li>تنظیمات حساب: ✓ تکمیل شده</li>
                  <li>وضعیت: آماده برای فعال‌سازی</li>
                </ul>
              </div>
            </div>
          </template>
        </BaseStepper>
      </div>
    `,
  }),
};

// Linear
export const Linear: Story = {
  args: {
    steps: basicSteps,
    linear: true,
    showProgressBar: true,
    allowStepValidation: false,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">حالت خطی (Linear)</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Non-Linear with Header Navigation
export const NonLinearWithHeader: Story = {
  args: {
    steps: extendedSteps,
    linear: false,
    headerNavigation: true,
    showProgressBar: true,
    size: "large",
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div style="max-width: 1000px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">حالت غیرخطی با ناوبری هدر</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Vertical Layout (با مقداردهی پویا به --active-step)
export const Vertical: Story = {
  args: {
    steps: basicSteps,
    variant: "vertical",
    showStepHeaders: true,
    linear: false,
    showProgressBar: false,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div :style="{ '--active-step': String(currentStep) }" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">حالت عمودی</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// With Errors
export const WithErrors: Story = {
  args: {
    steps: stepsWithErrors,
    linear: false,
    headerNavigation: true,
    allowStepValidation: true,
    headerConnectors: true,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">حالت با خطا</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Small Size
export const SmallSize: Story = {
  args: {
    steps: basicSteps,
    size: "small",
    showProgressBar: true,
    iconSize: 16,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">اندازه کوچک</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Large Size
export const LargeSize: Story = {
  args: {
    steps: extendedSteps,
    size: "large",
    headerNavigation: true,
    showProgressBar: true,
    iconSize: 24,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(2);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">اندازه بزرگ</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Readonly
export const Readonly: Story = {
  args: {
    steps: [
      { ...basicSteps[0], completed: true },
      { ...basicSteps[1], completed: true },
      { ...basicSteps[2], completed: false },
    ],
    readonly: true,
    showProgressBar: true,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(2);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">حالت فقط خواندنی</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Disabled
export const Disabled: Story = {
  args: {
    steps: basicSteps,
    disabled: true,
    showProgressBar: true,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(1);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">حالت غیرفعال</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Custom Content
export const CustomContent: Story = {
  args: {
    steps: [
      {
        label: "انتخاب محصول",
        description: "محصول مورد نظر خود را انتخاب کنید",
      },
      { label: "سفارش‌سازی", description: "تنظیمات و گزینه‌های اضافی" },
      { label: "پرداخت", description: "تکمیل فرآیند خرید" },
    ],
    linear: false,
    headerNavigation: true,
    allowStepValidation: true,
    showProgressBar: true,
    size: "medium",
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const selectedProduct = ref("");
      const selectedOptions = ref<string[]>([]);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, selectedProduct, selectedOptions, onUpdate };
    },
    template: `
      <div style="max-width: 900px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">محتوای سفارشی</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate">
          <template v-slot:['step-0']="{ step }">
            <div style="; direction: rtl;">
              <h3 style="margin-bottom: 20px; text-align: center;">انتخاب محصول</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <div v-for="product in ['لپ‌تاپ گیمینگ', 'لپ‌تاپ اداری', 'لپ‌تاپ طراحی']"
                     :key="product"
                     @click="selectedProduct = product"
                     style="padding: 20px; border: 2px solid var(--color-border); border-radius: 12px; cursor: pointer; text-align: center; transition: all 0.2s;"
                     :style="{
                       borderColor: selectedProduct === product ? 'var(--color-primary)' : 'var(--color-border)',
                       background: selectedProduct === product ? 'rgba(30, 135, 89, 0.1)' : 'transparent'
                     }">
                  <h4 style="margin: 0 0 8px 0;">{{ product }}</h4>
                  <p style="margin: 0; color: var(--color-muted); font-size: 14px;">از {{ product }} انتخاب کنید</p>
                </div>
              </div>
              <p v-if="selectedProduct" style="margin-top: 20px; text-align: center; color: var(--color-success);">
                ✓ {{ selectedProduct }} انتخاب شد
              </p>
            </div>
            <input type="checkbox" v-model="step.completed" style="margin: 0;" />

          </template>

          <template v-slot:['step-1']="{ step }">
            <div style="; direction: rtl;">
              <h3 style="margin-bottom: 20px; text-align: center;">سفارش‌سازی محصول</h3>
              <div style="max-width: 500px; margin: 0 auto;">
                <div style="margin-bottom: 20px;">
                  <label style="display: block; margin-bottom: 8px; font-weight: 500;">گزینه‌های اضافی:</label>
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    <label v-for="option in ['ضمانت تمدید', 'نصب نرم‌افزار', 'آموزش استفاده']" :key="option" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="checkbox" :value="option" v-model="selectedOptions" style="margin: 0;" />
                      <span>{{ option }}</span>
                    </label>
                  </div>
                </div>
                <div style="padding: 16px; background: var(--color-surface); border-radius: 8px;">
                  <h4 style="margin: 0 0 8px 0;">خلاصه سفارش:</h4>
                  <p style="margin: 0; color: var(--color-muted);">محصول: {{ selectedProduct || 'انتخاب نشده' }}</p>
                  <p style="margin: 0; color: var(--color-muted);">گزینه‌ها: {{ selectedOptions.length }} مورد</p>
                </div>
              </div>
            </div>
                        <input type="checkbox" v-model="step.completed" style="margin: 0;" />

          </template>

          <template v-slot:['step-2']="{ step }">
            <div style="; text-align: center; direction: rtl;">
              <h3 style="margin-bottom: 20px; color: var(--color-success);">پرداخت و تکمیل</h3>
              <div style="max-width: 400px; margin: 0 auto;">
                <div style="; background: var(--color-surface); border-radius: 12px; border: 1px solid var(--color-border);">
                  <h4 style="margin: 0 0 16px 0; color: var(--color-text);">فاکتور نهایی</h4>
                  <div style="text-align: right; line-height: 1.8;">
                    <p style="margin: 0; display: flex; justify-content: space-between;"><span>محصول:</span><strong>{{ selectedProduct || '---' }}</strong></p>
                    <p style="margin: 0; display: flex; justify-content: space-between;"><span>گزینه‌های اضافی:</span><strong>{{ selectedOptions.length }} مورد</strong></p>
                    <hr style="margin: 12px 0; border: none; border-top: 1px solid var(--color-border);" />
                    <p style="margin: 0; display: flex; justify-content: space-between; font-size: 18px;"><span>مبلغ کل:</span><strong style="color: var(--color-primary);">2,500,000 تومان</strong></p>
                  </div>
                  <button style="width: 100%; margin-top: 20px; padding: 12px; background: var(--color-success); color: white; border: none; border-radius: 8px; font-family: inherit; cursor: pointer;">پرداخت نهایی</button>
                </div>
              </div>
            </div>
          </template>
        </BaseStepper>
      </div>
    `,
  }),
};

// Interactive Form (اصلاح‌شده با کنترل تکمیل مرحله)
export const InteractiveForm: Story = {
  args: {
    steps: [
      { label: "اطلاعات فردی", description: "نام، سن و جنسیت", icon: "user" },
      {
        label: "اطلاعات تماس",
        description: "ایمیل، تلفن و آدرس",
        icon: "info",
      },
      {
        label: "تنظیمات حساب",
        description: "نام کاربری و رمز عبور",
        icon: "settings",
      },
      {
        label: "تأیید نهایی",
        description: "بررسی و ثبت اطلاعات",
        icon: "check",
      },
    ],
    linear: true,
    headerNavigation: false,
    showProgressBar: true,
    allowStepValidation: true,
    size: "medium",
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const stepper = ref<InstanceType<typeof BaseStepper> | null>(null);

      const formData = ref({
        personalInfo: { name: "", age: "", gender: "" },
        contactInfo: { email: "", phone: "", address: "" },
        accountInfo: { username: "", password: "", confirmPassword: "" },
      });

      const validateStep = (step: number) => {
        switch (step) {
          case 0:
            return (
              !!formData.value.personalInfo.name &&
              !!formData.value.personalInfo.age
            );
          case 1:
            return (
              !!formData.value.contactInfo.email &&
              !!formData.value.contactInfo.phone
            );
          case 2:
            return (
              !!formData.value.accountInfo.username &&
              formData.value.accountInfo.password ===
                formData.value.accountInfo.confirmPassword
            );
          default:
            return true;
        }
      };

      const syncCompletion = () => {
        for (const i of [0, 1, 2]) {
          if (validateStep(i)) stepper.value?.markStepCompleted(i);
          else stepper.value?.markStepIncomplete(i);
        }
      };

      watch(formData, syncCompletion, { deep: true, immediate: true });

      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };

      return { args, currentStep, formData, validateStep, stepper, onUpdate };
    },
    template: `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">فرم تعاملی با اعتبارسنجی</h2>
        <BaseStepper
          ref="stepper"
          v-bind="args"
          :model-value="currentStep"
          @update:modelValue="onUpdate"
        >
          <template #step-0>
            <div style="; direction: rtl;">
              <h3 style="margin-bottom: 20px; text-align: center;">اطلاعات فردی</h3>
              <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; margin: 0 auto;">
                <input v-model="formData.personalInfo.name" type="text" placeholder="نام کامل *" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <input v-model="formData.personalInfo.age" type="number" placeholder="سن *" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <select v-model="formData.personalInfo.gender" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;">
                  <option value="">انتخاب جنسیت</option>
                  <option value="male">مرد</option>
                  <option value="female">زن</option>
                  <option value="other">سایر</option>
                </select>
              </div>
              <p v-if="!validateStep(0)" style="color: var(--color-error); text-align: center; margin-top: 16px;">
                لطفاً فیلدهای ضروری را پر کنید
              </p>
            </div>
          </template>

          <template #step-1>
            <div style="; direction: rtl;">
              <h3 style="margin-bottom: 20px; text-align: center;">اطلاعات تماس</h3>
              <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; margin: 0 auto;">
                <input v-model="formData.contactInfo.email" type="email" placeholder="ایمیل *" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <input v-model="formData.contactInfo.phone" type="tel" placeholder="شماره تلفن *" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <textarea v-model="formData.contactInfo.address" placeholder="آدرس" rows="3" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit; resize: vertical;"></textarea>
              </div>
              <p v-if="!validateStep(1)" style="color: var(--color-error); text-align: center; margin-top: 16px;">
                لطفاً ایمیل و شماره تلفن را وارد کنید
              </p>
            </div>
          </template>

          <template #step-2>
            <div style="; direction: rtl;">
              <h3 style="margin-bottom: 20px; text-align: center;">تنظیمات حساب</h3>
              <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; margin: 0 auto;">
                <input v-model="formData.accountInfo.username" type="text" placeholder="نام کاربری *" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <input v-model="formData.accountInfo.password" type="password" placeholder="رمز عبور *" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
                <input v-model="formData.accountInfo.confirmPassword" type="password" placeholder="تکرار رمز عبور *" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit;" />
              </div>
              <p v-if="!validateStep(2)" style="color: var(--color-error); text-align: center; margin-top: 16px;">
                لطفاً نام کاربری و رمز عبور معتبر وارد کنید
              </p>
            </div>
          </template>

          <template #step-3>
            <div style="; text-align: center; direction: rtl;">
              <h3 style="margin-bottom: 20px; color: var(--color-success);">تبریک! اطلاعات شما ثبت شد</h3>
              <div style="; background: var(--color-surface); border-radius: 12px; max-width: 500px; margin: 0 auto;">
                <h4 style="margin: 0 0 16px 0;">خلاصه اطلاعات ثبت شده:</h4>
                <div style="text-align: right; line-height: 1.8; color: var(--color-muted);">
                  <p><strong>نام:</strong> {{ formData.personalInfo.name || '---' }}</p>
                  <p><strong>سن:</strong> {{ formData.personalInfo.age || '---' }}</p>
                  <p><strong>ایمیل:</strong> {{ formData.contactInfo.email || '---' }}</p>
                  <p><strong>تلفن:</strong> {{ formData.contactInfo.phone || '---' }}</p>
                  <p><strong>نام کاربری:</strong> {{ formData.accountInfo.username || '---' }}</p>
                </div>
              </div>
            </div>
          </template>
        </BaseStepper>
      </div>
    `,
  }),
};

// Minimal UI
export const MinimalUI: Story = {
  args: {
    steps: basicSteps,
    showStepHeaders: false,
    showControls: true,
    showIndicators: true,
    showProgressBar: false,
    headerNavigation: false,
    size: "small",
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">رابط کاربری مینیمال</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Complete Showcase
export const CompleteShowcase: Story = {
  args: {
    steps: [
      { label: "خوش آمدید", description: "شروع فرآیند ثبت‌نام", icon: "home" },
      {
        label: "اطلاعات شخصی",
        description: "وارد کردن اطلاعات فردی",
        icon: "user",
      },
      {
        label: "تنظیمات پیشرفته",
        description: "تنظیمات اختیاری حساب",
        icon: "settings",
        optional: true,
      },
      {
        label: "تأیید ایمیل",
        description: "ارسال کد تأیید به ایمیل",
        icon: "info",
      },
      {
        label: "تکمیل ثبت‌نام",
        description: "نهایی کردن فرآیند",
        icon: "check",
      },
    ],
    linear: false,
    headerNavigation: true,
    showProgressBar: true,
    showStepHeaders: true,
    showControls: true,
    showIndicators: true,
    size: "large",
    iconSize: 20,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate, ...log };
    },
    template: `
      <div style="max-width: 1000px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">نمایش کامل تمام قابلیت‌ها</h2>
        <BaseStepper
          v-bind="args"
          :model-value="currentStep"
          @update:modelValue="onUpdate"
          @step-change="onStepChange"
          @finish="onFinish"
        />
      </div>
    `,
  }),
};

// Mobile Responsive
export const MobileResponsive: Story = {
  args: {
    steps: extendedSteps,
    headerNavigation: true,
    showProgressBar: true,
    size: "medium",
  },
  parameters: {
    viewport: { defaultViewport: "iphone6" },
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div style="padding: 16px;">
        <h2 style="margin-bottom: 16px; text-align: center; font-size: 18px;">نمایش موبایل</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Dark Theme
export const DarkTheme: Story = {
  args: {
    steps: basicSteps,
    headerNavigation: true,
    showProgressBar: true,
    size: "medium",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate };
    },
    template: `
      <div data-theme="dark" style="max-width: 800px; margin: 0 auto; padding: 20px; background: #1f2937; min-height: 500px;">
        <h2 style="margin-bottom: 20px; text-align: center; color: white;">تم تاریک</h2>
        <BaseStepper v-bind="args" :model-value="currentStep" @update:modelValue="onUpdate" />
      </div>
    `,
  }),
};

// Playground
export const Playground: Story = {
  args: {
    steps: extendedSteps,
    linear: true,
    variant: "horizontal",
    size: "medium",
    showControls: true,
    showIndicators: true,
    showProgressBar: true,
    showStepHeaders: true,
    headerNavigation: false,
    allowStepValidation: false,
    iconSize: 20,
    readonly: false,
    disabled: false,
  },
  render: (args) => ({
    components: { BaseStepper },
    setup() {
      const currentStep = ref(0);
      const onUpdate = (v: number) => {
        currentStep.value = v;
        log.emitModelUpdate(v);
      };
      return { args, currentStep, onUpdate, ...log };
    },
    template: `
      <div style="max-width: 1000px; margin: 0 auto; padding: 20px;">
        <h2 style="margin-bottom: 20px; text-align: center;">محیط آزمایش - تمام کنترل‌ها</h2>
        <p style="text-align: center; color: var(--color-muted); margin-bottom: 20px;">از کنترل‌های Storybook برای تست تمام حالت‌ها استفاده کنید</p>
        <BaseStepper
          v-bind="args"
          :model-value="currentStep"
          @update:modelValue="onUpdate"
          @step-change="onStepChange"
          @before-step-change="onBeforeStepChange"
          @step-complete="onStepComplete"
          @finish="onFinish"
          @next="onNext"
          @back="onBack"
        />
        <div style="margin-top: 24px; padding: 16px; background: var(--color-surface); border-radius: 8px; direction: rtl;">
          <h4 style="margin: 0 0 12px 0;">وضعیت فعلی:</h4>
          <p style="margin: 0; color: var(--color-muted);">مرحله فعال: {{ currentStep + 1 }}</p>
        </div>
      </div>
    `,
  }),
};
