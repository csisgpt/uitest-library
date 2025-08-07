import BaseImage from './BaseImage.vue';
import type { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'Components/BaseImage',
  component: BaseImage,
  argTypes: {
    fit: { control: { type: 'select' }, options: ['cover', 'contain', 'fill', 'none', 'scale-down'] },
    radius: { control: { type: 'select' }, options: ['none', 'sm', 'md', 'lg', 'full'] },
    lazy: { control: 'boolean' },
    loadingIndicator: { control: 'boolean' },
    transition: { control: 'boolean' },
    aspectRatio: { control: 'text' },
    objectPosition: { control: 'text' },
  },
} satisfies Meta<typeof BaseImage>;

const Template: StoryFn<typeof BaseImage> = (args) => ({
  components: { BaseImage },
  setup: () => ({ args }),
  template: '<BaseImage v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  src: 'https://via.placeholder.com/600x400',
  alt: 'Placeholder image',
};

export const PlaceholderAndLoading = Template.bind({});
PlaceholderAndLoading.args = {
  src: 'https://via.placeholder.com/600x400',
  placeholder: 'https://via.placeholder.com/60x40?text=...',
  loadingIndicator: true,
  alt: 'Image with placeholder',
};

export const FallbackOnError: StoryFn<typeof BaseImage> = () => ({
  components: { BaseImage },
  template:
    '<BaseImage src="/broken-link.jpg" fallback="https://via.placeholder.com/600x400?text=fallback" alt="broken" />',
});

export const ObjectFitModes: StoryFn<typeof BaseImage> = () => ({
  components: { BaseImage },
  template: `
    <div style="display: flex; gap: 1rem;">
      <BaseImage
        v-for="fit in ['cover','contain','fill','none','scale-down']"
        :key="fit"
        :src="'https://via.placeholder.com/150x100'"
        :fit="fit"
        :width="150"
        :height="100"
        :alt="fit"
      />
    </div>
  `,
});

export const RadiusVariants: StoryFn<typeof BaseImage> = () => ({
  components: { BaseImage },
  template: `
    <div style="display: flex; gap: 1rem;">
      <BaseImage
        v-for="r in ['none','sm','md','lg','full']"
        :key="r"
        :src="'https://via.placeholder.com/150'"
        :radius="r"
        :width="100"
        :height="100"
        :alt="r"
      />
    </div>
  `,
});

export const WithAspectRatio = Template.bind({});
WithAspectRatio.args = {
  src: 'https://via.placeholder.com/800',
  aspectRatio: '16/9',
  transition: true,
  alt: 'Aspect ratio image',
};

export const LazyLoad = Template.bind({});
LazyLoad.args = {
  src: 'https://via.placeholder.com/600x400',
  lazy: true,
  alt: 'Lazy loaded image',
};

export const CustomSlots: StoryFn<typeof BaseImage> = () => ({
  components: { BaseImage },
  template: `
    <BaseImage src="/broken.jpg" alt="slot example" loading-indicator>
      <template #placeholder>
        <div style="padding:1rem; background:#eee;">Loading...</div>
      </template>
      <template #error>
        <div style="padding:1rem; background:#fcc;">Failed to load</div>
      </template>
    </BaseImage>
  `,
});
