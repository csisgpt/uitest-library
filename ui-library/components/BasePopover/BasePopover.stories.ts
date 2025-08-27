import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, reactive } from 'vue'
import BasePopover from './BasePopover.vue'
import type { PopoverAction } from './BasePopover.vue'

const meta: Meta<typeof BasePopover> = {
  title: 'Components/BasePopover',
  component: BasePopover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# BasePopover

کامپوننت Popover مینیمال، زیبا و کاربردی با استفاده از توکن‌های طراحی پروژه.

## ویژگی‌ها
- 🎯 انواع تریگر مختلف (click, hover, focus, manual)
- 📍 موقعیت‌یابی هوشمند با 12+ گزینه
- 🎨 3 سایز و انیمیشن‌های زیبا
- ♿ دسترسی‌پذیری کامل
- 🌓 پشتیبانی از تم تاریک
- 📱 ریسپانسیو
- ⚡ TypeScript
- 🎭 قابل سفارشی‌سازی

## استفاده
\`\`\`vue
<BasePopover
  title="تأیید"
  content="آیا مطمئن هستید؟"
  :actions="[
    { text: 'لغو', variant: 'secondary' },
    { text: 'حذف', variant: 'error', handler: deleteItem }
  ]"
/>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'کنترل نمایش popover'
    },
    trigger: {
      control: { type: 'select' },
      options: ['click', 'hover', 'focus', 'manual'],
      description: 'نحوه فعال‌سازی popover'
    },
    placement: {
      control: { type: 'select' },
      options: [
        'auto', 'auto-start', 'auto-end',
        'top', 'top-start', 'top-end', 
        'bottom', 'bottom-start', 'bottom-end',
        'right', 'right-start', 'right-end',
        'left', 'left-start', 'left-end'
      ],
      description: 'موقعیت popover نسبت به تریگر'
    },
    disabled: {
      control: 'boolean',
      description: 'غیرفعال کردن تریگر'
    },
    title: {
      control: 'text',
      description: 'عنوان popover'
    },
    content: {
      control: 'text', 
      description: 'محتوای اصلی popover'
    },
    triggerText: {
      control: 'text',
      description: 'متن دکمه پیش‌فرض'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'اندازه popover'
    },
    showArrow: {
      control: 'boolean',
      description: 'نمایش فلش اشاره‌گر'
    },
    showClose: {
      control: 'boolean', 
      description: 'نمایش دکمه بستن در هدر'
    },
    showBackdrop: {
      control: 'boolean',
      description: 'نمایش backdrop مودال'
    },
    modal: {
      control: 'boolean',
      description: 'رفتار مودال با قفل focus'
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'بستن با کلیک خارج'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'بستن با کلید Escape'
    },
    openDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'تأخیر در باز شدن (ms)'
    },
    closeDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'تأخیر در بسته شدن (ms)'
    },
    offset: {
      control: { type: 'number', min: 0, max: 50 },
      description: 'فاصله از المان تریگر'
    }
  }
}

export default meta
type Story = StoryObj<typeof BasePopover>

// =============================================================================
// BASIC EXAMPLES
// =============================================================================

export const Default: Story = {
  args: {
    title: 'Popover پیش‌فرض',
    content: 'این یک popover ساده با تنظیمات پیش‌فرض است.',
    triggerText: 'باز کردن Popover'
  }
}

export const ContentOnly: Story = {
  name: 'فقط محتوا',
  args: {
    content: 'این popover فقط محتوا دارد و عنوان ندارد.',
    triggerText: 'فقط محتوا'
  }
}

export const WithCloseButton: Story = {
  name: 'با دکمه بستن',
  args: {
    title: 'Popover قابل بستن',
    content: 'این popover دکمه بستن در هدر دارد.',
    triggerText: 'با دکمه بستن',
    showClose: true
  }
}

// =============================================================================
// TRIGGER TYPES
// =============================================================================

export const ClickTrigger: Story = {
  name: 'تریگر کلیک',
  args: {
    trigger: 'click',
    title: 'تریگر کلیک',
    content: 'روی دکمه کلیک کنید تا popover باز/بسته شود.',
    triggerText: 'کلیک کنید'
  }
}

export const HoverTrigger: Story = {
  name: 'تریگر هاور',
  args: {
    trigger: 'hover',
    title: 'تریگر هاور', 
    content: 'موس را روی دکمه قرار دهید تا popover نمایش داده شود.',
    triggerText: 'هاور کنید'
  }
}

export const FocusTrigger: Story = {
  name: 'تریگر فوکوس',
  args: {
    trigger: 'focus',
    title: 'تریگر فوکوس',
    content: 'دکمه را فوکوس کنید (Tab یا کلیک) تا popover نمایش داده شود.',
    triggerText: 'فوکوس کنید'
  }
}

export const ManualControl: Story = {
  name: 'کنترل دستی',
  render: (args) => ({
    components: { BasePopover },
    setup() {
      const isOpen = ref(false)
      
      return {
        args: {
          ...args,
          trigger: 'manual',
          modelValue: isOpen.value,
          'onUpdate:modelValue': (value: boolean) => {
            isOpen.value = value
          }
        },
        isOpen,
        toggle: () => isOpen.value = !isOpen.value
      }
    },
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <button @click="toggle" style="
          background: #1e8759;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        ">
          {{ isOpen ? 'بستن' : 'باز کردن' }} Popover
        </button>
        
        <BasePopover v-bind="args">
          <template #trigger>
            <span>کنترل دستی (بدون دکمه پیش‌فرض)</span>
          </template>
        </BasePopover>
      </div>
    `
  }),
  args: {
    title: 'کنترل دستی',
    content: 'این popover از طریق کد کنترل می‌شود.'
  }
}

// =============================================================================
// SIZES
// =============================================================================

export const SmallSize: Story = {
  name: 'اندازه کوچک',
  args: {
    size: 'sm',
    title: 'Popover کوچک',
    content: 'این popover کوچک است، مناسب برای tooltipها و اطلاعات کوتاه.',
    triggerText: 'کوچک'
  }
}

export const MediumSize: Story = {
  name: 'اندازه متوسط', 
  args: {
    size: 'md',
    title: 'Popover متوسط',
    content: 'این popover متوسط است، اندازه پیش‌فرض که برای اکثر موارد مناسب است.',
    triggerText: 'متوسط'
  }
}

export const LargeSize: Story = {
  name: 'اندازه بزرگ',
  args: {
    size: 'lg', 
    title: 'Popover بزرگ',
    content: 'این popover بزرگ است، مناسب برای اطلاعات تفصیلی، فرم‌ها یا محتوای غنی.',
    triggerText: 'بزرگ'
  }
}

// =============================================================================
// PLACEMENTS
// =============================================================================

export const AllPlacements: Story = {
  name: 'همه موقعیت‌ها',
  render: () => ({
    components: { BasePopover },
    template: `
      <div style="
        display: grid; 
        grid-template-columns: repeat(3, 1fr); 
        gap: 4rem; 
        padding: 4rem; 
        place-items: center;
      ">
        <!-- ردیف بالا -->
        <BasePopover placement="top-start" title="بالا-شروع" content="موقعیت top-start" triggerText="↖️" />
        <BasePopover placement="top" title="بالا" content="موقعیت top مرکز" triggerText="⬆️" />
        <BasePopover placement="top-end" title="بالا-پایان" content="موقعیت top-end" triggerText="↗️" />
        
        <!-- ردیف وسط -->
        <BasePopover placement="left" title="چپ" content="موقعیت left مرکز" triggerText="⬅️" />
        <div style="
          padding: 2rem; 
          background: #f3f4f6; 
          border-radius: 8px; 
          text-align: center;
          border: 2px dashed #9ca3af;
        ">
          <strong>المان مرکزی</strong><br>
          <small>همه موقعیت‌ها نسبت به این</small>
        </div>
        <BasePopover placement="right" title="راست" content="موقعیت right مرکز" triggerText="➡️" />
        
        <!-- ردیف پایین -->
        <BasePopover placement="bottom-start" title="پایین-شروع" content="موقعیت bottom-start" triggerText="↙️" />
        <BasePopover placement="bottom" title="پایین" content="موقعیت bottom مرکز" triggerText="⬇️" />
        <BasePopover placement="bottom-end" title="پایین-پایان" content="موقعیت bottom-end" triggerText="↘️" />
      </div>
    `
  })
}

// =============================================================================
// ACTIONS
// =============================================================================

const basicActions: PopoverAction[] = [
  { text: 'لغو', variant: 'secondary' },
  { text: 'تأیید', variant: 'primary', handler: () => alert('تأیید شد!') }
]

export const WithActions: Story = {
  name: 'با اکشن‌ها',
  args: {
    title: 'تأیید عملیات',
    content: 'آیا مطمئن هستید که می‌خواهید ادامه دهید؟',
    triggerText: 'نمایش اکشن‌ها',
    actions: basicActions
  }
}

const allActionVariants: PopoverAction[] = [
  { text: 'پیش‌فرض', variant: 'default' },
  { text: 'اصلی', variant: 'primary' },
  { text: 'ثانویه', variant: 'secondary' },
  { text: 'موفقیت', variant: 'success' },
  { text: 'هشدار', variant: 'warning' },
  { text: 'خطا', variant: 'error' }
]

export const ActionVariants: Story = {
  name: 'انواع دکمه اکشن',
  args: {
    title: 'انواع اکشن',
    content: 'استایل‌های مختلف دکمه برای اکشن‌های متنوع.',
    triggerText: 'همه انواع',
    actions: allActionVariants
  }
}

const disabledActions: PopoverAction[] = [
  { text: 'فعال', variant: 'primary' },
  { text: 'غیرفعال', variant: 'secondary', disabled: true },
  { text: 'فعال دیگر', variant: 'success' }
]

export const DisabledActions: Story = {
  name: 'اکشن‌های غیرفعال',
  args: {
    title: 'اکشن‌های غیرفعال',
    content: 'برخی اکشن‌ها می‌توانند غیرفعال باشند.',
    triggerText: 'اکشن غیرفعال',
    actions: disabledActions
  }
}

// =============================================================================
// ADVANCED FEATURES 
// =============================================================================

export const ModalPopover: Story = {
  name: 'حالت مودال',
  args: {
    title: 'Popover مودال',
    content: 'این popover دارای backdrop و رفتار مودال است.',
    triggerText: 'باز کردن مودال',
    showBackdrop: true,
    modal: true,
    showClose: true
  }
}

export const NoArrow: Story = {
  name: 'بدون فلش',
  args: {
    title: 'بدون فلش',
    content: 'این popover فلش اشاره‌گر ندارد.',
    triggerText: 'بدون فلش',
    showArrow: false
  }
}

export const DelayedPopover: Story = {
  name: 'با تأخیر',
  args: {
    trigger: 'hover',
    title: 'Popover با تأخیر',
    content: 'این popover تأخیر در نمایش و پنهان شدن دارد.',
    triggerText: 'هاور (با تأخیر)',
    openDelay: 500,
    closeDelay: 300
  }
}

export const CustomOffset: Story = {
  name: 'فاصله سفارشی',
  args: {
    title: 'فاصله سفارشی',
    content: 'این popover فاصله بیشتری از تریگر دارد.',
    triggerText: 'فاصله سفارشی',
    offset: 20
  }
}

// =============================================================================
// CUSTOM CONTENT
// =============================================================================

export const CustomTrigger: Story = {
  name: 'تریگر سفارشی',
  render: (args) => ({
    components: { BasePopover },
    setup() {
      return { args }
    },
    template: `
      <BasePopover v-bind="args">
        <template #trigger="{ isOpen, toggle }">
          <button 
            @click="toggle"
            :class="{ active: isOpen }"
            style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            "
            @mouseover="$event.target.style.transform = 'translateY(-2px) scale(1.05)'"
            @mouseout="$event.target.style.transform = 'translateY(0) scale(1)'"
          >
            🎨 تریگر سفارشی
          </button>
        </template>
      </BasePopover>
    `
  }),
  args: {
    title: 'تریگر سفارشی',
    content: 'این popover از یک المان تریگر کاملاً سفارشی استفاده می‌کند.'
  }
}

export const RichContent: Story = {
  name: 'محتوای غنی',
  render: (args) => ({
    components: { BasePopover },
    setup() {
      const handleSave = () => alert('ذخیره شد!')
      const handleDelete = () => {
        if (confirm('آیا مطمئن هستید؟')) {
          alert('حذف شد!')
        }
      }
      
      return { args, handleSave, handleDelete }
    },
    template: `
      <BasePopover v-bind="args">
        <div style="padding: 0;">
          <!-- اطلاعات کاربر -->
          <div style="
            display: flex; 
            align-items: center; 
            gap: 1rem; 
            margin-bottom: 1rem;
          ">
            <div style="
              width: 48px; 
              height: 48px; 
              background: linear-gradient(135deg, #1e8759, #35495e); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold;
              font-size: 1.2rem;
            ">
              م.ا
            </div>
            <div>
              <div style="font-weight: 600; margin-bottom: 0.25rem;">محمد احمدی</div>
              <div style="font-size: 0.875rem; color: #6b7280;">mohammad@example.com</div>
            </div>
          </div>
          
          <!-- آمار -->
          <div style="
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 1rem; 
            margin-bottom: 1rem;
            padding: 1rem;
            background: #f9fafb;
            border-radius: 8px;
          ">
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; font-weight: bold; color: #1e8759;">142</div>
              <div style="font-size: 0.875rem; color: #6b7280;">پروژه</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; font-weight: bold; color: #ef4444;">7</div>
              <div style="font-size: 0.875rem; color: #6b7280;">مسئله</div>
            </div>
          </div>
          
          <!-- تگ‌ها -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
            <span style="background: #1e8759; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem;">مدیر</span>
            <span style="background: #22c55e; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem;">فعال</span>
            <span style="background: #f59e0b; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem;">پرمیوم</span>
          </div>
        </div>
        
        <template #actions>
          <button 
            @click="handleSave"
            style="
              background: #22c55e; 
              color: white; 
              border: none; 
              padding: 0.5rem 1rem; 
              border-radius: 6px; 
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
            "
          >
            ذخیره تغییرات
          </button>
          <button 
            @click="handleDelete"
            style="
              background: #ef4444; 
              color: white; 
              border: none; 
              padding: 0.5rem 1rem; 
              border-radius: 6px; 
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
            "
          >
            حذف کاربر
          </button>
        </template>
      </BasePopover>
    `
  }),
  args: {
    title: 'پروفایل کاربر',
    triggerText: 'محتوای غنی',
    size: 'lg',
    showClose: true
  }
}

export const FormPopover: Story = {
  name: 'فرم سریع',
  render: (args) => ({
    components: { BasePopover },
    setup() {
      const formData = reactive({
        name: '',
        email: '',
        priority: 'medium'
      })
      
      const handleSubmit = () => {
        if (formData.name && formData.email) {
          alert(`فرم ارسال شد:\nنام: ${formData.name}\nایمیل: ${formData.email}\nاولویت: ${formData.priority}`)
          Object.assign(formData, { name: '', email: '', priority: 'medium' })
        }
      }
      
      return { args, formData, handleSubmit }
    },
    template: `
      <BasePopover v-bind="args">
        <form @submit.prevent="handleSubmit" style="margin: 0;">
          <div style="margin-bottom: 1rem;">
            <label style="
              display: block; 
              margin-bottom: 0.5rem; 
              font-weight: 500;
            ">
              نام:
            </label>
            <input
              v-model="formData.name"
              type="text"
              style="
                width: 100%;
                padding: 0.5rem 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 0.875rem;
              "
              placeholder="نام خود را وارد کنید..."
              required
            />
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="
              display: block; 
              margin-bottom: 0.5rem; 
              font-weight: 500;
            ">
              ایمیل:
            </label>
            <input
              v-model="formData.email"
              type="email"
              style="
                width: 100%;
                padding: 0.5rem 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 0.875rem;
              "
              placeholder="ایمیل خود را وارد کنید..."
              required
            />
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label style="
              display: block; 
              margin-bottom: 0.5rem; 
              font-weight: 500;
            ">
              اولویت:
            </label>
            <select
              v-model="formData.priority"
              style="
                width: 100%;
                padding: 0.5rem 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 0.875rem;
              "
            >
              <option value="low">کم</option>
              <option value="medium">متوسط</option>
              <option value="high">بالا</option>
            </select>
          </div>
        </form>
        
        <template #actions="{ close }">
          <button 
            @click="close"
            style="
              background: #6b7280;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.875rem;
            "
          >
            لغو
          </button>
          <button 
            @click="handleSubmit"
            style="
              background: #1e8759;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.875rem;
            "
          >
            ارسال
          </button>
        </template>
      </BasePopover>
    `
  }),
  args: {
    title: 'فرم سریع',
    triggerText: 'فرم جدید',
    size: 'lg',
    closeOnClickOutside: false
  }
}

// =============================================================================
// STATES
// =============================================================================

export const DisabledState: Story = {
  name: 'حالت غیرفعال',
  args: {
    title: 'غیرفعال',
    content: 'این تریگر popover غیرفعال است.',
    triggerText: 'تریگر غیرفعال',
    disabled: true
  }
}

export const LongContent: Story = {
  name: 'محتوای طولانی',
  args: {
    title: 'مثال محتوای طولانی',
    content: `این یک popover با محتوای طولانی است تا نحوه مدیریت متن‌های بلند توسط کامپوننت نشان داده شود.

Popover باید به طور خودکار عرض و ارتفاع خود را متناسب با محتوا تنظیم کند تا خوانایی و سلسله‌مراتب بصری مناسبی حفظ شود.

لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.

این نشان می‌دهد که کامپوننت چگونه با پاراگراف‌های متعدد کار می‌کند و فاصله‌گذاری مناسب در سراسر محتوا حفظ می‌کند.`,
    triggerText: 'محتوای طولانی',
    size: 'lg'
  }
}

// =============================================================================
// ACCESSIBILITY
// =============================================================================

export const AccessibilityDemo: Story = {
  name: 'ویژگی‌های دسترسی‌پذیری',
  render: () => ({
    components: { BasePopover },
    template: `
      <div style="
        display: flex; 
        flex-direction: column; 
        gap: 2rem; 
        max-width: 800px;
        padding: 2rem;
      ">
        <div>
          <h3 style="margin: 0 0 1rem 0;">ناوبری کیبورد</h3>
          <p style="margin: 0 0 1rem 0;">
            از Tab برای حرکت بین popoverها، Enter/Space برای فعال‌سازی، و Escape برای بستن استفاده کنید.
          </p>
        </div>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <BasePopover
            title="Popover دسترسی‌پذیر 1"
            content="با کلید Tab اینجا بیایید. Escape را برای بستن فشار دهید."
            trigger-text="Tab اینجا"
            show-close
          />
          
          <BasePopover
            title="Popover دسترسی‌پذیر 2"
            content="این popover هم از ناوبری کامل کیبورد پشتیبانی می‌کند."
            trigger-text="سپس اینجا"
            :actions="[
              { text: 'اکشن 1', variant: 'secondary' },
              { text: 'اکشن 2', variant: 'primary' }
            ]"
          />
          
          <BasePopover
            trigger="focus"
            title="تریگر فوکوس"
            content="این popover هنگام فوکوس از طریق کیبورد باز می‌شود."
            trigger-text="فوکوس کنید"
          />
        </div>
        
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">پشتیبانی از Screen Reader</h4>
          <ul style="margin: 0; padding-left: 1.5rem;">
            <li>برچسب‌گذاری و توضیحات ARIA مناسب</li>
            <li>اعلان نقش و وضعیت</li>
            <li>مدیریت focus برای popoverهای مودال</li>
            <li>پشتیبانی از ناوبری کیبورد</li>
          </ul>
        </div>
      </div>
    `
  })
}

// =============================================================================
// PLAYGROUND
// =============================================================================

export const Playground: Story = {
  name: 'زمین بازی',
  args: {
    title: 'Popover زمین بازی',
    content: 'با تمام propهای مختلف آزمایش کنید و گزینه‌ها را امتحان کنید.',
    triggerText: 'زمین بازی',
    trigger: 'click',
    placement: 'bottom',
    size: 'md',
    showArrow: true,
    showClose: false,
    showBackdrop: false,
    modal: false,
    closeOnClickOutside: true,
    closeOnEscape: true,
    openDelay: 0,
    closeDelay: 0,
    offset: 8,
    actions: [
      { text: 'لغو', variant: 'secondary' },
      { text: 'تأیید', variant: 'primary' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'از پنل کنترل‌ها برای آزمایش ترکیب‌های مختلف propها استفاده کنید و ببینید چگونه بر رفتار و ظاهر popover تأثیر می‌گذارند.'
      }
    }
  }
}

// =============================================================================
// USE CASES
// =============================================================================

export const ConfirmationDialog: Story = {
  name: 'دیالوگ تأیید',
  args: {
    title: 'حذف آیتم',
    content: 'آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟ این عمل قابل بازگشت نیست.',
    triggerText: 'حذف آیتم',
    size: 'md',
    actions: [
      { text: 'لغو', variant: 'secondary' },
      { text: 'حذف', variant: 'error', handler: () => alert('آیتم حذف شد!') }
    ]
  }
}

export const InfoTooltip: Story = {
  name: 'Tooltip اطلاعاتی',
  args: {
    trigger: 'hover',
    size: 'sm',
    content: 'این اطلاعات تکمیلی در مورد این فیلد است.',
    triggerText: 'ℹ️',
    showArrow: true,
    placement: 'top'
  }
}

export const UserMenu: Story = {
  name: 'منوی کاربر',
  render: (args) => ({
    components: { BasePopover },
    setup() {
      const userActions: PopoverAction[] = [
        { text: 'مشاهده پروفایل', variant: 'default' },
        { text: 'تنظیمات', variant: 'default' },
        { text: 'راهنما', variant: 'default' },
        { text: 'خروج', variant: 'error' }
      ]
      
      return { args, userActions }
    },
    template: `
      <BasePopover v-bind="args" :actions="userActions">
        <template #trigger="{ toggle }">
          <button 
            @click="toggle"
            style="
              display: flex;
              align-items: center;
              gap: 0.5rem;
              background: #f3f4f6;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              padding: 0.5rem 1rem;
              cursor: pointer;
            "
          >
            <div style="
              width: 32px;
              height: 32px;
              background: #1e8759;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 0.875rem;
            ">
              م.ا
            </div>
            <span>محمد احمدی</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </template>
      </BasePopover>
    `
  }),
  args: {
    title: 'حساب کاربری',
    placement: 'bottom-end',
    size: 'md'
  }
}

export const NotificationPopover: Story = {
  name: 'Popover اعلان',
  render: (args) => ({
    components: { BasePopover },
    setup() {
      return { args }
    },
    template: `
      <BasePopover v-bind="args">
        <template #trigger="{ toggle, isOpen }">
          <button 
            @click="toggle"
            style="
              position: relative;
              background: #f3f4f6;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              padding: 0.75rem;
              cursor: pointer;
            "
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 2C7.58 2 4 5.58 4 10c0 3.07 1.87 5.69 4.5 6.83V19a1 1 0 001 1h1.5a1 1 0 001-1v-2.17C14.13 15.69 16 13.07 16 10c0-4.42-3.58-8-8-8z"/>
            </svg>
            <div style="
              position: absolute;
              top: -0.25rem;
              right: -0.25rem;
              width: 1.25rem;
              height: 1.25rem;
              background: #ef4444;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.75rem;
              color: white;
              font-weight: bold;
            ">
              3
            </div>
          </button>
        </template>
        
        <div style="padding: 0;">
          <div style="padding: 1rem 0; border-bottom: 1px solid #f3f4f6;">
            <div style="font-weight: 600; margin-bottom: 0.25rem;">پروژه جدید اضافه شد</div>
            <div style="font-size: 0.875rem; color: #6b7280;">5 دقیقه پیش</div>
          </div>
          <div style="padding: 1rem 0; border-bottom: 1px solid #f3f4f6;">
            <div style="font-weight: 600; margin-bottom: 0.25rem;">نظر جدید دریافت شد</div>
            <div style="font-size: 0.875rem; color: #6b7280;">1 ساعت پیش</div>
          </div>
          <div style="padding: 1rem 0;">
            <div style="font-weight: 600; margin-bottom: 0.25rem;">تکمیل تسک</div>
            <div style="font-size: 0.875rem; color: #6b7280;">3 ساعت پیش</div>
          </div>
        </div>
        
        <template #actions>
          <button style="
            background: #1e8759;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            width: 100%;
          ">
            مشاهده همه اعلان‌ها
          </button>
        </template>
      </BasePopover>
    `
  }),
  args: {
    title: 'اعلان‌ها',
    placement: 'bottom-end',
    size: 'md',
    showClose: true
  }
}