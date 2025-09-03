import type { Meta, StoryObj } from "@storybook/vue3";
import BaseButton from "./BaseButton.vue";

// برای نمونه آیکن ساده (SVG inline)
const IconCheck = {
  name: "IconCheck",
  template: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

const tones = [
  "primary",
  "secondary",
  "success",
  "warning",
  "info",
  "error",
  "neutral",
] as const;
const variants = ["solid", "soft", "outline", "ghost", "link", "text"] as const;
const sizes = ["sm", "md", "lg"] as const;
const shapes = ["rounded", "pill", "square", "circle"] as const;
const elevations = ["none", "sm", "md", "lg"] as const;

const meta = {
  title: "Components/BaseButton",
  component: BaseButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "دکمه پایه با پشتیبانی از Variant/Tone/Size/Shape، Ripple، حالت لینک، Loading، Block و ... — کاملاً مبتنی بر CSS Variables و قابل تمینگ.",
      },
    },
  },
  argTypes: {
    variant: { control: { type: "select" }, options: variants },
    tone: { control: { type: "select" }, options: tones },
    size: { control: { type: "select" }, options: sizes },
    shape: { control: { type: "select" }, options: shapes },
    elevation: { control: { type: "inline-radio" }, options: elevations },
    type: {
      control: { type: "inline-radio" },
      options: ["button", "submit", "reset"],
    },
    block: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    iconOnly: { control: "boolean" },
    ripple: { control: "boolean" },
    href: { control: "text" },
    target: { control: "text" },
    rel: { control: "text" },
    ariaLabel: { control: "text" },
    onClick: { action: "click" },
  },
  args: {
    variant: "solid",
    tone: "primary",
    size: "md",
    shape: "rounded",
    elevation: "sm",
    block: false,
    disabled: false,
    loading: false,
    iconOnly: false,
    ripple: true,
    type: "button",
  },
} satisfies Meta<typeof BaseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "Playground (با کنترل‌ها)",
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args };
    },
    template: `<BaseButton v-bind="args">دکمه اصلی</BaseButton>`,
  }),
};

export const WithPrefixSuffix: Story = {
  name: "Prefix/Suffix + Loading",
  args: { loading: false },
  render: (args) => ({
    components: { BaseButton, IconCheck },
    setup() {
      return { args };
    },
    template: `
      <div class="sb-grid">
        <BaseButton v-bind="args">
          <template #prefix><IconCheck /></template>
          دکمه تایید
          <template #suffix>↗</template>
        </BaseButton>
        <BaseButton v-bind="{...args, loading: true}">
          <template #prefix><IconCheck /></template>
          در حال ارسال
        </BaseButton>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args, sizes };
    },
    template: `
      <div class="sb-stack" style="display:flex ; gap:12px ; align-items: center;"  >
        <BaseButton v-for="s in sizes" :key="s" v-bind="{...args, size: s}" style="min-width : fit-content">سایز {{ s }}</BaseButton>
      </div>
    `,
  }),
};

export const Shapes: Story = {
  args: { ariaLabel: "تنظیمات" },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args, shapes };
    },
    template: `
      <div class="sb-stack" style="display:flex ; gap:12px ; align-items: center;">
        <BaseButton v-for="sh in shapes" :key="sh" v-bind="{...args, shape: sh}"> {{ sh }} </BaseButton>
      </div>
    `,
  }),
};

export const Elevations: Story = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args, elevations };
    },
    template: `
      <div class="sb-stack" style="display:flex ; gap:12px ; align-items: center;">
        <BaseButton v-for="e in elevations" :key="e" v-bind="{...args, elevation: e}">elev: {{ e }}</BaseButton>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args, variants };
    },
    template: `
      <div class="sb-stack" style="display:flex ; gap:12px ; align-items: center; flex-wrap : wrap">
        <BaseButton v-for="v in variants" :key="v" v-bind="{...args, variant: v}" style="min-width : fit-content ; max-width : 30%">variant: {{ v }}</BaseButton>
      </div>
      <div class="sb-stack" style="display:flex ; gap:12px ; align-items: center; flex-wrap : wrap ; margin-top: 3rem">
        <BaseButton v-for="v in variants" :key="v" v-bind="{...args, variant: v , tone : 'error'}" style="min-width : fit-content ; max-width : 30%">variant: {{ v }}</BaseButton>
      </div>
    `,
  }),
};

export const Tones: Story = {
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args, tones };
    },
    template: `
      <div class="sb-stack" style="display:flex ; gap:12px ; align-items: center; flex-wrap : wrap">
        <BaseButton v-for="t in tones" :key="t" v-bind="{...args, tone: t}" style="min-width : fit-content ; max-width : 30%">tone: {{ t }}</BaseButton>
      </div>
    `,
  }),
};

export const VariantToneMatrix: Story = {
  parameters: { layout: "padded" },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args, tones, variants };
    },
    template: `
      <div class="sb-grid matrix" style="grid-auto-rows: minmax(0,auto);">
        <div class="sb-title">Variant × Tone</div>
        <div v-for="v in variants" :key="v" class="sb-card">
          <div class="sb-subtle">variant: {{ v }}</div>
          <div class="sb-stack" style="display:flex ; gap:12px ; align-items: center;" style="margin-top: var(--space-md)">
            <BaseButton v-for="t in tones" :key="t" v-bind="{...args, variant: v, tone: t}">{{ t }}</BaseButton>
          </div>
        </div>
      </div>
    `,
  }),
};

export const States: Story = {
  name: "States: Default / Hover / Active / Disabled / Loading / Link",
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args };
    },
    template: `
      <div class="sb-grid" style="display:flex ; gap:12px ; align-items: center; flex-wrap : wrap">
        <div class="sb-card">
          <div class="sb-subtle">Default</div>
          <BaseButton v-bind="args">پیش‌فرض</BaseButton>
        </div>
        <div class="sb-card">
          <div class="sb-subtle">Disabled</div>
          <BaseButton v-bind="{...args, disabled: true}">غیرفعال</BaseButton>
        </div>
        <div class="sb-card">
          <div class="sb-subtle">Loading</div>
          <BaseButton v-bind="{...args, loading: true}">لودینگ</BaseButton>
        </div>
        <div class="sb-card">
          <div class="sb-subtle">As Link</div>
          <BaseButton v-bind="{...args, href: 'https://example.com', target: '_blank', rel: 'noreferrer'}">به لینک</BaseButton>
        </div>
        <div class="sb-card">
          <div class="sb-subtle">Block</div>
          <BaseButton v-bind="{...args, block: true}">تمام‌عرض</BaseButton>
        </div>
        <div class="sb-card">
          <div class="sb-subtle">No Ripple</div>
          <BaseButton v-bind="{...args, ripple: false}">Ripple خاموش</BaseButton>
        </div>
      </div>
    `,
  }),
};

export const RTLvsLTR: Story = {
  parameters: {
    // می‌توانید از Toolbar جهانی dir استفاده کنید؛ این استوری فقط توضیح می‌دهد
    docs: {
      description: {
        story:
          "از Toolbar بالای Storybook بین RTL و LTR سوییچ کنید تا padding/shape/icon placement بررسی شود.",
      },
    },
  },
  render: (args) => ({
    components: { BaseButton },
    setup() {
      return { args };
    },
    template: `<BaseButton v-bind="args"><span>سلام دنیا</span></BaseButton>`,
  }),
};

// // 🧪 تست تعاملی و اکسس‌بیلیتی پایه
// export const AccessibleAndClickable: Story = {
//   args: { ariaLabel: undefined },
//   render: (args) => ({
//     components: { BaseButton },
//     setup() { return { args }; },
//     template: `<BaseButton v-bind="args">کلیک کن</BaseButton>`
//   }),
//   play: async ({ canvasElement, step }) => {
//     const { within, userEvent } = await import('@storybook/testing-library');
//     const canvas = within(canvasElement);
//     await step('دکمه باید قابل فوکوس باشد', async () => {
//       const btn = await canvas.findByRole('button', { name: /کلیک کن/i });
//       await userEvent.tab();
//       // اگر فوکوس-استایل‌ها اعمال شوند مشکلی نیست؛ این فقط smoke-test است
//       btn.focus();
//     });
//     await step('کلیک شبیه‌سازی شود', async () => {
//       const btn = await canvas.findByRole('button');
//       await userEvent.click(btn);
//     });
//   }
// };
