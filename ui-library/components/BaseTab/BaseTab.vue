<template>
  <div :class="$style.tabWrapper">
    <slot name="prefix" />

    <!-- Tab Buttons -->
    <div
      v-if="!$slots.tabs"
      :class="[
        $style.tabList,
        variant !== 'default' && $style[`variant-${variant}`],
        $style[`align-${align}`]
      ]"
      role="tablist"
    >
      <button
        v-for="(tab, idx) in computedTabs"
        :key="tab.value"
        :ref="el => tabRefs[idx] = el as HTMLButtonElement"
        :class="[
          $style.tabItem,
          tabClass,
          {
            [$style['tabItem--active']]: isActive(tab.value),
            [$style['tabItem--disabled']]: tab.disabled,
            [$style.stacked]: stacked
          }
        ]"
        role="tab"
        :tabindex="tab.disabled ? -1 : isActive(tab.value) ? 0 : -1"
        :aria-selected="isActive(tab.value)"
        :disabled="tab.disabled"
        @click="() => !tab.disabled && setActive(tab.value)"
        @keydown="e => onKeydown(e, idx)"
      >
        <!-- Icon -->
        <span v-if="tab.icon" :class="$style.tabIcon" aria-hidden="true">{{ tab.icon }}</span>

        <!-- Label (text or component) -->
        <span
          v-if="typeof tab.label === 'string' || typeof tab.label === 'number'"
          :title="String(tab.label)"
        >
          {{ tab.label }}
        </span>
        <component
          v-else-if="isComponent(tab.label)"
          :is="tab.label"
        />
      </button>
    </div>

    <!-- Custom tab buttons via slot -->
    <slot
      v-else
      name="tabs"
      :tabs="computedTabs"
      :active="active"
      :select="setActive"
    />

    <slot name="suffix" />

    <!-- Tab Content -->
    <Transition mode="out-in" :name="transitionName">
      <div
        v-if="currentTab && shouldRender(currentTab.value)"
        :key="currentTab.value"
        :class="[$style.tabContent, contentClass]"
        role="tabpanel"
      >
        <!-- Content as component -->
        <component
          v-if="isComponent(currentTab.content)"
          :is="currentTab.content"
        />

        <!-- Content as string/number -->
        <div v-else-if="typeof currentTab.content === 'string' || typeof currentTab.content === 'number'">
          {{ currentTab.content }}
        </div>

        <!-- Content via slot -->
        <slot v-else :name="`tab-${currentTab.value}`" />
      </div>
    </Transition>

    <!-- Fallback for no tab -->
    <slot v-if="!currentTab" name="default" />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  useSlots,
  Transition
} from 'vue'

export interface TabItem {
  value: string | number
  label?: string | number | any
  icon?: string
  disabled?: boolean
  content?: string | number | any
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    tabs?: TabItem[]
    variant?: 'default' | 'underline' | 'pill' | 'card'
    align?: 'start' | 'center' | 'end'
    lazy?: boolean
    transition?: 'fade' | 'slide-left' | 'slide-up' | 'none'
    tabClass?: string
    contentClass?: string
    stacked?: boolean
  }>(),
  {
    variant: 'default',
    align: 'start',
    lazy: false,
    transition: 'fade',
    stacked: false
  }
)

const emit = defineEmits<{ 'update:modelValue': [string | number] }>()
const slots = useSlots()

const computedTabs = computed<TabItem[]>(() => {
  if (props.tabs?.length) return props.tabs
  return Object.keys(slots)
    .filter(k => k.startsWith('tab-'))
    .map(k => ({ value: k.slice(4), label: k.slice(4) }))
})

const active = computed({
  get: () => props.modelValue ?? computedTabs.value[0]?.value,
  set: v => emit('update:modelValue', v)
})

const tabRefs = ref<HTMLButtonElement[]>([])

function setActive(v: string | number) {
  active.value = v
}

function isActive(v: string | number) {
  return active.value === v
}

function isComponent(val: unknown): boolean {
  return typeof val === 'object' || typeof val === 'function'
}

function onKeydown(e: KeyboardEvent, idx: number) {
  const enabled = computedTabs.value.filter(t => !t.disabled)
  const currentIdx = enabled.findIndex(t => t.value === computedTabs.value[idx].value)

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      setActive(enabled[(currentIdx + 1) % enabled.length].value)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      setActive(enabled[(currentIdx - 1 + enabled.length) % enabled.length].value)
      break
    case 'Home':
      e.preventDefault()
      setActive(enabled[0].value)
      break
    case 'End':
      e.preventDefault()
      setActive(enabled[enabled.length - 1].value)
      break
  }
}

const rendered = ref<Set<string | number>>(new Set())

function shouldRender(v: string | number) {
  return !props.lazy || rendered.value.has(v)
}

watch(
  active,
  v => {
    nextTick(() => {
      const i = computedTabs.value.findIndex(t => t.value === v)
      if (i !== -1) tabRefs.value[i]?.focus()
      if (props.lazy) rendered.value.add(v)
    })
  },
  { immediate: true }
)

onMounted(() => {
  if (props.lazy && active.value != null) rendered.value.add(active.value)
})

const currentTab = computed(() =>
  computedTabs.value.find(t => t.value === active.value)
)

const transitionName = computed(() => {
  if (props.transition === 'none') return ''
  if (props.transition === 'slide-up') return 'slide-top'
  return props.transition
})
</script>

<style module src="./BaseTab.module.css">
/* Standardized states */
:focus-visible{outline:none;box-shadow:0 0 0 var(--focus-ring-offset) var(--color-background),0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);}
*{transition:background var(--transition-base),color var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base);}</style>
