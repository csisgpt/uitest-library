import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BaseSpeedDial from '../components/BaseSpeedDial/BaseSpeedDial.vue';

type SpeedDialMeta = Meta<typeof BaseSpeedDial>;

const meta: SpeedDialMeta = {
  title: 'Components/BaseSpeedDial',
  component: BaseSpeedDial,
  tags: ['autodocs'],
  args: {
    model: [
      { icon: '✏️', tooltip: 'Edit' },
      { icon: '❌', tooltip: 'Delete' },
      { icon: '⭐', tooltip: 'Star' },
    ],
    icon: '+',
  },
  argTypes: {
    direction: { control: 'select', options: ['up', 'down', 'left', 'right'] },
    type: { control: 'select', options: ['linear', 'circle'] },
    position: { control: 'text' },
    transition: { control: 'boolean' },
    tooltip: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LinearUp: Story = {
  args: {
    type: 'linear',
    direction: 'up',
  },
};

export const LinearDown: Story = {
  args: {
    type: 'linear',
    direction: 'down',
    position: 'top-right',
  },
};

export const WithTooltips: Story = {
  args: {
    tooltip: true,
  },
};

export const NoTransition: Story = {
  args: {
    transition: false,
  },
};

export const Positions: Story = {
  render: (args) => ({
    components: { BaseSpeedDial },
    setup() {
      return { args };
    },
    template: `
      <div>
        <BaseSpeedDial v-bind="args" position="top-left" />
        <BaseSpeedDial v-bind="args" position="top-right" />
        <BaseSpeedDial v-bind="args" position="bottom-left" />
        <BaseSpeedDial v-bind="args" position="bottom-right" />
      </div>
    `,
  }),
};
