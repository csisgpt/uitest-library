import BaseBadge from "./BaseBadge.vue";
import type { Meta, StoryFn } from "@storybook/vue3";

export default {
  title: "Components/BaseBadge",
  component: BaseBadge,
  argTypes: {
    color: {
      control: { type: "select" },
      options: ["primary", "success", "error", "warning", "info", "neutral"],
    },
    variant: {
      control: { type: "select" },
      options: ["solid", "soft", "outline"],
    },
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    rounded: { control: { type: "select" }, options: ["sm", "md", "full"] },
    dot: { control: "boolean" },
    positioned: { control: "boolean" },
    aspectSquare: { control: "boolean" }, // 👈 اضافه شد
    text: { control: "text" },
  },
} satisfies Meta<typeof BaseBadge>;

const Template: StoryFn<typeof BaseBadge> = (args) => ({
  components: { BaseBadge },
  setup: () => ({ args }),
  template: `<BaseBadge v-bind="args" />`,
});

export const Default = Template.bind({});
Default.args = {
  text: "9",
  color: "primary",
  variant: "solid",
  size: "md",
  rounded: "md",
  dot: false,
  positioned: false,
  aspectSquare: false,
};

export const Dot = Template.bind({});
Dot.args = {
  dot: true,
  color: "success",
};

export const Variants = () => ({
  components: { BaseBadge },
  template: `
    <div style="display:flex; gap:0.5rem;">
      <BaseBadge text="1" variant="solid" />
      <BaseBadge text="2" variant="soft" />
      <BaseBadge text="3" variant="outline" />
    </div>
  `,
});

export const Colors = () => ({
  components: { BaseBadge },
  data: () => ({
    colors: ["primary", "success", "error", "warning", "info", "neutral"],
  }),
  template: `
    <div style="display:flex; gap:0.5rem;">
      <BaseBadge v-for="c in colors" :key="c" :color="c" text="1" />
    </div>
  `,
});

export const Sizes = () => ({
  components: { BaseBadge },
  template: `
    <div style="display:flex; gap:0.5rem; align-items:center;">
      <BaseBadge size="sm" text="S" />
      <BaseBadge size="md" text="M" />
      <BaseBadge size="lg" text="L" />
    </div>
  `,
});

export const Rounded = () => ({
  components: { BaseBadge },
  template: `
    <div style="display:flex; gap:0.5rem; align-items:center;">
      <BaseBadge rounded="sm" size="lg" text="S" />
      <BaseBadge rounded="md" size="lg" text="S" />
      <BaseBadge rounded="full" size="lg" text="S" />
    </div>
  `,
});

export const PositionedOverIcon = () => ({
  components: { BaseBadge },
  template: `
    <div style="position:relative; display:inline-block;">
      <span style="font-size:2rem;">🔔</span>
      <BaseBadge text="3" positioned />
    </div>
  `,
});

/** ------- استوری‌های جدید مربوط به aspectSquare ------- **/

// نمایش حالت مربعی با سایزهای مختلف
export const AspectSquareSizes = () => ({
  components: { BaseBadge },
  template: `
    <div style="display:flex; gap:0.75rem; align-items:center;">
      <BaseBadge aspectSquare size="sm" />
      <BaseBadge aspectSquare size="md" />
      <BaseBadge aspectSquare size="lg" />
    </div>
  `,
});

// ترکیب aspectSquare با variant ها و رنگ‌ها
export const AspectSquareVariants = () => ({
  components: { BaseBadge },
  template: `
    <div style="display:flex; flex-direction:column; gap:0.75rem;">
      <div style="display:flex; gap:0.5rem;">
        <BaseBadge aspectSquare variant="solid" color="primary" />
        <BaseBadge aspectSquare variant="solid" color="success" />
        <BaseBadge aspectSquare variant="solid" color="error" />
      </div>
      <div style="display:flex; gap:0.5rem;">
        <BaseBadge aspectSquare variant="soft" color="warning" />
        <BaseBadge aspectSquare variant="soft" color="info" />
        <BaseBadge aspectSquare variant="soft" color="neutral" />
      </div>
      <div style="display:flex; gap:0.5rem;">
        <BaseBadge aspectSquare variant="outline" color="primary" />
        <BaseBadge aspectSquare variant="outline" color="success" />
        <BaseBadge aspectSquare variant="outline" color="error" />
      </div>
    </div>
  `,
});

// مقایسه dot با aspectSquare
export const DotVsAspectSquare = () => ({
  components: { BaseBadge },
  template: `
    <div style="display:flex; gap:1rem; align-items:center;">
      <div style="display:flex; gap:0.5rem; align-items:center;">
        <span style="min-width:5rem; font-size:0.875rem;">dot</span>
        <BaseBadge dot color="primary" />
        <BaseBadge dot color="success" />
        <BaseBadge dot color="error" />
      </div>
      <div style="display:flex; gap:0.5rem; align-items:center;">
        <span style="min-width:5rem; font-size:0.875rem;">aspectSquare</span>
        <BaseBadge aspectSquare color="primary" />
        <BaseBadge aspectSquare color="success" />
        <BaseBadge aspectSquare color="error" />
      </div>
    </div>
  `,
});

// نمونه مربعی با متن داخل (برای چک کردن alignment)
export const AspectSquareWithText = () => ({
  components: { BaseBadge },
  template: `
    <div style="display:flex; gap:0.75rem; align-items:center;">
      <BaseBadge aspectSquare size="sm" text="1" />
      <BaseBadge aspectSquare size="md" text="2" />
      <BaseBadge aspectSquare size="lg" text="3" />
    </div>
  `,
});
