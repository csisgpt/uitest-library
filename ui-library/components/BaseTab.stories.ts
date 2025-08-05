import { ref } from 'vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import BaseTab from './BaseTab.vue'

const meta: Meta<typeof BaseTab> = {
  title: 'Navigation/BaseTab',
  component: BaseTab
}
export default meta

// 1. Basic usage
export const Basic: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('one')
    return { active }
  },
  template: `<BaseTab v-model="active" :tabs="[
    { value: 'one', label: 'One', content: 'First' },
    { value: 'two', label: 'Two', content: 'Second' },
    { value: 'three', label: 'Three', content: 'Third' }
  ]" />`
})

// 2. Icon + label tabs with stacked option
export const IconTabs: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('a')
    return { active }
  },
  template: `<BaseTab v-model="active" stacked :tabs="[
    { value: 'a', label: 'Apple', icon: '🍎', content: 'Apple' },
    { value: 'b', label: 'Banana', icon: '🍌', content: 'Banana' },
    { value: 'c', label: 'Cherry', icon: '🍒', content: 'Cherry' }
  ]" />`
})

// 3. Label as component (VNode)
export const ComponentLabel: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('profile')
    const Label = { template: '<span style="color:var(--color-primary)"><b>Profile</b></span>' }
    return { active, Label }
  },
  template: `<BaseTab v-model="active" :tabs="[
    { value: 'home', label: 'Home', content: 'Home' },
    { value: 'profile', label: Label, content: 'Profile content' }
  ]" />`
})

// 4. Disabled tab
export const Disabled: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('one')
    return { active }
  },
  template: `<BaseTab v-model="active" :tabs="[
    { value: 'one', label: 'One', content: 'Enabled' },
    { value: 'two', label: 'Two', disabled: true, content: 'Disabled' },
    { value: 'three', label: 'Three', content: 'Enabled' }
  ]" />`
})

// 5. Lazy loading content
export const LazyLoading: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('a')
    return { active }
  },
  template: `<BaseTab v-model="active" lazy :tabs="[
    { value: 'a', label: 'A', content: 'Content A' },
    { value: 'b', label: 'B', content: 'Content B' },
    { value: 'c', label: 'C', content: 'Content C' }
  ]" />`
})

// 6. Prop-based + slot-based mix
export const MixedContent: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('a')
    return { active }
  },
  template: `<BaseTab v-model="active" :tabs="[
    { value: 'a', label: 'Tab A', content: 'Prop content A' },
    { value: 'b', label: 'Tab B' }
  ]">
    <template #tab-b>Slotted content B</template>
  </BaseTab>`
})

// 7. Variants
export const Variants: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active1 = ref('one')
    const active2 = ref('one')
    const active3 = ref('one')
    const tabs = [
      { value: 'one', label: 'One', content: 'One' },
      { value: 'two', label: 'Two', content: 'Two' },
      { value: 'three', label: 'Three', content: 'Three' }
    ]
    return { active1, active2, active3, tabs }
  },
  template: `<div>
    <BaseTab v-model="active1" variant="underline" :tabs="tabs" />
    <BaseTab v-model="active2" variant="pill" :tabs="tabs" />
    <BaseTab v-model="active3" variant="card" :tabs="tabs" />
  </div>`
})

// 8. Transition types
export const Transitions: StoryFn = (args) => ({
  components: { BaseTab },
  setup() {
    const active = ref('one')
    return { active, args }
  },
  template: `<BaseTab v-model="active" v-bind="args" :tabs="[
    { value: 'one', label: 'One', content: 'One' },
    { value: 'two', label: 'Two', content: 'Two' }
  ]" />`
})
Transitions.argTypes = { transition: { control: 'select', options: ['fade','slide-left','slide-up','none'] } }
Transitions.args = { transition: 'fade' }

// 9. Dark theme
export const DarkTheme: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('one')
    return { active }
  },
  template: `<div data-theme="dark" style="padding:1rem;background:var(--color-background);">
    <BaseTab v-model="active" :tabs="[
      { value: 'one', label: 'One', content: 'One' },
      { value: 'two', label: 'Two', content: 'Two' }
    ]" />
  </div>`
})

// 10. Long list (scrollable)
export const LongList: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('1')
    const tabs = Array.from({ length: 15 }, (_, i) => ({
      value: String(i + 1),
      label: `Tab ${i + 1}`,
      content: `Content ${i + 1}`
    }))
    return { active, tabs }
  },
  template: `<BaseTab v-model="active" :tabs="tabs" />`
})
