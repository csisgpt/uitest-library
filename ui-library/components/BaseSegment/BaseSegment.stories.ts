import type { Meta, StoryObj } from "@storybook/vue3";
import { h, ref , reactive } from "vue";
import BaseSegment from "./BaseSegment.vue";

// If you have global CSS tokens, import them here so stories pick them up in SB
// import '../styles/index.css'

const colors = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "dark",
  "light",
] as const;

const sizes = ["small", "default", "large"] as const;

const meta: Meta<typeof BaseSegment> = {
  title: "UI/Segment",
  component: BaseSegment,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    docs: {
      description: {
        component:
          "A segmented control with optional swipe gestures, scrollable mode, icons, and full keyboard support. Built with Vue 3 `<script setup>` and CSS Modules.",
      },
    },
  },
  argTypes: {
    modelValue: { control: false, table: { category: "v-model" } },
    items: {
      control: "object",
      description:
        "Array of strings/numbers or { value, label, icon, disabled }",
    },
    color: {
      options: colors,
      control: { type: "select" },
    },
    size: {
      options: sizes,
      control: { type: "inline-radio" },
    },
    disabled: { control: "boolean" },
    scrollable: { control: "boolean" },
    swipeGesture: { control: "boolean" },
    selectOnFocus: { control: "boolean" },
    // Events
    "update:modelValue": {
      action: "update:modelValue",
      table: { category: "events" },
    },
    change: { action: "change", table: { category: "events" } },
    select: { action: "select", table: { category: "events" } },
    focus: { action: "focus", table: { category: "events" } },
    blur: { action: "blur", table: { category: "events" } },
  },
  args: {
    items: [
      { value: "all", label: "All" },
      { value: "open", label: "Open" },
      { value: "closed", label: "Closed" },
    ],
    color: "primary",
    size: "default",
    disabled: false,
    scrollable: false,
    swipeGesture: false,
    selectOnFocus: false,
  },
};
export default meta;

type Story = StoryObj<typeof BaseSegment>;

/**
 * Reusable render helper that wires v-model for interactive stories
 */
const withModel =
  (initial?: string | number): Story["render"] =>
  (args) => ({
    components: { BaseSegment },
    setup() {
      const value = ref(
        initial ??
          (Array.isArray(args.items)
            ? (args.items[0] as any).value ?? args.items[0]
            : undefined)
      );
      return { args, value };
    },
    template: `
    <div style="min-width: 320px;">
      <BaseSegment v-bind="args" v-model="value" />
      <div style="margin-top: 12px; font: 14px/1.4 ui-sans-serif,system-ui; opacity:.7;">
        Selected: <code>{{ value }}</code>
      </div>
    </div>
  `,
  });

export const Playground: Story = {
  name: "Playground",
  render: withModel(),
};

export const Colors: Story = {
  render: (args) => ({
    components: { BaseSegment },
    setup() {
      const selections = colors.reduce<Record<string, any>>((acc, c) => {
        acc[c] = ref((args.items as any)[0].value ?? (args.items as any)[0]);
        return acc;
      }, {});
      return { args, selections, colors };
    },
    template: `
      <div style="display:grid; gap:16px; min-width: 420px;">
        <div v-for="c in colors" :key="c" style="display:flex; flex-direction:column; gap:8px;">
          <label style="font: 600 12px/1 ui-sans-serif,system-ui; text-transform:uppercase; letter-spacing:.04em; opacity:.75;">{{ c }}</label>
          <BaseSegment v-bind="{...args, color:c}" v-model="selections[c]" />
        </div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseSegment },
    setup() {
      const small = ref("all");
      const def = ref("open");
      const large = ref("closed");
      return { args, small, def, large };
    },
    template: `
      <div style="display:grid; gap:16px; min-width: 420px;">
        <BaseSegment v-bind="{...args, size:'small'}" v-model="small" />
        <BaseSegment v-bind="{...args, size:'default'}" v-model="def" />
        <BaseSegment v-bind="{...args, size:'large'}" v-model="large" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: withModel("open"),
};

export const WithIcons: Story = {
  args: {
    items: [
      { value: "list", label: "List", icon: "list" },
      { value: "grid", label: "Grid", icon: "grid" },
      { value: "map", label: "Map", icon: "map" },
    ],
  },
  render: withModel("grid"),
};

export const LongLabels: Story = {
  args: {
    items: [
      { value: "basic", label: "Really long option label" },
      { value: "pro", label: "Professional plan with extras" },
      { value: "enterprise", label: "Enterprise-grade everything" },
    ],
  },
  render: withModel("pro"),
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { value: "alpha", label: "Alpha" },
      { value: "beta", label: "Beta", disabled: true },
      { value: "gamma", label: "Gamma" },
    ],
  },
  render: withModel("alpha"),
};

export const Scrollable: Story = {
  args: {
    scrollable: true,
    items: Array.from({ length: 12 }, (_, i) => ({
      value: `i-${i + 1}`,
      label: `Item ${i + 1}`,
    })),
  },
  render: withModel("i-2"),
};

export const SwipeGesture: Story = {
  args: {
    swipeGesture: true,
    items: [
      { value: 1, label: "One" },
      { value: 2, label: "Two" },
      { value: 3, label: "Three" },
      { value: 4, label: "Four" },
    ],
  },
  render: withModel(2),
  parameters: {
    docs: {
      description: {
        story: "On touch devices, swipe left/right to change selection.",
      },
    },
  },
};

export const SelectOnFocus: Story = {
  args: { selectOnFocus: true },
  render: withModel("closed"),
  parameters: {
    docs: {
      description: {
        story:
          "When enabled, focusing a button selects it. Try tabbing through the options.",
      },
    },
  },
};

export const ControlledExternal: Story = {
  render: (args) => ({
    components: { BaseSegment },
    setup() {
      const value = ref("a");
      const set = (v: string) => (value.value = v);
      return { args, value, set };
    },
    template: `
      <div style="display:grid; gap:12px; min-width: 340px;">
        <BaseSegment v-bind="args" v-model="value" />
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button @click="set('a')">Select A</button>
          <button @click="set('b')">Select B</button>
          <button @click="set('c')">Select C</button>
        </div>
        <pre style="margin:0; opacity:.7;">modelValue: {{ value }}</pre>
      </div>
    `,
  }),
  args: {
    items: [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
      { value: "c", label: "C" },
    ],
  },
};

export const RTL: Story = {
  name: "RTL (Right-to-left)",
  render: (args) => ({
    components: { BaseSegment },
    setup() {
      const value = ref("ar");
      return { args, value };
    },
    template: `
      <div dir="rtl" style="min-width: 360px;">
        <BaseSegment v-bind="args" v-model="value" />
      </div>
    `,
  }),
  args: {
    items: [
      { value: "fa", label: "فارسی" },
      { value: "ar", label: "العربية" },
      { value: "he", label: "עברית" },
    ],
    color: "secondary",
  },
};

export const LightVsDark: Story = {
  name: "Light vs. Dark",
  render: (args) => ({
    components: { BaseSegment },
    setup() {
      const left = ref("all");
      const right = ref("open");
      return { args, left, right };
    },
    template: `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; min-width: 640px;">
        <div style="padding:16px; border:1px solid var(--color-border); border-radius:12px; background: var(--color-surface);">
          <div style="font: 600 12px/1 ui-sans-serif,system-ui; text-transform:uppercase; letter-spacing:.04em; opacity:.75; margin-bottom:8px;">Light</div>
          <BaseSegment v-bind="args" v-model="left" />
        </div>
        <div style="padding:16px; border:1px solid var(--color-border); border-radius:12px; background: #111; color:#eee;">
          <div style="font: 600 12px/1 ui-sans-serif,system-ui; text-transform:uppercase; letter-spacing:.04em; opacity:.75; margin-bottom:8px;">Dark (container)</div>
          <BaseSegment v-bind="args" v-model="right" />
        </div>
      </div>
    `,
  }),
};

export const ManySegmentsGrid: Story = {
  name: "Gallery (all colors × sizes)",
  render: (args) => ({
    components: { BaseSegment },
    setup() {
      const values = reactive<Record<string, string | number>>({});
      const keyOf = (c: string, s: string) => `${c}:${s}`;
      const valOf = (item: any) =>
        item && typeof item === "object" ? item.value : item;
      const initial =
        Array.isArray(args.items) && (args.items as any[]).length
          ? valOf((args.items as any[])[0])
          : undefined;

      colors.forEach((c) =>
        sizes.forEach((s) => {
          values[keyOf(c, s)] = initial as any;
        })
      );

      return { args, colors, sizes, values, keyOf };
    },
    template: `
<div style="display:grid; gap:12px; min-width: 720px;">
<div v-for="c in colors" :key="c" style="display:grid; gap:8px;">
<h4 style="margin:4px 0; font:600 13px/1.2 ui-sans-serif,system-ui; opacity:.8;">Color: {{ c }}</h4>
<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap:12px;">
<div v-for="s in sizes" :key="s" style="padding:12px; border:1px solid var(--color-border); border-radius:12px;">
<div style="font:500 12px/1 ui-sans-serif,system-ui; opacity:.7; margin-bottom:8px;">Size: {{ s }}</div>
<BaseSegment
:color="c"
:size="s"
:items="args.items"
:modelValue="values[keyOf(c,s)]"
@update:modelValue="(v) => (values[keyOf(c,s)] = v)"
/>
</div>
</div>
</div>
</div>
`,
  }),
};
