import { ref } from 'vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import BaseTab from './BaseTab.vue'

const meta: Meta<typeof BaseTab> = {
  title: 'UI/BaseTab',
  component: BaseTab,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'underline', 'pill', 'card']
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end']
    },
    transition: {
      control: 'select',
      options: ['fade', 'slide-left', 'slide-up', 'none']
    },
    lazy: { control: 'boolean' },
    stacked: { control: 'boolean' }
  }
}

export default meta

// ✅ Basic usage
export const Basic: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('overview')
    const tabs = [
      { value: 'overview', label: 'Overview', content: 'Overview content goes here.' },
      { value: 'features', label: 'Features', content: 'Feature descriptions.' },
      { value: 'pricing', label: 'Pricing', content: 'Pricing details.' }
    ]
    return { active, tabs }
  },
  template: `<BaseTab v-model="active" :tabs="tabs" />`
})

// ✅ With Icons + Stacked layout
export const WithIcons: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('a')
    const tabs = [
      { value: 'a', label: 'Apple', icon: '🍎', content: 'Apples are red or green.' },
      { value: 'b', label: 'Banana', icon: '🍌', content: 'Bananas are yellow.' },
      { value: 'c', label: 'Cherry', icon: '🍒', content: 'Cherries are sweet.' }
    ]
    return { active, tabs }
  },
  template: `<BaseTab v-model="active" :tabs="tabs" stacked />`
})

// ✅ Label as component (VNode)
export const ComponentLabel: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('custom')
    const CustomLabel = { template: `<span style="color: var(--color-primary); font-weight: bold;">Custom</span>` }
    const tabs = [
      { value: 'home', label: 'Home', content: 'Home page content.' },
      { value: 'custom', label: CustomLabel, content: 'This label is a component.' }
    ]
    return { active, tabs }
  },
  template: `<BaseTab v-model="active" :tabs="tabs" />`
})

// ✅ Disabled tab
export const Disabled: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('1')
    const tabs = [
      { value: '1', label: 'Active', content: 'Enabled tab' },
      { value: '2', label: 'Disabled', content: 'This is disabled', disabled: true },
      { value: '3', label: 'Also Active', content: 'Enabled tab again' }
    ]
    return { active, tabs }
  },
  template: `<BaseTab v-model="active" :tabs="tabs" />`
})

// ✅ Lazy loading tabs
export const LazyLoading: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('x')
    const tabs = [
      { value: 'x', label: 'X', content: 'Eagerly loaded' },
      { value: 'y', label: 'Y', content: 'Lazy loaded tab content' },
      { value: 'z', label: 'Z', content: 'Another lazy tab' }
    ]
    return { active, tabs }
  },
  template: `<BaseTab v-model="active" :tabs="tabs" lazy />`
})

// ✅ Mixed content (prop + slot)
export const MixedContent: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('tab1')
    const tabs = [
      { value: 'tab1', label: 'Static', content: 'This is defined via props.' },
      { value: 'tab2', label: 'Slot' }
    ]
    return { active, tabs }
  },
  template: `
    <BaseTab v-model="active" :tabs="tabs">
      <template #tab-tab2>
        <div>
          <h4 style="margin-bottom: 0.5rem;">Dynamic Content</h4>
          <p>This tab content is defined in a named slot (#tab-tab2).</p>
        </div>
      </template>
    </BaseTab>`
})

// ✅ Variants (visual styles)
export const Variants: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const tabData = [
      { value: 'a', label: 'Alpha', content: 'Alpha content' },
      { value: 'b', label: 'Beta', content: 'Beta content' },
      { value: 'c', label: 'Gamma', content: 'Gamma content' }
    ]
    const v1 = ref('a')
    const v2 = ref('a')
    const v3 = ref('a')
    return { tabData, v1, v2, v3 }
  },
  template: `
    <div style="display: grid; gap: 2rem;">
      <BaseTab v-model="v1" variant="underline" :tabs="tabData" />
      <BaseTab v-model="v2" variant="pill" :tabs="tabData" />
      <BaseTab v-model="v3" variant="card" :tabs="tabData" />
    </div>`
})

// ✅ Transitions (fade / slide)
export const Transitions: StoryFn = (args) => ({
  components: { BaseTab },
  setup() {
    const active = ref('1')
    const tabs = [
      { value: '1', label: 'Tab 1', content: 'Content 1' },
      { value: '2', label: 'Tab 2', content: 'Content 2' }
    ]
    return { active, args, tabs }
  },
  template: `<BaseTab v-model="active" v-bind="args" :tabs="tabs" />`
})
Transitions.args = { transition: 'slide-left' }

// ✅ Alignment showcase
export const Alignment: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const tabs = [
      { value: '1', label: 'Left', content: 'Left aligned tab' },
      { value: '2', label: 'Middle', content: 'Centered tab' },
      { value: '3', label: 'Right', content: 'Right aligned tab' }
    ]
    const a = ref('1'), b = ref('1'), c = ref('1')
    return { tabs, a, b, c }
  },
  template: `
    <div style="display: grid; gap: 2rem;">
      <BaseTab v-model="a" align="start" :tabs="tabs" />
      <BaseTab v-model="b" align="center" :tabs="tabs" />
      <BaseTab v-model="c" align="end" :tabs="tabs" />
    </div>`
})

// ✅ Dark Theme
export const DarkTheme: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('1')
    const tabs = [
      { value: '1', label: 'One', content: 'Dark mode tab one' },
      { value: '2', label: 'Two', content: 'Dark mode tab two' }
    ]
    return { active, tabs }
  },
  template: `
    <div data-theme="dark" style="padding: 1rem; background: var(--color-background);">
      <BaseTab v-model="active" :tabs="tabs" />
    </div>`
})

// ✅ Long list (scrollable horizontal)
export const ScrollableTabs: StoryFn = () => ({
  components: { BaseTab },
  setup() {
    const active = ref('1')
    const tabs = Array.from({ length: 20 }, (_, i) => ({
      value: String(i + 1),
      label: `Tab ${i + 1}`,
      content: `Content of Tab ${i + 1}`
    }))
    return { active, tabs }
  },
  template: `<BaseTab v-model="active" :tabs="tabs" />`
})
