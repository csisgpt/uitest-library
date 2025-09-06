import type { Meta, StoryObj } from "@storybook/vue3";
import { computed } from "vue";
import { ref } from "vue";
import BaseModal from "./BaseModal.vue";
import { useToast } from "../BaseToast";
import ToastContainer from "../BaseToast/ToastContainer.vue";

const meta: Meta<typeof BaseModal> = {
  title: "UI/BaseModal",
  component: BaseModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "یک کامپوننت مدال قابل تنظیم و دارای accessibility که از design tokens سیستم استفاده می‌کند.",
      },
    },
  },
  argTypes: {
    visible: {
      control: "boolean",
      description: "وضعیت نمایش مدال",
    },
    header: {
      control: "text",
      description: "متن هدر مدال",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "اندازه مدال",
    },
    maximized: {
      control: "boolean",
      description: "حالت تمام صفحه",
    },
    closable: {
      control: "boolean",
      description: "امکان بستن مدال",
    },
    closeOnEscape: {
      control: "boolean",
      description: "بستن با کلید Escape",
    },
    closeOnOverlay: {
      control: "boolean",
      description: "بستن با کلیک روی پس‌زمینه",
    },
    showHeader: {
      control: "boolean",
      description: "نمایش هدر",
    },
    showFooter: {
      control: "boolean",
      description: "نمایش فوتر",
    },
    showCancelButton: {
      control: "boolean",
      description: "نمایش دکمه انصراف",
    },
    showConfirmButton: {
      control: "boolean",
      description: "نمایش دکمه تأیید",
    },
    cancelLabel: {
      control: "text",
      description: "متن دکمه انصراف",
    },
    confirmLabel: {
      control: "text",
      description: "متن دکمه تأیید",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BaseModal>;

// Basic Modal
export const Default: Story = {
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const visible = ref(false);
      const showModal = () => {
        visible.value = true;
      };
      const onUpdateVisible = (value: boolean) => {
        visible.value = value;
      };

      return {
        args: { ...args, visible: visible.value },
        visible,
        showModal,
        onUpdateVisible,
      };
    },
    template: `
      <div style="padding: 40px">
        <button @click="showModal" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          نمایش مدال
        </button>
        
        <BaseModal 
          v-bind="args" 
          :visible="visible"
          @update:visible="onUpdateVisible"
        >
          <p>این یک مدال ساده است که محتوای شما را نمایش می‌دهد.</p>
          <p>می‌توانید هر محتوایی را در اینجا قرار دهید.</p>
        </BaseModal>
      </div>
    `,
  }),
  args: {
    header: "مدال پایه",
    size: "md",
    closable: true,
    closeOnEscape: true,
    closeOnOverlay: true,
  },
};

// With Footer Buttons
export const WithFooterButtons: Story = {
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const visible = ref(false);
      const showModal = () => {
        visible.value = true;
      };
      const onUpdateVisible = (value: boolean) => {
        visible.value = value;
      };
      const onConfirm = () => {
        alert("تأیید شد!");
        visible.value = false;
      };
      const onCancel = () => {
        alert("لغو شد!");
      };

      return {
        args: { ...args, visible: visible.value },
        visible,
        showModal,
        onUpdateVisible,
        onConfirm,
        onCancel,
      };
    },
    template: `
      <div style="padding: 40px">
        <button @click="showModal" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          مدال با دکمه‌ها
        </button>
        
        <BaseModal 
          v-bind="args" 
          :visible="visible"
          @update:visible="onUpdateVisible"
          @confirm="onConfirm"
          @cancel="onCancel"
        >
          <p>آیا مطمئن هستید که می‌خواهید این عملیات را انجام دهید؟</p>
          <p>این کار قابل بازگشت نیست.</p>
        </BaseModal>
      </div>
    `,
  }),
  args: {
    header: "تأیید عملیات",
    size: "sm",
    showFooter: true,
    showCancelButton: true,
    showConfirmButton: true,
    confirmLabel: "بله، ادامه",
    cancelLabel: "انصراف",
  },
};

// Custom Header and Footer
export const CustomSlots: Story = {
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const visible = ref(false);
      const showModal = () => {
        visible.value = true;
      };
      const onUpdateVisible = (value: boolean) => {
        visible.value = value;
      };

      return {
        args: { ...args, visible: visible.value },
        visible,
        showModal,
        onUpdateVisible,
      };
    },
    template: `
      <div style="padding: 40px">
        <button @click="showModal" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          مدال سفارشی
        </button>
        
        <BaseModal 
          v-bind="args" 
          :visible="visible"
          @update:visible="onUpdateVisible"
        >
          <template #header="{ close }">
            <div style="display: flex; align-items: center; gap: 8px; color: #1e8759;">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <h2 style="margin: 0; font-size: 18px;">اطلاعات مهم</h2>
            </div>
          </template>
          
          <div style="text-align: center; padding: 20px 0;">
            <div style="width: 64px; height: 64px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <svg width="32" height="32" fill="white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 style="color: #1f2937; margin: 0 0 8px;">عملیات با موفقیت انجام شد</h3>
            <p style="color: #6b7280; margin: 0;">تغییرات شما ذخیره گردید.</p>
          </div>
          
          <template #footer="{ close }">
            <div style="text-align: center;">
              <button @click="close" style="padding: 12px 32px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
                عالی!
              </button>
            </div>
          </template>
        </BaseModal>
      </div>
    `,
  }),
  args: {
    size: "sm",
    showFooter: true,
  },
};

// Different Sizes
export const Sizes: Story = {
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const visibleSm = ref(false);
      const visibleMd = ref(false);
      const visibleLg = ref(false);
      const visibleXl = ref(false);

      return {
        args,
        visibleSm,
        visibleMd,
        visibleLg,
        visibleXl,
      };
    },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;padding: 40px">
        <button @click="visibleSm = true" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          کوچک (SM)
        </button>
        <button @click="visibleMd = true" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          متوسط (MD)
        </button>
        <button @click="visibleLg = true" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          بزرگ (LG)
        </button>
        <button @click="visibleXl = true" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          خیلی بزرگ (XL)
        </button>
        
        <BaseModal :visible="visibleSm" @update:visible="visibleSm = $event" header="مدال کوچک" size="sm">
          <p>این یک مدال با اندازه کوچک است.</p>
        </BaseModal>
        
        <BaseModal :visible="visibleMd" @update:visible="visibleMd = $event" header="مدال متوسط" size="md">
          <p>این یک مدال با اندازه متوسط است که برای بیشتر موارد استفاده مناسب است.</p>
        </BaseModal>
        
        <BaseModal :visible="visibleLg" @update:visible="visibleLg = $event" header="مدال بزرگ" size="lg">
          <p>این یک مدال با اندازه بزرگ است که برای محتوای بیشتر مناسب است.</p>
          <p>می‌توانید فرم‌های پیچیده یا جداول کوچک را در اینجا قرار دهید.</p>
        </BaseModal>
        
        <BaseModal :visible="visibleXl" @update:visible="visibleXl = $event" header="مدال خیلی بزرگ" size="xl">
          <p>این یک مدال با اندازه خیلی بزرگ است.</p>
          <p>برای محتوای پیچیده، فرم‌های بزرگ، یا نمایش داده‌های جدولی مناسب است.</p>
          <p>فضای کافی برای قرار دادن المان‌های مختلف دارید.</p>
        </BaseModal>
      </div>
    `,
  }),
};

// Maximized Modal
export const Maximized: Story = {
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const visible = ref(false);
      const showModal = () => {
        visible.value = true;
      };
      const onUpdateVisible = (value: boolean) => {
        visible.value = value;
      };

      return {
        args: { ...args, visible: visible.value },
        visible,
        showModal,
        onUpdateVisible,
      };
    },
    template: `
      <div style="padding: 40px">
        <button @click="showModal" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          مدال تمام صفحه
        </button>
        
        <BaseModal 
          v-bind="args" 
          :visible="visible"
          @update:visible="onUpdateVisible"
        >
          <div>
            <h3>محتوای تمام صفحه</h3>
            <p>این مدال تمام فضای موجود را اشغال می‌کند.</p>
            <div style="height: 200px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 16px 0;">
              <p style="color: #6b7280;">فضای بیشتر برای محتوا</p>
            </div>
            <p>برای نمایش فرم‌های پیچیده، جداول بزرگ، یا اپلیکیشن‌های درون مدالی مناسب است.</p>
          </div>
        </BaseModal>
      </div>
    `,
  }),
  args: {
    header: "مدال تمام صفحه",
    maximized: true,
  },
};

// No Header Modal
export const NoHeader: Story = {
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const visible = ref(false);
      const showModal = () => {
        visible.value = true;
      };
      const onUpdateVisible = (value: boolean) => {
        visible.value = value;
      };

      return {
        args: { ...args, visible: visible.value },
        visible,
        showModal,
        onUpdateVisible,
      };
    },
    template: `
      <div style="padding: 40px">
        <button @click="showModal" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          مدال بدون هدر
        </button>
        
        <BaseModal 
          v-bind="args" 
          :visible="visible"
          @update:visible="onUpdateVisible"
        >
          <div style="text-align: center; padding: 20px 0;">
            <h3 style="margin: 0 0 16px;">محتوای بدون هدر</h3>
            <p>این مدال هیچ هدر ندارد و فقط محتوای اصلی را نمایش می‌دهد.</p>
            <button @click="onUpdateVisible(false)" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 16px;">
              بستن
            </button>
          </div>
        </BaseModal>
      </div>
    `,
  }),
  args: {
    showHeader: false,
    size: "sm",
  },
};

// Loading State Modal
export const LoadingState: Story = {
  render: (args) => ({
    components: { BaseModal, ToastContainer },
    setup() {
      const {
        success,
        error,
        warning,
        info,
        show,
        dismissAll,
        setPosition,
        setMaxToasts,
        promise,
        processError,
        toasts,
        position,
      } = useToast();
      const visible = ref(false);
      const loading = ref(false);

      const showModal = () => {
        visible.value = true;
      };
      const onUpdateVisible = (value: boolean) => {
        visible.value = value;
      };

      const handleConfirm = async () => {
        loading.value = true;
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        loading.value = false;
        visible.value = false;

        success("با موفقیت انجام شد .");
      };

      return {
        args: { ...args, visible: visible.value },
        visible,
        loading,
        showModal,
        onUpdateVisible,
        handleConfirm,
      };
    },
    template: `
      <div style="padding: 40px">
        <button @click="showModal" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          مدال با حالت لودینگ
        </button>
        
        <BaseModal 
          v-bind="args" 
          :visible="visible"
          @update:visible="onUpdateVisible"
          @confirm="handleConfirm"
        >
          <template #footer="{ close }">
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button @click="close" :disabled="loading" style="padding: 12px 16px; background: transparent; color: #6b7280; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;" :style="{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }">
                انصراف
              </button>
              <button @click="handleConfirm" :disabled="loading" style="padding: 12px 16px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px;" :style="{ opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }">
                <svg v-if="loading" width="16" height="16" fill="none" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="32" stroke-dashoffset="32" opacity="0.3"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {{ loading ? 'در حال پردازش...' : 'ذخیره' }}
              </button>
            </div>
          </template>
          
          <div>
            <h4>ذخیره تغییرات</h4>
            <p>با کلیک روی دکمه ذخیره، تغییرات شما اعمال خواهد شد.</p>
            <p v-if="loading" style="color: #1e8759; font-weight: 500;">
              لطفا صبر کنید...
            </p>
          </div>
        </BaseModal>
        
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </div>

      <ToastContainer />
    `,
  }),
  args: {
    header: "تأیید ذخیره",
    size: "sm",
    showFooter: true,
    closable: true,
  },
};

// Form Modal
export const FormModal: Story = {
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const visible = ref(false);
      const formData = ref({
        name: "",
        email: "",
        message: "",
      });

      const showModal = () => {
        visible.value = true;
      };
      const onUpdateVisible = (value: boolean) => {
        visible.value = value;
      };

      const handleSubmit = () => {
        console.log("Form submitted:", formData.value);
        alert("فرم با موفقیت ارسال شد!");
        visible.value = false;
        // Reset form
        formData.value = { name: "", email: "", message: "" };
      };

      const isFormValid = computed(() => {
        return (
          formData.value.name.trim() &&
          formData.value.email.trim() &&
          formData.value.message.trim()
        );
      });

      return {
        args: { ...args, visible: visible.value },
        visible,
        formData,
        showModal,
        onUpdateVisible,
        handleSubmit,
        isFormValid,
      };
    },
    template: `
      <div style="padding: 40px">
        <button @click="showModal" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          فرم تماس
        </button>
        
        <BaseModal 
          v-bind="args" 
          :visible="visible"
          @update:visible="onUpdateVisible"
          @confirm="handleSubmit"
        >
          <form @submit.prevent="handleSubmit" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151;">نام:</label>
              <input 
                v-model="formData.name"
                type="text" 
                required
                style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;"
                placeholder="نام خود را وارد کنید"
              />
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151;">ایمیل:</label>
              <input 
                v-model="formData.email"
                type="email" 
                required
                style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;"
                placeholder="example@email.com"
              />
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151;">پیام:</label>
              <textarea 
                v-model="formData.message"
                required
                rows="4"
                style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; resize: vertical;"
                placeholder="پیام خود را بنویسید..."
              ></textarea>
            </div>
          </form>
          
          <template #footer="{ close }">
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button @click="close" type="button" style="padding: 12px 16px; background: transparent; color: #6b7280; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;">
                انصراف
              </button>
              <button @click="handleSubmit" :disabled="!isFormValid" style="padding: 12px 16px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;" :style="{ opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }">
                ارسال
              </button>
            </div>
          </template>
        </BaseModal>
      </div>
    `,
  }),
  args: {
    header: "تماس با ما",
    size: "md",
    showFooter: true,
  },
};

// Scrollable Content Modal
export const ScrollableContent: Story = {
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const visible = ref(false);
      const showModal = () => {
        visible.value = true;
      };
      const onUpdateVisible = (value: boolean) => {
        visible.value = value;
      };

      return {
        args: { ...args, visible: visible.value },
        visible,
        showModal,
        onUpdateVisible,
      };
    },
    template: `
      <div style="padding: 40px">
        <button @click="showModal" style="padding: 12px 24px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
          محتوای اسکرول‌شونده
        </button>
        
        <BaseModal 
          v-bind="args" 
          :visible="visible"
          @update:visible="onUpdateVisible"
        >
          <div>
            <h3>شرایط و ضوابط</h3>
            <div v-for="i in 20" :key="i" style="margin-bottom: 16px;">
              <h4>بخش {{ i }}</h4>
              <p>
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. 
                چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی 
                مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.
              </p>
            </div>
          </div>
          
          <template #footer="{ close }">
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button @click="close" style="padding: 12px 16px; background: transparent; color: #6b7280; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;">
                رد کردن
              </button>
              <button @click="close" style="padding: 12px 16px; background: #1e8759; color: white; border: none; border-radius: 4px; cursor: pointer;">
                قبول کردن
              </button>
            </div>
          </template>
        </BaseModal>
      </div>
    `,
  }),
  args: {
    header: "شرایط خدمات",
    size: "lg",
    showFooter: true,
  },
};
