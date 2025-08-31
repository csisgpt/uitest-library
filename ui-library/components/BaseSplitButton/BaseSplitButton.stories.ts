import type { Meta, StoryObj } from "@storybook/vue3";
import { ref, reactive } from "vue";
import BaseSplitButton from "./BaseSplitButton.vue";

const defaultModel = [
  {
    label: "New File",
    icon: "pi pi-file",
    command: ({ item }: any) => console.log("command", item),
  },
  {
    label: "Open…",
    icon: "pi pi-folder-open",
    command: ({ item }: any) => console.log("command", item),
  },
  { separator: true },
  {
    label: "Share",
    icon: "pi pi-share-alt",
    command: ({ item }: any) => console.log("command", item),
  },
  {
    label: "Download",
    icon: "pi pi-download",
    url: "https://example.com/file.zip",
    target: "_blank",
  },
  { separator: true },
  {
    label: "Delete",
    icon: "pi pi-trash",
    class: "text-danger",
    command: ({ item }: any) => console.log("command", item),
  },
];

const meta: Meta<typeof BaseSplitButton> = {
  title: "UI/Split Button",
  component: BaseSplitButton,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    docs: {
      description: {
        component:
          "Split button with a primary action and a dropdown of secondary actions. Supports sizes, severities, styles (filled/outlined/text/plain), raised/rounded, loading, disabled, RTL, custom items, separators and keyboard navigation.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    icon: { control: "text" },
    model: { control: "object" },
    disabled: { control: "boolean" },
    autoZIndex: { control: "boolean" },
    baseZIndex: { control: "number" },
    appendTo: { control: "text" },
    dropdownIcon: { control: "text" },
    loading: { control: "boolean" },
    loadingIcon: { control: "text" },
    severity: {
      options: [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "help",
        "danger",
      ],
      control: { type: "select" },
    },
    raised: { control: "boolean" },
    rounded: { control: "boolean" },
    text: { control: "boolean" },
    outlined: { control: "boolean" },
    size: { options: [null, "small", "large"], control: { type: "radio" } },
    plain: { control: "boolean" },
    // events
    click: { action: "click (primary)", table: { category: "events" } },
    "dropdown-click": {
      action: "dropdown-click",
      table: { category: "events" },
    },
  },
  args: {
    label: "Primary",
    icon: "pi pi-check",
    model: defaultModel,
    severity: "primary",
    size: null,
    outlined: false,
    text: false,
    plain: false,
    raised: false,
    rounded: false,
    disabled: false,
    loading: false,
  },
};
export default meta;

export type Story = StoryObj<typeof BaseSplitButton>;

export const Playground: Story = {
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      const last = ref<string | null>(null);
      const onCmd = (label: string) => (last.value = label);
      const model = reactive(
        (args.model || []).map((m: any) =>
          m.separator
            ? m
            : {
                ...m,
                command: ({ item }: any) => onCmd(item.label),
              }
        )
      );
      return { args, last, model };
    },
    template: `
      <div style="display:grid; gap:12px; min-width: 360px;">
        <BaseSplitButton v-bind="{...args, model}" />
        <div style="opacity:.7; font: 12px/1.4 ui-sans-serif,system-ui;">
          Last command: <code>{{ last ?? '—' }}</code>
        </div>
      </div>
    `,
  }),
};

export const SeveritiesFilled: Story = {
  name: "Severities (Filled)",
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      const severities = [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "help",
        "danger",
      ] as const;
      return { args, severities };
    },
    template: `
      <div style="display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); min-width: 680px;">
        <BaseSplitButton v-for="sev in severities" :key="sev" v-bind="args" :severity="sev" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
        <BaseSplitButton v-bind="args" size="small" />
        <BaseSplitButton v-bind="args" />
        <BaseSplitButton v-bind="args" size="large" />
      </div>
    `,
  }),
};

export const Outlined: Story = {
  args: { outlined: true, model: defaultModel },

  render: SeveritiesFilled.render,
};

export const TextStyle: Story = {
  args: { text: true, icon: "pi pi-bolt" },
  render: SeveritiesFilled.render,
};

export const PlainStyle: Story = {
  args: { plain: true, icon: "pi pi-bolt", severity: "secondary" },
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      const severities = [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "help",
        "danger",
      ] as const;
      return { args, severities };
    },
    template: `
      <div style="padding:12px; background: var(--color-surface); border:1px solid var(--color-border); border-radius:12px;">
        <div style="display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); min-width: 680px;">
          <BaseSplitButton v-for="sev in severities" :key="sev" v-bind="args" :severity="sev" />
        </div>
      </div>
    `,
  }),
};

export const RaisedAndRounded: Story = {
  args: { raised: true, rounded: true },
  render: Sizes.render,
};

export const Loading: Story = {
  args: {
    loading: true,
    icon: "pi pi-spinner pi-spin",
    label: "Loading…",
    model: defaultModel,
  },
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      return { args };
    },
    template: `<BaseSplitButton v-bind="args" />`,
  }),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      return { args };
    },
    template: `<BaseSplitButton v-bind="args" />`,
  }),
};

export const IconOnlyPrimary: Story = {
  name: "Icon-only (no label)",
  args: { label: "", icon: "pi pi-play" },
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      return { args };
    },
    template: `<BaseSplitButton v-bind="args" />`,
  }),
};

export const CustomDropdownIcon: Story = {
  args: { dropdownIcon: "pi pi-ellipsis-v" },
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      return { args };
    },
    template: `<BaseSplitButton v-bind="args" />`,
  }),
};

export const WithSeparatorsAndLinks: Story = {
  name: "Menu: separators, disabled, links",
  args: {
    model: [
      { label: "Rename", icon: "pi pi-pencil" },
      { label: "Duplicate", icon: "pi pi-copy" },
      { separator: true },
      {
        label: "Docs",
        icon: "pi pi-external-link",
        url: "https://example.com",
        target: "_blank",
      },
      { label: "Disabled", icon: "pi pi-lock", disabled: true },
      { separator: true },
      { label: "Delete", icon: "pi pi-trash", class: "text-danger" },
    ],
  },
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      return { args };
    },
    template: `<BaseSplitButton v-bind="args" />`,
  }),
};

export const CustomItemSlot: Story = {
  render: (args) => ({
    components: { BaseSplitButton },
    template: `
      <BaseSplitButton v-bind="args">
        <template #item="{ item }">
          <div style="display:flex; align-items:center; gap:8px; width:100%">
            <img v-if="item.avatar" :src="item.avatar" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover" />
            <i v-else-if="item.icon" :class="item.icon" />
            <span class="base-menuitem-text">{{ item.label }}</span>
            <small v-if="item.hint" style="opacity:.6; margin-inline-start:auto">{{ item.hint }}</small>
          </div>
        </template>
      </BaseSplitButton>
    `,
    setup() {
      const argsWithModel = {
        ...args,
        model: [
          {
            label: "Assign to Alice",
            avatar: "https://i.pravatar.cc/40?img=1",
            hint: "Owner",
          },
          { label: "Assign to Bob", avatar: "https://i.pravatar.cc/40?img=2" },
          { separator: true },
          { label: "Team Settings", icon: "pi pi-cog" },
        ],
      };
      return { args: argsWithModel };
    },
  }),
};

export const RTL: Story = {
  name: "RTL (Right‑to‑left)",
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      return { args };
    },
    template: `
      <div dir="rtl" style="min-width:320px;">
        <BaseSplitButton v-bind="args" />
      </div>
    `,
  }),
  args: { severity: "secondary", label: "عملیات" },
};

export const DarkContainer: Story = {
  name: "In dark container",
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      return { args };
    },
    template: `
      <div data-theme="dark" style="padding:16px; background:#111; color:#eee; border-radius:12px;">
        <BaseSplitButton v-bind="args" />
      </div>
    `,
  }),
  args: { severity: "success", raised: true },
};

export const GridShowcase: Story = {
  name: "Gallery (all severities × styles)",
  render: (args) => ({
    components: { BaseSplitButton },
    setup() {
      const severities = [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "help",
        "danger",
      ] as const;
      const styles = [
        { key: "filled", props: {} },
        { key: "outlined", props: { outlined: true } },
        { key: "text", props: { text: true } },
        { key: "plain", props: { plain: true } },
      ] as const;
      return { args, severities, styles };
    },
    template: `
      <div style="display:grid; gap:16px; min-width: 900px;">
        <div v-for="s in severities" :key="s" style="display:grid; gap:8px;">
          <h4 style="margin:0; font:600 13px/1.2 ui-sans-serif,system-ui; opacity:.8;">Severity: {{ s }}</h4>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:12px;">
            <div v-for="sty in styles" :key="sty.key" style="padding:12px; border:1px solid var(--color-border); border-radius:12px;">
              <div style="font:500 12px/1 ui-sans-serif,system-ui; opacity:.7; margin-bottom:8px; text-transform:capitalize;">Style: {{ sty.key }}</div>
              <BaseSplitButton :severity="s" v-bind="{...args, ...sty.props}" />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
