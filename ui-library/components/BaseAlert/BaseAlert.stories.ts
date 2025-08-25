/* BaseAlert.stories.ts
 * Vue 3 + TS + Composition API (بدون Tailwind)
 * پوشش‌دهنده همه حالت‌ها + Docs مفصل
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import BaseAlert from './BaseAlert.vue';

// ======= Meta =======
const meta = {
  title: 'Feedback/BaseAlert',
  component: BaseAlert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { expanded: true, sort: 'requiredFirst' },
    options: { storySort: { order: ['Overview', 'Variants', 'Sizes', 'Positions', 'Inputs', 'Validation', 'Async', 'Persistent', 'Dark', 'Playground'] } },
    docs: {
      description: {
        component: `
**BaseAlert** یک دیالوگ بازخوردی با تمرکز بر دسترس‌پذیری، ورودی‌های اختیاری، و اکشن‌های قابل‌برنامه‌ریزی است.
- از \`Teleport\` برای رندر روی \`<body>\` استفاده می‌کند و با \`ESC\` (در صورت \`keyboardClose\`) بسته می‌شود.
- نقش مناسب ARIA و \`aria-labelledby\`/ \`aria-describedby\` را تنظیم می‌کند.
- از توکن‌های طراحی پروژه برای رنگ‌ها، z-index و… پیروی می‌کند. برای نتیجه‌ی بصری دقیق، CSS تم را در \`.storybook/preview.ts\` ایمپورت کنید.
      `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'باز/بسته بودن دیالوگ (v-model:isOpen)',
      table: { category: 'State' }
    },
    header: { control: 'text', description: 'تیتر اصلی', table: { category: 'Content' } },
    subHeader: { control: 'text', description: 'تیتر فرعی', table: { category: 'Content' } },
    message: { control: 'text', description: 'پیام (از HTML امن پشتیبانی می‌کند)', table: { category: 'Content' } },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: 'واریانت رنگی و آیکن',
      table: { category: 'Appearance' }
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['small', 'medium', 'large'],
      description: 'سایز کلی کارت',
      table: { category: 'Layout' }
    },
    position: {
      control: { type: 'inline-radio' },
      options: ['center', 'top', 'bottom'],
      description: 'موقعیت روی صفحه',
      table: { category: 'Layout' }
    },
    backdropDismiss: {
      control: 'boolean',
      description: 'بستن با کلیک روی بک‌دراپ',
      table: { category: 'Behavior' }
    },
    keyboardClose: {
      control: 'boolean',
      description: 'بستن با کلید ESC',
      table: { category: 'Behavior' }
    },
    persistent: {
      control: 'boolean',
      description: 'حالت persistent (مثلاً هنگام loading)',
      table: { category: 'Behavior' }
    },
    showCloseButton: {
      control: 'boolean',
      description: 'نمایش دکمه ×',
      table: { category: 'Appearance' }
    },
    inputs: {
      control: 'object',
      description: 'تعریف ورودی‌ها (text/textarea/radio/checkbox/…)',
      table: { category: 'Forms' }
    },
    buttons: {
      control: 'object',
      description: 'تعریف دکمه‌ها با نقش و handler اختیاری (async هم ممکن است)',
      table: { category: 'Actions' }
    },
    htmlAttributes: { control: 'object', table: { category: 'Advanced' } },
    animated: { control: 'boolean', table: { category: 'Advanced' } }
  },
  args: {
    isOpen: false,
    header: 'عنوان عملیات',
    subHeader: 'یک توضیح کوتاه درباره این عملیات',
    message: 'مطمئن هستید که می‌خواهید ادامه دهید؟',
    variant: 'default',
    size: 'medium',
    position: 'center',
    backdropDismiss: true,
    keyboardClose: true,
    showCloseButton: true,
    buttons: [
      { text: 'انصراف', role: 'cancel' },
      {
        text: 'تایید',
        role: 'confirm',
        handler: () => { /* در نمونه‌ها override می‌کنیم */ }
      }
    ]
  }
} satisfies Meta<typeof BaseAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

// ======= یک رندر مشترک: دکمه‌ی نمایش + v-model =======
function makeRender() {
  return (args: any) => ({
    components: { BaseAlert },
    setup() {
      const open = ref<boolean>(args.isOpen ?? false);
      watch(() => args.isOpen, v => (open.value = v));

      const onUpdate = (v: boolean) => {
        open.value = v;
        args.isOpen = v;
      };
      const show = () => (open.value = true);

      // تمیزکاری تم تاریک برای استوری‌های Dark
      const restoreThemeAttr = document.documentElement.getAttribute('data-theme') || '';
      onMounted(() => { /* nothing */ });
      onBeforeUnmount(() => {
        document.documentElement.setAttribute('data-theme', restoreThemeAttr);
      });

      return { args, open, onUpdate, show };
    },
    template: `
      <div dir="rtl" style="min-height:60vh; display:flex; align-items:center; justify-content:center; gap:16px">
        <button
          type="button"
          style="padding:.5rem 1rem; border:1px solid var(--color-border); border-radius:8px; background:var(--color-surface)"
          @click="show"
        >نمایش آلارم</button>

        <BaseAlert v-bind="args" :isOpen="open" @update:isOpen="onUpdate" />
      </div>
    `
  });
}

// ======= 1) Overview =======
export const Overview: Story = {
  name: 'Overview',
  render: makeRender(),
  args: {
    header: 'حذف آیتم',
    subHeader: 'این عملیات قابل بازگشت نیست',
    message: 'آیا از حذف این آیتم مطمئن هستید؟',
    variant: 'warning',
    showCloseButton: true,
    buttons: [
      { text: 'انصراف', role: 'cancel' },
      {
        text: 'حذف',
        role: 'destructive',
        handler: () => { /* return void -> بسته می‌شود */ }
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'مرور کلی از کامپوننت با واریانت هشدار و دو دکمه.'
      }
    }
  }
};

// ======= 2) Variants =======
export const Variants_Success: Story = {
  name: 'Variants / Success',
  render: makeRender(),
  args: { variant: 'success', header: 'موفقیت‌آمیز', message: 'عملیات با موفقیت انجام شد.' }
};
export const Variants_Error: Story = {
  name: 'Variants / Error',
  render: makeRender(),
  args: { variant: 'error', header: 'خطا', message: 'متاسفانه مشکلی رخ داد.' }
};
export const Variants_Warning: Story = {
  name: 'Variants / Warning',
  render: makeRender(),
  args: { variant: 'warning', header: 'هشدار', message: 'این اقدام غیرقابل بازگشت است.' }
};
export const Variants_Info: Story = {
  name: 'Variants / Info',
  render: makeRender(),
  args: { variant: 'info', header: 'اطلاع', message: 'نسخه جدید در دسترس است.' }
};

// ======= 3) Sizes =======
export const Size_Small: Story = {
  name: 'Sizes / Small',
  render: makeRender(),
  args: { size: 'small', header: 'سایز کوچک' }
};
export const Size_Medium: Story = {
  name: 'Sizes / Medium',
  render: makeRender(),
  args: { size: 'medium', header: 'سایز متوسط' }
};
export const Size_Large: Story = {
  name: 'Sizes / Large',
  render: makeRender(),
  args: { size: 'large', header: 'سایز بزرگ' }
};

// ======= 4) Positions =======
export const Position_Top: Story = {
  name: 'Positions / Top',
  render: makeRender(),
  args: { position: 'top', header: 'بالا' }
};
export const Position_Center: Story = {
  name: 'Positions / Center',
  render: makeRender(),
  args: { position: 'center', header: 'وسط' }
};
export const Position_Bottom: Story = {
  name: 'Positions / Bottom',
  render: makeRender(),
  args: { position: 'bottom', header: 'پایین' }
};

// ======= 5) Inputs (Forms) =======
export const WithInputs: Story = {
  name: 'Inputs / Mixed',
  render: makeRender(),
  args: {
    header: 'فرم سریع',
    message: 'اطلاعات زیر را تکمیل کنید.',
    inputs: [
      { type: 'text', name: 'fullName', label: 'نام و نام خانوادگی', placeholder: 'مثلاً علی رضایی', required: true },
      { type: 'email', name: 'email', label: 'ایمیل', placeholder: 'you@example.com', required: true },
      { type: 'textarea', name: 'desc', label: 'توضیحات', rows: 3 },
      {
        type: 'radio', name: 'plan', label: 'پلن',
        options: [
          { text: 'رایگان', value: 'free' },
          { text: 'حرفه‌ای', value: 'pro' }
        ],
        value: 'free'
      },
      {
        type: 'checkbox', name: 'features', label: 'امکانات',
        options: [
          { text: 'گزارش‌گیری', value: 'reports' },
          { text: 'پشتیبانی ۲۴/۷', value: 'support' }
        ],
        value: ['reports']
      }
    ],
    buttons: [
      { text: 'انصراف', role: 'cancel' },
      {
        text: 'ارسال',
        role: 'confirm',
        handler: (data?: any) => {
          // به عنوان نمونه: چاپ داده‌ها
          // eslint-disable-next-line no-console
          console.log('Form data:', data);
        }
      }
    ]
  },
  parameters: {
    docs: {
      description: { story: 'نمونه‌ای از ترکیب ورودی‌های متنی، رادیویی و چک‌باکس.' }
    }
  }
};

// ======= 6) Validation =======
export const WithValidation: Story = {
  name: 'Validation',
  render: makeRender(),
  args: {
    header: 'اعتبارسنجی ورودی‌ها',
    message: 'برخی فیلدها اجباری هستند.',
    inputs: [
      { type: 'text', name: 'username', label: 'نام کاربری', required: true, validation: { minLength: 3 } },
      { type: 'password', name: 'password', label: 'رمز عبور', required: true, validation: { minLength: 6 } },
      { type: 'tel', name: 'phone', label: 'موبایل', validation: { pattern: '^09\\d{9}$' }, placeholder: 'مثلاً 09123456789' }
    ],
    buttons: [
      { text: 'بستن', role: 'cancel' },
      {
        text: 'ثبت',
        role: 'confirm',
        handler: () => { /* validateAllInputs درون کامپوننت انجام می‌شود */ }
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          'در صورتی که ورودی‌ها معتبر نباشند، دکمه تأیید عمل نمی‌کند. برای نمایش پیام خطا در UI می‌توانید از رویداد `inputValidate` استفاده کنید.'
      }
    }
  }
};

// ======= 7) Async handlers (Loading) =======
export const AsyncConfirm: Story = {
  name: 'Async / Confirm',
  render: makeRender(),
  args: {
    header: 'ارسال اطلاعات',
    message: 'در حال ارسال… در این حالت امکان بستن وجود ندارد.',
    persistent: true,
    buttons: [
      { text: 'انصراف', role: 'cancel', disabled: true },
      {
        text: 'تایید',
        role: 'confirm',
        // شبیه‌سازی درخواست Async
        handler: async () => {
          await new Promise(r => setTimeout(r, 2000));
          // return void -> بعد از اتمام بسته می‌شود
        }
      }
    ]
  },
  parameters: {
    docs: { description: { story: 'Handler تایید به‌صورت Async اجرا می‌شود و تا اتمام، دیالوگ persistent است.' } }
  }
};

// ======= 8) Persistent (بدون بستن با بک‌دراپ/ESC) =======
export const Persistent: Story = {
  name: 'Persistent',
  render: makeRender(),
  args: {
    header: 'عدم امکان خروج',
    message: 'تا تکمیل فرآیند، بستن غیرفعال است.',
    persistent: true,
    backdropDismiss: false,
    keyboardClose: false,
    showCloseButton: false,
    buttons: [
      {
        text: 'تمام شد',
        role: 'confirm',
        handler: async () => { await new Promise(r => setTimeout(r, 800)); }
      }
    ]
  }
};

// ======= 9) Dark Theme =======
export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: (args) => ({
    components: { BaseAlert },
    setup() {
      const open = ref<boolean>(true);
      const onUpdate = (v: boolean) => (open.value = v);
      // فعال‌سازی تم تاریک فقط برای این استوری
      const prev = document.documentElement.getAttribute('data-theme') || '';
      document.documentElement.setAttribute('data-theme', 'dark');
      onBeforeUnmount(() => document.documentElement.setAttribute('data-theme', prev));
      return { args, open, onUpdate };
    },
    template: `
      <div dir="rtl" style="min-height:60vh; display:flex; align-items:center; justify-content:center">
        <BaseAlert v-bind="args" :isOpen="open" @update:isOpen="onUpdate" />
      </div>
    `
  }),
  args: {
    header: 'حالت تیره',
    message: 'این نمونه در تم تیره نمایش داده می‌شود.',
    variant: 'info',
    isOpen: true
  },
  parameters: {
    docs: { description: { story: 'برای تم تیره از `[data-theme="dark"]` استفاده می‌شود.' } }
  }
};

// ======= 10) Playground (با کنترل کامل) =======
export const Playground: Story = {
  name: 'Playground',
  render: makeRender(),
  args: {
    header: 'پلِی‌گراند',
    message: 'هر پارامتر را از Controls تغییر دهید.',
    isOpen: false
  },
  parameters: {
    controls: { expanded: true }
  }
};
