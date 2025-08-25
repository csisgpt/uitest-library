// BaseToast.stories.ts
import type { Meta, StoryObj } from "@storybook/vue3";
import { userEvent, within, waitFor, expect } from "storybook/test";
import { defineComponent, ref, computed, onMounted, nextTick } from "vue";

import BaseToast from "./BaseToast.vue";
import BaseButton from "../BaseButton/BaseButton.vue"; // اگر alias داری

import type {
  ToastType,
  ToastPosition,
  ToastAnimation,
  ToastAction,
} from "./types";

// ✅ Meta
const meta = {
  title: "Feedback/Toast System/BaseToast (Unit)",
  component: BaseToast,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
استوری‌های سطح‌پایین برای \`BaseToast\` تا رندر، اکشن‌ها و Progress را مستقل از Container بررسی کنید.`,
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["success", "error", "warning", "info"] satisfies ToastType[],
    },
    title: { control: "text" },
    message: { control: "text" },
    duration: { control: { type: "range", min: 0, max: 15000, step: 250 } },
    position: {
      control: "select",
      options: [
        "top-right",
        "top-left",
        "top-center",
        "bottom-right",
        "bottom-left",
        "bottom-center",
      ] satisfies ToastPosition[],
    },
    animation: {
      control: "select",
      options: ["slide", "fade", "scale", "bounce"] satisfies ToastAnimation[],
    },
    showProgress: { control: "boolean" },
    persistent: { control: "boolean" },

    primaryAction: { control: "text", description: "برچسب دکمه اصلی" },
    secondaryAction: { control: "text", description: "برچسب دکمه ثانویه" },

    onClose: { action: "close", table: { disable: true } },
    onAction: { action: "action", table: { disable: true } },
  },
  args: {
    type: "info",
    title: "ℹ️ نمونه Toast",
    message: "سلام! این یک پیام نمونه است.",
    duration: 5000,
    position: "top-right",
    animation: "slide",
    showProgress: true,
    persistent: false,
    primaryAction: "تأیید",
    secondaryAction: "",
  },
} satisfies Meta<typeof BaseToast>;

export default meta;
type Story = StoryObj<typeof meta>;

// Harness to translate flat args → toast object
const Harness = defineComponent({
  components: { BaseToast, BaseButton }, // ⬅️ BaseButton
  props: {
    type: { type: String, required: true },
    title: { type: String, required: false },
    message: { type: String, required: true },
    duration: { type: Number, required: true },
    position: { type: String, required: true },
    animation: { type: String, required: true },
    showProgress: { type: Boolean, required: true },
    persistent: { type: Boolean, required: true },
    primaryAction: { type: String, required: false },
    secondaryAction: { type: String, required: false },
    onClose: { type: Function, required: false },
    onAction: { type: Function, required: false },
  },
  setup(props) {
    const visible = ref(true);
    const seed = ref(0); // ⬅️ برای ایجاد toast جدید
    const mountKey = ref(0); // ⬅️ برای force-remount

    const actions = computed<ToastAction[] | undefined>(() => {
      const list: ToastAction[] = [];
      if (props.primaryAction)
        list.push({
          label: props.primaryAction,
          style: "primary",
          handler: () => {},
        });
      if (props.secondaryAction)
        list.push({
          label: props.secondaryAction,
          style: "secondary",
          handler: () => {},
        });
      return list.length ? list : undefined;
    });

    const toast = computed(() => ({
      // وابسته‌اش می‌کنیم به seed تا هر replay، createdAt تازه شود
      _seed: seed.value, // ⬅️ فقط برای re-compute
      id: `unit-${Date.now()}`,
      type: props.type as ToastType,
      title: props.title || "",
      message: props.message,
      duration: props.persistent ? 0 : props.duration,
      persistent: props.persistent,
      position: props.position as ToastPosition,
      animation: props.animation as ToastAnimation,
      showProgress: props.showProgress,
      actions: actions.value,
      createdAt: Date.now(),
      onClick: () => {},
    }));

    // استایل‌ها
    const frameStyle = {
      padding: "var(--space-xl)",
      background: "var(--color-surface)",
      minWidth: "min(92vw, 720px)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
      position: "relative",
    } as const;

    const controlBarStyle = {
      // ⬅️ نوار کنترل
      position: "absolute",
      left: "0",
      padding: "8px",
      insetInlineStart: "var(--space-xl)",
      insetBlockStart: "var(--space-xl)",
      display: "flex",
      justifyContent: "end",
      gap: "var(--space-sm)",
      zIndex: 1,
    } as const;

    onMounted(() => {
      visible.value = true;
    });

    const handleClose = (id: string) => {
      visible.value = false;
      props.onClose?.(id);
    };
    const handleAction = (a: ToastAction) => props.onAction?.(a, toast.value);

    // ⬅️ دکمه «نمایش دوباره»
    const replay = async () => {
      visible.value = false; // unmount
      await nextTick();
      seed.value++; // باعث می‌شود computed دوباره ساخته شود (createdAt جدید)
      mountKey.value++; // force remount برای Transition/Progress
      visible.value = true; // mount
    };

    return {
      toast,
      visible,
      frameStyle,
      controlBarStyle,
      handleClose,
      handleAction,
      replay,
      mountKey,
    };
  },
  template: `
    <div :style="frameStyle"  style="min-height : 200px">
      <!-- کنترل‌ها -->
      <div :style="controlBarStyle">
        <BaseButton variant="solid" tone="primary" size="sm" @click="replay">
          نمایش دوباره
        </BaseButton>
        <BaseButton v-if="visible" variant="soft" tone="neutral" size="sm" @click="visible=false">
          بستن
        </BaseButton>
      </div>

      <!-- خود Toast -->
      <BaseToast
        v-if="visible"
        :key="mountKey"
        :toast="toast"
        :onClose="handleClose"
        :onAction="handleAction"
      />
    </div>
  `,
});

// ---------- Stories ----------

export const Basic: Story = {
  render: (args) => ({
    components: { Harness },
    setup: () => ({ args }),
    template: `<Harness v-bind="args" />`,
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // انتظار داریم متن دیده شود
    await waitFor(async () => {
      const msg = await c.findByText(/پیام نمونه|این یک پیام نمونه/i);
      expect(msg).toBeTruthy();
    });
  },
};

export const WithActions: Story = {
  args: {
    type: "warning",
    title: "دکمه‌ها",
    primaryAction: "قبول",
    secondaryAction: "جزئیات",
  },
  render: (args) => ({
    components: { Harness },
    setup: () => ({ args }),
    template: `<Harness v-bind="args" />`,
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const accept = await c.findByRole("button", { name: /قبول/i });
    await userEvent.click(accept);
  },
};

export const Persistent: Story = {
  args: {
    persistent: true,
    duration: 0,
    type: "info",
    showProgress: false,
    title: "دائمی",
  },
  render: (args) => ({
    components: { Harness },
    setup: () => ({ args }),
    template: `<Harness v-bind="args" />`,
  }),
};

export const LongContent: Story = {
  args: {
    type: "error",
    title: "پیام طولانی",
    message:
      "متن طولانی برای بررسی شکست خطوط و ارتفاع کارت. این پیام می‌تواند شامل چند جمله باشد تا استایل‌ها بررسی شوند.",
    duration: 7000,
    showProgress: true,
  },
  render: (args) => ({
    components: { Harness },
    setup: () => ({ args }),
    template: `<Harness v-bind="args" />`,
  }),
};

export const DarkMode: Story = {
  args: {
    type: "success",
    title: "Dark",
    message: "پشتیبانی از تم تاریک",
    duration: 4000,
  },
  render: (args) => ({
    components: { Harness },
    setup() {
      // فعال‌سازی تم تاریک روی روت
      const root = document.documentElement;
      root.setAttribute("data-theme", "dark");
      return { args };
    },
    template: `<Harness v-bind="args" />`,
  }),
};
