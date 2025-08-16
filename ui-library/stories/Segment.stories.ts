import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { BaseSegment, BaseSegmentButton, BaseSegmentContent, BaseSegmentView } from '../components/segment';

const meta: Meta<typeof BaseSegment> = {
  title: 'Components/Segment',
  component: BaseSegment,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'info', 'error', 'outline', 'ghost'] },
    shape: { control: 'select', options: ['pill', 'rounded'] },
    mode: { control: 'select', options: ['ios', 'md'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    scrollable: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof BaseSegment>;

export const Basic: Story = {
  render: args => ({
    components: { BaseSegment, BaseSegmentButton },
    setup() {
      const value = ref(args.multiple ? [] : null);
      return { args, value };
    },
    template: `
      <BaseSegment v-bind="args" v-model="value">
        <BaseSegmentButton value="one" label="One" />
        <BaseSegmentButton value="two" label="Two" />
        <BaseSegmentButton value="three" label="Three" />
      </BaseSegment>
    `,
  }),
  args: {
    size: 'md',
    variant: 'primary',
    shape: 'pill',
    mode: 'md',
    scrollable: false,
    fullWidth: false,
    disabled: false,
    readonly: false,
    multiple: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = await canvas.findByRole('radio', { name: 'One' });
    await first.focus();
    await userEvent.keyboard('{arrowright}');
    const second = await canvas.findByRole('radio', { name: 'Two' });
    expect(second).toHaveFocus();
  },
};

export const View: StoryObj<typeof BaseSegmentView> = {
  render: args => ({
    components: { BaseSegmentView, BaseSegmentContent },
    setup() {
      const value = ref(args.multiple ? [] : null);
      const items = [
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
        { label: 'Three', value: 'three' },
      ];
      return { args, value, items };
    },
    template: `
      <BaseSegmentView v-bind="args" v-model="value" :items="items">
        <BaseSegmentContent value="one">First content</BaseSegmentContent>
        <BaseSegmentContent value="two">Second content</BaseSegmentContent>
        <BaseSegmentContent value="three">Third content</BaseSegmentContent>
      </BaseSegmentView>
    `,
  }),
  args: {
    size: 'md',
    variant: 'primary',
    shape: 'pill',
    mode: 'md',
  },
};
