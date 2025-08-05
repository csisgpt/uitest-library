<template>
  <span ref="wrapper" :class="$style.wrapper">
    <slot name="activator" :on="listeners" :attrs="activatorAttrs" />
    <transition :name="transitionName">
      <div
        v-show="isVisible"
        :id="tooltipId"
        role="tooltip"
        :class="[$style.tooltip, $style[`position-${props.position}`], { [$style.isVisible]: isVisible }]"
        :style="tooltipStyle"
      >
        <slot v-if="$slots.default" />
        <span v-else>{{ props.text }}</span>
        <span :class="$style.arrow"></span>
      </div>
    </transition>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    trigger?: 'hover' | 'click' | 'focus' | 'manual'
    delay?: number
    disabled?: boolean
    persistent?: boolean
    offset?: number
    animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'none'
    id?: string
    open?: boolean
    closeOnClickOutside?: boolean
    zIndex?: number
  }>(),
  {
    position: 'top',
    trigger: 'hover',
    delay: 0,
    disabled: false,
    persistent: false,
    offset: 8,
    animation: 'fade',
    closeOnClickOutside: true,
  }
)

const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const wrapper = ref<HTMLElement | null>(null)
const activator = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const delayTimeout = ref<number>()

const uid = Math.random().toString(36).slice(2)
const generatedId = `base-tooltip-${uid}`
const tooltipId = computed(() => props.id ?? generatedId)

const transitionName = computed(() => {
  switch (props.animation) {
    case 'fade':
      return 'fade'
    case 'scale':
      return 'scale'
    case 'slide-up':
      return 'slide-top'
    case 'slide-down':
      return 'slide-bottom'
    default:
      return ''
  }
})

const tooltipStyle = computed(() => ({
  '--tooltip-offset': `${props.offset}px`,
  ...(props.zIndex !== undefined ? { '--tooltip-z-index': String(props.zIndex) } : {}),
}))

function show() {
  if (props.disabled) return
  clearTimeout(delayTimeout.value)
  if (props.delay && props.delay > 0) {
    delayTimeout.value = window.setTimeout(() => {
      isVisible.value = true
      emit('update:open', true)
    }, props.delay)
  } else {
    isVisible.value = true
    emit('update:open', true)
  }
}

function hide() {
  clearTimeout(delayTimeout.value)
  if (props.persistent) return
  isVisible.value = false
  emit('update:open', false)
}

function toggle() {
  isVisible.value ? hide() : show()
}

const listeners = computed(() => {
  if (props.trigger === 'manual') return {}
  if (props.trigger === 'click') {
    return { click: toggle }
  }
  if (props.trigger === 'focus') {
    return { focus: show, blur: hide }
  }
  return { mouseenter: show, mouseleave: hide, focus: show, blur: hide }
})

const activatorAttrs = computed(() => ({
  'aria-describedby': tooltipId.value,
  ref: activator,
}))

function onClickOutside(e: MouseEvent) {
  if (!wrapper.value?.contains(e.target as Node)) {
    hide()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    hide()
  }
}

watch(isVisible, val => {
  if (val) {
    if (props.closeOnClickOutside && !props.persistent) {
      document.addEventListener('mousedown', onClickOutside)
    }
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('mousedown', onClickOutside)
    document.removeEventListener('keydown', onKeydown)
  }
})

watch(
  () => props.open,
  val => {
    if (props.trigger === 'manual') {
      if (val) show()
      else hide()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style module src="./BaseTooltip.module.css"></style>
