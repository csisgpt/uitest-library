import BaseSplitButton from './BaseSplitButton.vue';
import type { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'Components/BaseSplitButton',
  component: BaseSplitButton,
  args: {
    label: 'Save',
    model: [
      { label: 'Update', command: () => console.log('update') },
      { label: 'Delete', command: () => console.log('delete') }
    ],
    color: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['primary','secondary','success','error','warning','info','outline','ghost']
    },
    size: { control: { type: 'select' }, options: ['sm','md','lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof BaseSplitButton>;

const Template: StoryFn<typeof BaseSplitButton> = (args) => ({
  components: { BaseSplitButton },
  setup: () => ({ args }),
  template: `<BaseSplitButton v-bind="args" @click="() => console.log('main')" />`,
});

export const Default = Template.bind({});

export const CustomItems: StoryFn<typeof BaseSplitButton> = (args) => ({
  components: { BaseSplitButton },
  setup: () => ({ args }),
  template: `
    <BaseSplitButton v-bind="args">
      <template #item="{ item }">
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <i v-if="item.icon" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </div>
      </template>
    </BaseSplitButton>
  `,
});
CustomItems.args = {
  model: [
    { label: 'Refresh', icon: 'fa fa-refresh', command: () => console.log('refresh') },
    { label: 'Settings', icon: 'fa fa-cog', command: () => console.log('settings') },
  ],
};

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };

export const Loading = Template.bind({});
Loading.args = { loading: true };
