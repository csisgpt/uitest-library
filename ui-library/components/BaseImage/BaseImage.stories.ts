import BaseImage from "./BaseImage.vue";
import type { Meta, StoryFn } from "@storybook/vue3";

export default {
  title: "Components/BaseImage",
  component: BaseImage,
  argTypes: {
    fit: {
      control: { type: "select" },
      options: ["cover", "contain", "fill", "none", "scale-down"],
    },
    radius: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg", "full"],
    },
    lazy: { control: "boolean" },
    loadingIndicator: { control: "boolean" },
    transition: { control: "boolean" },
    aspectRatio: { control: "text" },
    objectPosition: { control: "text" },
  },
} satisfies Meta<typeof BaseImage>;

const Template: StoryFn<typeof BaseImage> = (args) => ({
  components: { BaseImage },
  setup: () => ({ args }),
  template: '<BaseImage v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  src: "https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp",
  alt: "Placeholder image",
};

export const PlaceholderAndLoading = Template.bind({});
PlaceholderAndLoading.args = {
  src: "https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp",
  placeholder: "https://via.placeholder.com/60x40?text=...",
  loadingIndicator: true,
  alt: "Image with placeholder",
};

export const FallbackOnError: StoryFn<typeof BaseImage> = () => ({
  components: { BaseImage },
  template:
    '<BaseImage src="/broken-link.jpg" fallback="https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp?text=fallback" alt="broken" />',
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
        :src="'https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp'"
        :radius="r"
        :width="100"
        :height="100"
        :alt="r"
      />
    </div>
  `,
});

export const WithAspectRatio = () => ({
  components: { BaseImage },
  template: `
    <div style="display: flex; gap: 1.5rem" >
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <BaseImage
            v-for="r in ['none','sm','md','lg','full']"
            :key="r"
            :src="'https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp'"
            :radius="r"
            :width="100"
            :aspectRatio="'16/9'"
            :alt="r"
          />
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <BaseImage
            v-for="r in ['none','sm','md','lg','full']"
            :key="r"
            :src="'https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp'"
            :radius="r"
            :width="100"
            :aspectRatio="'1/1'"
            :alt="r"
            />
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <BaseImage
            v-for="r in ['none','sm','md','lg','full']"
            :key="r"
            :src="'https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp'"
            :radius="r"
            :width="100"
            :aspectRatio="'1/2'"
            :alt="r"
            />
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <BaseImage
            v-for="r in ['none','sm','md','lg','full']"
            :key="r"
            :src="'https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp'"
            :radius="r"
            :width="100"
            :aspectRatio="'2/1'"
            :alt="r"
            />
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <BaseImage
            v-for="r in ['none','sm','md','lg','full']"
            :key="r"
            :src="'https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp'"
            :radius="r"
            :height="100"
            :aspectRatio="'2/1'"
            :alt="r"
            />
        </div>
      </div>

  `,
});

// export const WithAspectRatio = Template.bind({});
// WithAspectRatio.args = {
//   src: 'https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp',
//   aspectRatio: '1/1',
//   transition: true,
//   alt: 'Aspect ratio image',
// };

export const LazyLoad = Template.bind({});
LazyLoad.args = {
  src: "https://api.backlinko.com/app/uploads/2024/07/reverse-image-search-blog-post-image.webp",
  lazy: true,
  alt: "Lazy loaded image",
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
