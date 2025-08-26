import type { Meta, StoryObj } from "@storybook/vue3";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { reactive, computed, onMounted, ref } from "vue";
import ToastContainer from "./ToastContainer.vue";
import { useToast } from "./composables/useToast";
import type {
  Toast,
  ToastType,
  ToastPosition,
  ToastAnimation,
  ToastAction,
} from "./types/index";

/* =========================
   Enhanced Styles
========================= */
const enhancedStyles = `
  :root {
    --color-primary: #6366f1;
    --color-secondary: #8b5cf6;
    --color-success: #10b981;
    --color-error: #ef4444;
    --color-warning: #f59e0b;
    --color-info: #3b82f6;
    --color-text: #1f2937;
    --color-text-secondary: #6b7280;
    --color-muted: #9ca3af;
    --color-background: #ffffff;
    --color-surface: #f9fafb;
    --color-border: #e5e7eb;
    --color-border-hover: #d1d5db;
    --font-family-base: 'Vazirmatn', 'Inter', system-ui, sans-serif;
    --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    --gradient-surface: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    --border-radius-sm: 8px;
    --border-radius-md: 12px;
    --border-radius-lg: 16px;
    --border-radius-xl: 20px;
    --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * {
    box-sizing: border-box;
  }

  .toast-demo-container {
    min-height: 100vh;
    background: var(--gradient-surface);
    padding: 2rem;
    font-family: var(--font-family-base);
    direction: rtl;
  }

  .toast-demo-wrapper {
    max-width: 1400px;
    margin: 0 auto;
  }

  .toast-demo-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .toast-demo-title {
    font-size: 3.5rem;
    font-weight: 800;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 1rem;
    line-height: 1.2;
  }

  .toast-demo-subtitle {
    font-size: 1.25rem;
    color: var(--color-text-secondary);
    margin: 0 0 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .toast-demo-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .toast-demo-stat {
    text-align: center;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: var(--border-radius-lg);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    min-width: 120px;
  }

  .toast-demo-stat:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .toast-demo-stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .toast-demo-stat-label {
    font-size: 0.875rem;
    color: var(--color-muted);
    margin-top: 0.5rem;
    font-weight: 500;
  }

  .toast-demo-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .toast-demo-btn-hero {
    padding: 1.5rem 2rem;
    border: none;
    border-radius: var(--border-radius-lg);
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--transition);
    box-shadow: var(--shadow-lg);
  }

  .toast-demo-btn-hero:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-xl);
  }

  .toast-demo-btn-hero:active {
    transform: translateY(-1px);
  }

  .toast-demo-btn-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .toast-demo-btn-hero:hover::before {
    left: 100%;
  }

  .toast-demo-panels {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .toast-demo-card {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--border-radius-xl);
    padding: 2rem;
    backdrop-filter: blur(15px);
    box-shadow: var(--shadow-lg);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }

  .toast-demo-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
    border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  }

  .toast-demo-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .toast-demo-card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .toast-demo-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .toast-demo-input-group {
    display: flex;
    flex-direction: column;
  }

  .toast-demo-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 0.5rem;
  }

  .toast-demo-input,
  .toast-demo-select,
  .toast-demo-textarea {
    padding: 0.875rem 1rem;
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius-md);
    background: var(--color-background);
    font-family: var(--font-family-base);
    font-size: 1rem;
    transition: var(--transition);
    outline: none;
  }

  .toast-demo-input:focus,
  .toast-demo-select:focus,
  .toast-demo-textarea:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .toast-demo-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .toast-demo-triple-grid {
    display: grid;
    grid-template-columns: auto auto 1fr;
    gap: 1rem;
    align-items: center;
    margin: 1.5rem 0;
  }

  .toast-demo-checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .toast-demo-checkbox {
    width: 18px;
    height: 18px;
    accent-color: var(--color-primary);
  }

  .toast-demo-range {
    width: 100%;
    accent-color: var(--color-primary);
  }

  .toast-demo-range-label {
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-muted);
    margin-top: 0.25rem;
  }

  .toast-demo-btn {
    padding: 1rem 1.5rem;
    border: none;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }

  .toast-demo-btn-primary {
    background: var(--gradient-primary);
    color: white;
    box-shadow: var(--shadow-md);
  }

  .toast-demo-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .toast-demo-btn-secondary {
    background: var(--color-surface);
    color: var(--color-text);
    border: 2px solid var(--color-border);
  }

  .toast-demo-btn-secondary:hover {
    background: var(--color-background);
    border-color: var(--color-primary);
  }

  .toast-demo-quick-types {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .toast-demo-chip {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: var(--border-radius-md);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.9rem;
  }

  .toast-demo-chip:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }

  .toast-demo-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .toast-demo-stat-item {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: var(--border-radius-md);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .toast-demo-stat-number {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
  }

  .toast-demo-stat-text {
    font-size: 0.875rem;
    color: var(--color-muted);
    margin-top: 0.25rem;
  }

  /* Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .toast-demo-card {
    animation: fadeInUp 0.6s ease-out;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .toast-demo-container {
      padding: 1rem;
    }

    .toast-demo-title {
      font-size: 2.5rem;
    }

    .toast-demo-stats {
      gap: 1.5rem;
    }

    .toast-demo-actions {
      grid-template-columns: 1fr;
    }

    .toast-demo-panels {
      grid-template-columns: 1fr;
    }

    .toast-demo-form-grid {
      grid-template-columns: 1fr;
    }

    .toast-demo-triple-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
      text-align: center;
    }

    .toast-demo-quick-types {
      grid-template-columns: 1fr;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    :root {
      --color-text: #f9fafb;
      --color-text-secondary: #d1d5db;
      --color-muted: #9ca3af;
      --color-background: #1f2937;
      --color-surface: #374151;
      --color-border: #4b5563;
      --color-border-hover: #6b7280;
      --gradient-surface: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    }

    .toast-demo-card {
      background: rgba(31, 41, 55, 0.9);
      border-color: rgba(75, 85, 99, 0.3);
    }

    .toast-demo-stat {
      background: rgba(31, 41, 55, 0.8);
    }

    .toast-demo-stat-item {
      background: rgba(31, 41, 55, 0.5);
    }
  }
`;

/* =========================
   Meta Configuration
========================= */
const meta: Meta<typeof ToastContainer> = {
  title: "Feedback/Toast System",
  component: ToastContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# 🔔 Enhanced Toast System - Vue 3 + TypeScript

سیستم اعلان‌رسانی پیشرفته و مدرن با طراحی زیبا، انیمیشن‌های روان و قابلیت‌های کامل:

## ✨ ویژگی‌ها
- 🎨 **طراحی مدرن**: UI زیبا با Glassmorphism و انیمیشن‌های روان
- 🔄 **4 نوع Toast**: Success, Error, Warning, Info
- 📍 **6 موقعیت**: تمام گوشه‌ها و وسط صفحه
- 🎬 **4 انیمیشن**: Slide, Fade, Scale, Bounce
- ⚙️ **قابل سفارشی‌سازی**: عنوان، پیام، مدت زمان، دکمه‌ها
- 📊 **Progress Bar**: نمایش پیشرفت زمانی
- 🔗 **Promise Integration**: یکپارچه با Promise ها
- ♿ **دسترسی**: پشتیبانی کامل از A11y
- 🌙 **Dark Mode**: پشتیبانی از تم تاریک
- 📱 **Responsive**: سازگار با موبایل

## 🛠️ تکنولوژی‌ها
- Vue 3 Composition API
- TypeScript
- Modern CSS (Grid, Flexbox, Custom Properties)
- RTL Support
        `,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f8fafc" },
        { name: "dark", value: "#0f172a" },
        {
          name: "gradient",
          value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
      ],
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

/* =========================
   Helper Functions
========================= */
const createMockToast = (overrides: Partial<Toast> = {}): Toast => ({
  id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  type: "info",
  title: "",
  message: "پیام نمونه Toast",
  duration: 5000,
  persistent: false,
  position: "top-right",
  animation: "slide",
  showProgress: true,
  icon: "",
  customClass: "",
  createdAt: Date.now(),
  ...overrides,
});

const toastTypes: {
  type: ToastType;
  emoji: string;
  label: string;
  color: string;
}[] = [
  {
    type: "success",
    emoji: "✅",
    label: "موفقیت",
    color: "var(--color-success)",
  },
  { type: "error", emoji: "❌", label: "خطا", color: "var(--color-error)" },
  {
    type: "warning",
    emoji: "⚠️",
    label: "هشدار",
    color: "var(--color-warning)",
  },
  { type: "info", emoji: "ℹ️", label: "اطلاعات", color: "var(--color-info)" },
];

const toastPositions: {
  position: ToastPosition;
  emoji: string;
  label: string;
}[] = [
  { position: "top-right", emoji: "↗️", label: "بالا راست" },
  { position: "top-left", emoji: "↖️", label: "بالا چپ" },
  { position: "top-center", emoji: "⬆️", label: "بالا وسط" },
  { position: "bottom-right", emoji: "↘️", label: "پایین راست" },
  { position: "bottom-left", emoji: "↙️", label: "پایین چپ" },
  { position: "bottom-center", emoji: "⬇️", label: "پایین وسط" },
];

const toastAnimations: {
  animation: ToastAnimation;
  emoji: string;
  label: string;
}[] = [
  { animation: "slide", emoji: "➡️", label: "اسلاید" },
  { animation: "fade", emoji: "✨", label: "فید" },
  { animation: "scale", emoji: "🔍", label: "اسکیل" },
  { animation: "bounce", emoji: "🏀", label: "پرش" },
];

/* =========================
   1) Enhanced Overview Story
========================= */
export const Overview: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      // Inject styles
      const styleElement = document.createElement("style");
      styleElement.innerHTML = enhancedStyles;
      document.head.appendChild(styleElement);

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

      const stats = reactive({
        totalShown: 0,
        successCount: 0,
        errorCount: 0,
        warningCount: 0,
        infoCount: 0,
        currentActive: computed(() => toasts.value.length),
        currentPosition: computed(() => position.value),
      });

      const config = reactive({
        selectedType: "success" as ToastType,
        selectedPosition: "top-right" as ToastPosition,
        selectedAnimation: "slide" as ToastAnimation,
        maxToasts: 5,
        duration: 5000,
        showProgress: true,
        persistent: false,
        customTitle: "🎉 عنوان Toast سفارشی",
        customMessage:
          "این یک پیام نمونه است که می‌توانید آن را به دلخواه ویرایش کنید و از امکانات مختلف استفاده کنید.",
      });

      const isLoading = ref(false);

      const incTypeCounter = (type: ToastType) => {
        const key = `${type}Count` as keyof typeof stats;
        if (typeof stats[key] === "number") {
          (stats[key] as number) + 1;
        }
        stats.totalShown++;
      };

      const showQuickDemo = async () => {
        const demos = [
          { fn: () => success("🎉 عملیات با موفقیت انجام شد!"), delay: 0 },
          { fn: () => info("📢 اطلاعات جدید دریافت شد"), delay: 600 },
          { fn: () => warning("⚠️ لطفاً دقت کنید"), delay: 1200 },
          { fn: () => error("❌ خطایی رخ داده است"), delay: 1800 },
        ];

        for (const demo of demos) {
          setTimeout(() => {
            demo.fn();
            const type = demo.fn.toString().includes("success")
              ? "success"
              : demo.fn.toString().includes("info")
              ? "info"
              : demo.fn.toString().includes("warning")
              ? "warning"
              : "error";
            incTypeCounter(type as ToastType);
          }, demo.delay);
        }
      };

      const showCustomToast = () => {
        show(
          createMockToast({
            type: config.selectedType,
            title: config.customTitle,
            message: config.customMessage,
            duration: config.duration,
            animation: config.selectedAnimation,
            showProgress: config.showProgress,
            persistent: config.persistent,
            position: config.selectedPosition,
          })
        );
        incTypeCounter(config.selectedType);
      };

      const showAdvancedToast = () => {
        show(
          createMockToast({
            type: "warning",
            title: "🚀 Toast پیشرفته و تعاملی",
            message:
              "این Toast شامل عنوان، دکمه‌های عملکرد، نوار پیشرفت، استایل سفارشی و تمام قابلیت‌های پیشرفته سیستم است.",
            actions: [
              {
                label: "عالی بود! 👏",
                style: "primary",
                handler: () => {
                  success("از نظر شما بسیار متشکریم! 🙏");
                  incTypeCounter("success");
                },
              },
              {
                label: "جزئیات بیشتر 📖",
                style: "secondary",
                handler: () => {
                  info("این Toast از تمام قابلیت‌های سیستم استفاده می‌کند!");
                  incTypeCounter("info");
                },
              },
            ] as ToastAction[],
            customClass: "demo-toast-advanced",
            duration: 10000,
          })
        );
        incTypeCounter("warning");
      };

      const testPromiseIntegration = async () => {
        isLoading.value = true;

        const mockApiCall = () =>
          new Promise<{ data: string; timestamp: number; status: string }>(
            (resolve, reject) => {
              setTimeout(() => {
                Math.random() > 0.25
                  ? resolve({
                      data: "عملیات موفقیت‌آمیز",
                      timestamp: Date.now(),
                      status: "success",
                    })
                  : reject(new Error("خطا در اتصال به سرور"));
              }, 2000);
            }
          );

        try {
          await promise(mockApiCall(), {
            loading: "🔄 در حال اتصال به سرور و دریافت اطلاعات...",
            success: (data) =>
              `✅ ${data.data} در ${new Date(data.timestamp).toLocaleTimeString(
                "fa"
              )}`,
            error: (err: Error) => `❌ خطا رخ داد: ${err.message}`,
          });
          stats.totalShown++;
        } finally {
          isLoading.value = false;
        }
      };

      const updateSettings = () => {
        setPosition(config.selectedPosition);
        setMaxToasts(config.maxToasts);
        info(
          `⚙️ تنظیمات سیستم به‌روزرسانی شد: موقعیت ${config.selectedPosition}, حداکثر ${config.maxToasts} Toast همزمان`
        );
        incTypeCounter("info");
      };

      const resetStats = () => {
        Object.keys(stats).forEach((key) => {
          if (
            typeof stats[key as keyof typeof stats] === "number" &&
            key !== "currentActive"
          ) {
            (stats as any)[key] = 0;
          }
        });
        success("📊 آمار با موفقیت ریست شد");
        incTypeCounter("success");
      };

      const showTypeDemo = (type: ToastType) => {
        const messages = {
          success: "عملیات با موفقیت انجام شد! 🎉",
          error: "خطایی در سیستم رخ داده است! ❌",
          warning: "لطفاً به این موضوع توجه کنید! ⚠️",
          info: "اطلاعات جدیدی برای شما آماده است! 📢",
        };

        const fn = { success, error, warning, info }[type];
        fn(messages[type]);
        incTypeCounter(type);
      };

      // Welcome sequence
      // onMounted(() => {
      //   setTimeout(() => {
      //     success("🎉 خوش آمدید به سیستم Toast پیشرفته!");
      //     incTypeCounter('success');

      //     setTimeout(() => {
      //       info("💡 از کنترل‌های زیر برای تست تمام امکانات استفاده کنید");
      //       incTypeCounter('info');
      //     }, 1500);
      //   }, 800);
      // });

      return {
        // State
        stats,
        config,
        isLoading,
        toastTypes,
        toastPositions,
        toastAnimations,
        // Actions
        showQuickDemo,
        showCustomToast,
        showAdvancedToast,
        testPromiseIntegration,
        updateSettings,
        resetStats,
        showTypeDemo,
        dismissAll,
      };
    },
    template: `
      <div class="toast-demo-container">
        <div class="toast-demo-wrapper">
          <!-- Header Section -->
          <header class="toast-demo-header">
            <h1 class="toast-demo-title">🔔 سیستم Toast پیشرفته</h1>
            <p class="toast-demo-subtitle">
              سیستم اعلان‌رسانی مدرن، زیبا و قابل سفارشی‌سازی برای Vue 3 
              با طراحی پیشرفته و امکانات کامل
            </p>
            
            <div class="toast-demo-stats">
              <div class="toast-demo-stat">
                <div class="toast-demo-stat-value">{{ stats.totalShown }}</div>
                <div class="toast-demo-stat-label">کل نمایش‌ها</div>
              </div>
              <div class="toast-demo-stat">
                <div class="toast-demo-stat-value">{{ stats.currentActive }}</div>
                <div class="toast-demo-stat-label">فعال الان</div>
              </div>
              <div class="toast-demo-stat">
                <div class="toast-demo-stat-value">{{ stats.currentPosition }}</div>
                <div class="toast-demo-stat-label">موقعیت فعلی</div>
              </div>
            </div>
          </header>

          <!-- Quick Actions -->
          <section class="toast-demo-actions">
            <button 
              @click="showQuickDemo" 
              class="toast-demo-btn-hero"
              style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);"
            >
              🚀 نمایش سریع (۴ نمونه)
            </button>
            <button 
              @click="showAdvancedToast" 
              class="toast-demo-btn-hero"
              style="background: linear-gradient(135deg, var(--color-warning) 0%, #f97316 100%);"
            >
              ⭐ Toast پیشرفته و تعاملی
            </button>
            <button 
              @click="testPromiseIntegration" 
              class="toast-demo-btn-hero"
              :disabled="isLoading"
              style="background: linear-gradient(135deg, var(--color-info) 0%, #0ea5e9 100%);"
            >
              <span v-if="!isLoading">🔄 تست Promise Integration</span>
              <span v-else>⏳ در حال انجام...</span>
            </button>
            <button 
              @click="dismissAll" 
              class="toast-demo-btn-hero"
              style="background: linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%);"
            >
              🗑️ پاک کردن همه Toast ها
            </button>
          </section>

          <!-- Main Panels -->
          <section class="toast-demo-panels">
            
            <!-- Toast Builder Panel -->
            <div class="toast-demo-card">
              <h3 class="toast-demo-card-title">
                🛠️ سازنده Toast سفارشی
              </h3>

              <div class="toast-demo-form-grid">
                <div class="toast-demo-input-group">
                  <label class="toast-demo-label">نوع Toast:</label>
                  <select v-model="config.selectedType" class="toast-demo-select">
                    <option v-for="t in toastTypes" :key="t.type" :value="t.type">
                      {{ t.emoji }} {{ t.label }}
                    </option>
                  </select>
                </div>
                <div class="toast-demo-input-group">
                  <label class="toast-demo-label">نوع انیمیشن:</label>
                  <select v-model="config.selectedAnimation" class="toast-demo-select">
                    <option v-for="a in toastAnimations" :key="a.animation" :value="a.animation">
                      {{ a.emoji }} {{ a.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="toast-demo-input-group">
                <label class="toast-demo-label">عنوان Toast:</label>
                <input 
                  v-model="config.customTitle" 
                  class="toast-demo-input" 
                  placeholder="عنوان زیبای Toast خود را وارد کنید"
                />
              </div>

              <div class="toast-demo-input-group">
                <label class="toast-demo-label">متن پیام:</label>
                <textarea 
                  v-model="config.customMessage" 
                  class="toast-demo-textarea" 
                  placeholder="پیام جذاب و مفیدی برای کاربران بنویسید..."
                ></textarea>
              </div>

              <div class="toast-demo-triple-grid">
                <label class="toast-demo-checkbox-group">
                  <input 
                    type="checkbox" 
                    v-model="config.showProgress" 
                    class="toast-demo-checkbox"
                  />
                  <span>نمایش Progress Bar</span>
                </label>
                <label class="toast-demo-checkbox-group">
                  <input 
                    type="checkbox" 
                    v-model="config.persistent" 
                    class="toast-demo-checkbox"
                  />
                  <span>Toast دائمی</span>
                </label>
                <div class="toast-demo-input-group">
                  <input 
                    type="range" 
                    v-model="config.duration" 
                    min="1000" 
                    max="15000" 
                    step="500" 
                    class="toast-demo-range"
                  />
                  <div class="toast-demo-range-label">
                    مدت زمان: {{ Math.round(config.duration/1000) }} ثانیه
                  </div>
                </div>
              </div>

              <button 
                @click="showCustomToast" 
                class="toast-demo-btn toast-demo-btn-primary"
                style="width: 100%; margin-top: 1.5rem;"
              >
                🎯 ایجاد Toast سفارشی
              </button>
            </div>

            <!-- Settings Panel -->
            <div class="toast-demo-card">
              <h3 class="toast-demo-card-title">
                ⚙️ تنظیمات سیستم
              </h3>

              <div class="toast-demo-input-group">
                <label class="toast-demo-label">موقعیت نمایش Toast:</label>
                <select v-model="config.selectedPosition" class="toast-demo-select">
                  <option v-for="p in toastPositions" :key="p.position" :value="p.position">
                    {{ p.emoji }} {{ p.label }}
                  </option>
                </select>
              </div>

              <div class="toast-demo-input-group" style="margin-top: 1.5rem;">
                <label class="toast-demo-label">
                  حداکثر تعداد Toast همزمان: {{ config.maxToasts }}
                </label>
                <input 
                  type="range" 
                  v-model="config.maxToasts" 
                  min="1" 
                  max="10" 
                  class="toast-demo-range"
                />
              </div>

              <button 
                @click="updateSettings" 
                class="toast-demo-btn toast-demo-btn-secondary"
                style="width: 100%; margin-top: 1.5rem;"
              >
                ✅ اعمال تنظیمات
              </button>

              <div class="toast-demo-quick-types">
                <button 
                  v-for="type in toastTypes" 
                  :key="type.type"
                  @click="showTypeDemo(type.type)" 
                  class="toast-demo-chip"
                  :style="{ background: type.color }"
                >
                  {{ type.emoji }} {{ type.label }}
                </button>
              </div>
            </div>

            <!-- Statistics Panel -->
            <div class="toast-demo-card">
              <h3 class="toast-demo-card-title">
                📊 آمار و گزارش لحظه‌ای
              </h3>
              
              <div class="toast-demo-stats-grid">
                <div class="toast-demo-stat-item">
                  <div class="toast-demo-stat-number" style="color: var(--color-success);">
                    {{ stats.successCount }}
                  </div>
                  <div class="toast-demo-stat-text">✅ موفقیت</div>
                </div>
                <div class="toast-demo-stat-item">
                  <div class="toast-demo-stat-number" style="color: var(--color-error);">
                    {{ stats.errorCount }}
                  </div>
                  <div class="toast-demo-stat-text">❌ خطا</div>
                </div>
                <div class="toast-demo-stat-item">
                  <div class="toast-demo-stat-number" style="color: var(--color-warning);">
                    {{ stats.warningCount }}
                  </div>
                  <div class="toast-demo-stat-text">⚠️ هشدار</div>
                </div>
                <div class="toast-demo-stat-item">
                  <div class="toast-demo-stat-number" style="color: var(--color-info);">
                    {{ stats.infoCount }}
                  </div>
                  <div class="toast-demo-stat-text">ℹ️ اطلاعات</div>
                </div>
              </div>

              <button 
                @click="resetStats" 
                class="toast-demo-btn toast-demo-btn-secondary"
                style="width: 100%; margin-top: 1.5rem;"
              >
                ↩️ ریست کردن آمار
              </button>
            </div>
          </section>

          <!-- Toast Container -->
          <ToastContainer />
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for component to mount
    await waitFor(() => {
      const quickBtn = canvas.getByRole("button", { name: /نمایش سریع/i });
      expect(quickBtn).toBeInTheDocument();
    });

    // Test quick demo functionality
    const quickBtn = canvas.getByRole("button", { name: /نمایش سریع/i });
    await userEvent.click(quickBtn);

    // Wait for toasts to appear
    await waitFor(
      () => {
        expect(quickBtn).toBeEnabled();
      },
      { timeout: 3000 }
    );
  },
};

/* =========================
   2) Types Showcase
========================= */
export const TypesShowcase: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const { success, error, warning, info } = useToast();

      // onMounted(() => {
      //   // Sequential display of different types
      //   setTimeout(() => success("🎉 عملیات با موفقیت انجام شد!"), 200);
      //   setTimeout(() => info("📢 اطلاعات مهم برای شما"), 800);
      //   setTimeout(() => warning("⚠️ لطفاً به این موضوع توجه کنید"), 1400);
      //   setTimeout(() => error("❌ خطایی در سیستم رخ داده است"), 2000);
      // });

      return {};
    },
    template: `
      <div class="toast-demo-container" style="min-height: 70vh;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: var(--color-text); margin-bottom: 1rem;">
            🎨 نمایش انواع مختلف Toast
          </h2>
          <p style="color: var(--color-text-secondary);">
            چهار نوع اصلی Toast به صورت خودکار و متوالی نمایش داده می‌شود
          </p>
        </div>
        <ToastContainer />
      </div>
    `,
  }),
};

/* =========================
   3) Positions Demo
========================= */
export const PositionsDemo: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const { show, setPosition } = useToast();

      // onMounted(async () => {
      //   for (let i = 0; i < toastPositions.length; i++) {
      //     const pos = toastPositions[i];
      //     setTimeout(() => {
      //       setPosition(pos.position);
      //       show(
      //         createMockToast({
      //           title: `📍 ${pos.label}`,
      //           message: `Toast در موقعیت ${pos.label} نمایش داده شده است`,
      //           position: pos.position,
      //           duration: 4000
      //         })
      //       );
      //     }, i * 800);
      //   }
      // });

      return {};
    },
    template: `
      <div class="toast-demo-container" style="min-height: 70vh;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: var(--color-text); margin-bottom: 1rem;">
            📍 نمایش موقعیت‌های مختلف
          </h2>
          <p style="color: var(--color-text-secondary);">
            Toast ها در ۶ موقعیت مختلف صفحه نمایش داده می‌شوند
          </p>
        </div>
        
        <ToastContainer />
      </div>
    `,
  }),
};

/* =========================
   4) Animations Showcase
========================= */
export const AnimationsShowcase: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const { show } = useToast();

      // onMounted(() => {
      //   toastAnimations.forEach((anim, index) => {
      //     setTimeout(() => {
      //       show(
      //         createMockToast({
      //           title: `🎬 انیمیشن ${anim.label}`,
      //           message: `این Toast با انیمیشن ${anim.label} نمایش داده شده است`,
      //           animation: anim.animation,
      //           type: index % 2 === 0 ? "info" : "success",
      //           duration: 5000
      //         })
      //       );
      //     }, index * 600);
      //   });
      // });

      return {};
    },
    template: `
      <div class="toast-demo-container" style="min-height: 70vh;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: var(--color-text); margin-bottom: 1rem;">
            🎬 نمایش انیمیشن‌های مختلف
          </h2>
          <p style="color: var(--color-text-secondary);">
            ۴ نوع انیمیشن مختلف برای نمایش Toast ها
          </p>
        </div>
        <ToastContainer />
      </div>
    `,
  }),
};

/* =========================
   5) Interactive Features
========================= */
export const InteractiveFeatures: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const { show, success, info } = useToast();

      // onMounted(() => {
      //   show(
      //     createMockToast({
      //       type: "warning",
      //       title: "🎮 Toast تعاملی پیشرفته",
      //       message: "این Toast شامل دکمه‌های عملکرد، نوار پیشرفت و امکانات تعاملی است. روی دکمه‌ها کلیک کنید!",
      //       duration: 8000,
      //       actions: [
      //         {
      //           label: "👍 عالی بود!",
      //           style: "primary",
      //           handler: () => {
      //             success("🎉 از نظر شما بسیار متشکریم!");
      //           },
      //         },
      //         {
      //           label: "📖 اطلاعات بیشتر",
      //           style: "secondary",
      //           handler: () => {
      //             info("💡 این سیستم Toast شامل تمام امکانات مدرن است: انیمیشن، موقعیت‌بندی، Progress Bar، دکمه‌های تعاملی و...");
      //           },
      //         },
      //       ] as ToastAction[],
      //       showProgress: true,
      //       customClass: "demo-interactive-toast"
      //     })
      //   );
      // });

      return {};
    },
    template: `
      <div class="toast-demo-container" style="min-height: 70vh;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: var(--color-text); margin-bottom: 1rem;">
            🎮 امکانات تعاملی
          </h2>
          <p style="color: var(--color-text-secondary);">
            Toast با دکمه‌های عملکرد، نوار پیشرفت و قابلیت‌های تعاملی
          </p>
        </div>
        <ToastContainer />
      </div>
    `,
  }),
};

/* =========================
   6) Queue Management
========================= */
export const QueueManagement: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const { show, setMaxToasts } = useToast();

      // onMounted(() => {
      //   setMaxToasts(3); // Limit to 3 simultaneous toasts

      //   // Create 8 toasts to demonstrate queue
      //   Array.from({ length: 8 }, (_, i) => {
      //     setTimeout(() => {
      //       show(createMockToast({
      //         title: `📦 Toast شماره ${i + 1}`,
      //         message: `این Toast در صف قرار گرفته و به ترتیب نمایش داده می‌شود`,
      //         type: ["success", "info", "warning", "error"][i % 4] as ToastType,
      //         duration: 3000
      //       }));
      //     }, i * 400);
      //   });
      // });

      return {};
    },
    template: `
      <div class="toast-demo-container" style="min-height: 70vh;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: var(--color-text); margin-bottom: 1rem;">
            📦 مدیریت صف Toast ها
          </h2>
          <p style="color: var(--color-text-secondary);">
            حداکثر ۳ Toast همزمان، بقیه در صف منتظر نمایش
          </p>
        </div>
        <ToastContainer />
      </div>
    `,
  }),
};

/* =========================
   7) Promise Integration
========================= */
export const PromiseIntegration: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const { promise } = useToast();

      // onMounted(async () => {
      //   // Success scenario
      //   const successTask = new Promise<{ result: string; time: number }>((resolve) =>
      //     setTimeout(() => resolve({
      //       result: "داده‌ها با موفقیت دریافت شد",
      //       time: Date.now()
      //     }), 2000)
      //   );

      //   await promise(successTask, {
      //     loading: "🔄 در حال دریافت اطلاعات از سرور...",
      //     success: (data) => `✅ ${data.result} در ${new Date(data.time).toLocaleTimeString("fa")}`,
      //     error: () => "❌ خطا در دریافت اطلاعات",
      //   });

      //   // Error scenario after a delay
      //   setTimeout(async () => {
      //     const errorTask = new Promise<never>((_, reject) =>
      //       setTimeout(() => reject(new Error("خطا در اتصال به پایگاه داده")), 1500)
      //     );

      //     try {
      //       await promise(errorTask, {
      //         loading: "🔄 در حال اتصال به پایگاه داده...",
      //         success: () => "✅ اتصال برقرار شد",
      //         error: (err: Error) => `❌ ${err.message}`,
      //       });
      //     } catch (e) {
      //       // Error handled by promise integration
      //     }
      //   }, 3000);
      // });

      return {};
    },
    template: `
      <div class="toast-demo-container" style="min-height: 70vh;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: var(--color-text); margin-bottom: 1rem;">
            🔗 یکپارچگی با Promise ها
          </h2>
          <p style="color: var(--color-text-secondary);">
            مدیریت خودکار Toast برای عملیات async (loading, success, error)
          </p>
        </div>
        <ToastContainer />
      </div>
    `,
  }),
};

/* =========================
   8) Error Processing
========================= */
export const ErrorProcessing: Story = {
  render: () => ({
    components: { ToastContainer },
    setup() {
      const { processError } = useToast();

      // onMounted(() => {
      //   // Simulate different types of errors
      //   setTimeout(() => {
      //     const networkError = new Error("Network timeout");
      //     // @ts-expect-error: Simulating server response
      //     networkError.response = {
      //       status: 408,
      //       data: { message: "درخواست منقضی شد" },
      //     };
      //     processError(networkError);
      //   }, 500);

      //   setTimeout(() => {
      //     const serverError = new Error("Internal server error");
      //     // @ts-expect-error: Simulating server response
      //     serverError.response = {
      //       status: 500,
      //       data: { message: "خطای داخلی سرور" },
      //     };
      //     processError(serverError);
      //   }, 1500);

      //   setTimeout(() => {
      //     const validationError = new Error("Validation failed");
      //     // @ts-expect-error: Simulating server response
      //     validationError.response = {
      //       status: 400,
      //       data: {
      //         message: "اطلاعات وارد شده نامعتبر است",
      //         errors: ["ایمیل الزامی است", "رمز عبور باید حداقل ۸ کاراکتر باشد"]
      //       },
      //     };
      //     processError(validationError);
      //   }, 2500);
      // });

      return {};
    },
    template: `
      <div class="toast-demo-container" style="min-height: 70vh;">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: var(--color-text); margin-bottom: 1rem;">
            🚨 پردازش خطاها
          </h2>
          <p style="color: var(--color-text-secondary);">
            مدیریت هوشمند انواع مختلف خطاها (Network, Server, Validation)
          </p>
        </div>
        <ToastContainer />
      </div>
    `,
  }),
};
