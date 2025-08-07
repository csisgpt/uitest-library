import BaseButton from "./BaseButton.vue";
import type { Meta, StoryFn } from "@storybook/vue3";

export default {
  title: "Components/BaseButton",
  component: BaseButton,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "success",
        "error",
        "warning",
        "info",
      ],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    type: { control: "select", options: ["button", "submit", "reset"] },
    as: { control: "text" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    block: { control: "boolean" },
    rounded: { control: "boolean" },
    fullWidth: { control: "boolean" },
    text: { control: "boolean" },
    icon: { control: "boolean" },
  },
} satisfies Meta<typeof BaseButton>;

const Template: StoryFn<typeof BaseButton> = (args) => ({
  components: { BaseButton },
  setup: () => ({ args }),
  template: `<BaseButton v-bind="args">کلیک کن</BaseButton>`,
});

export const Default = Template.bind({});
Default.args = {
  variant: "primary",
  size: "md",
};

export const AllVariants = () => ({
  components: { BaseButton },
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.5rem">
      <BaseButton variant="primary">Primary</BaseButton>
      <BaseButton variant="secondary">Secondary</BaseButton>
      <BaseButton variant="outline">Outline</BaseButton>
      <BaseButton variant="ghost">Ghost</BaseButton>
      <BaseButton variant="success">Success</BaseButton>
      <BaseButton variant="error">Error</BaseButton>
      <BaseButton variant="warning">Warning</BaseButton>
      <BaseButton variant="info">Info</BaseButton>
    </div>
  `,
});

export const Sizes = () => ({
  components: { BaseButton },
  template: `
    <div style="display: flex; gap: 1rem;">
      <BaseButton size="sm">Small</BaseButton>
      <BaseButton size="md">Medium</BaseButton>
      <BaseButton size="lg">Large</BaseButton>
    </div>
  `,
});

export const Loading = Template.bind({});
Loading.args = {
  variant: "primary",
  loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  variant: "primary",
  disabled: true,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  variant: "primary",
  fullWidth: true,
};

export const Rounded = Template.bind({});
Rounded.args = {
  variant: "primary",
  rounded: true,
};

export const IconOnly = () => ({
  components: { BaseButton },
  template: `
    <BaseButton icon rounded variant="primary">
      <div>
        🔥
      </div>
    </BaseButton>
  `,
});

export const WithPrependAppend = () => ({
  components: { BaseButton },
  template: `
    <BaseButton variant="primary">
      <template #prepend>
        <span style="margin-inline-end: 0.5rem;">🔥</span>
      </template>
      Click me
      <template #append>
        <span style="margin-inline-start: 0.5rem;">👉</span>
      </template>
    </BaseButton>
  `,
});
