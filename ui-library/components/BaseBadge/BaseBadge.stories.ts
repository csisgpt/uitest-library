import BaseBadge from './BaseBadge.vue';
import type { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'Components/BaseBadge',
  component: BaseBadge,
  argTypes: {
    color: { control: { type: 'select' }, options: ['primary','success','error','warning','info','neutral'] },
    variant: { control: { type: 'select' }, options: ['solid','soft','outline'] },
    size: { control: { type: 'select' }, options: ['sm','md','lg'] },
    rounded: { control: { type: 'select' }, options: ['sm','md','full'] },
    dot: { control: 'boolean' },
    positioned: { control: 'boolean' },
    text: { control: 'text' },
  },
} satisfies Meta<typeof BaseBadge>;

const Template: StoryFn<typeof BaseBadge> = (args) => ({
  components: { BaseBadge },
  setup: () => ({ args }),
  template: `<BaseBadge v-bind="args" />`,
});

export const Default = Template.bind({});
Default.args = {
  text: '9',
  color: 'primary',
  variant: 'solid',
};

export const Dot = Template.bind({});
Dot.args = {
  dot: true,
  color: 'success',
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
  data: () => ({ colors: ['primary','success','error','warning','info','neutral'] }),
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

export const PositionedOverIcon = () => ({
  components: { BaseBadge },
  template: `
    <div style="position:relative; display:inline-block;">
      <span style="font-size:2rem;">🔔</span>
      <BaseBadge text="3" positioned />
    </div>
  `,
});
