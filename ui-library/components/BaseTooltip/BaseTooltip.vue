<template>
  <span ref="wrapper" :class="$style.wrapper">
    <!--
      فعال‌ساز (Activator) همچنان از اسلات میاد؛
      attrs و on رو طبق الگو بهش پاس می‌دیم تا در Storybook هم کنترل‌پذیر بمونه.
    -->
    <slot name="activator" :on="listeners" :attrs="activatorAttrs" />

    <!--
      توجه: نام ترنزیشن‌ها به صورت یکتا و global تعریف می‌شن تا با CSS Modules سازگار باشن
    -->
    <transition :name="transitionName" appear>
      <div
        v-show="isVisible"
        :id="tooltipId"
        role="tooltip"
        :aria-hidden="!isVisible"
        :class="[
          $style.tooltip,
          $style[`position-${effectivePosition}`],
          isVisible && $style.isVisible,
          props.interactive && $style.isInteractive,
        ]"
        :style="tooltipStyle"
      >
        <slot v-if="$slots.default" />
        <span v-else>{{ props.text }}</span>

        <span :class="$style.arrow" aria-hidden="true"></span>
      </div>
    </transition>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    text?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    trigger?: 'hover' | 'click' | 'focus' | 'manual'
    delay?: number              // تاخیر برای show
    hideDelay?: number          // تاخیر برای hide (جدید)
    disabled?: boolean
    persistent?: boolean
    offset?: number
    animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'none'
    id?: string
    open?: boolean
    closeOnClickOutside?: boolean
    zIndex?: number
    maxWidth?: string | number  // مثل 280، '18rem'، 'clamp(...)'
    interactive?: boolean       // اجازهٔ hover/click روی محتوای Tooltip
    flipOnOverflow?: boolean    // تلاش برای برگرداندن جهت در صورت کمبود فضا
  }>(),
  {
    position: 'top',
    trigger: 'hover',
    delay: 0,
    hideDelay: 60,
    disabled: false,
    persistent: false,
    offset: 8,
    animation: 'fade',
    closeOnClickOutside: true,
    interactive: false,
    flipOnOverflow: true,
  }
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'show'): void
  (e: 'hide'): void
}>()

const wrapper = ref<HTMLElement | null>(null)
const activator = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const delayTimeout = ref<number>()
const hideTimeout = ref<number>()

const uid = Math.random().toString(36).slice(2)
const generatedId = `base-tooltip-${uid}`
const tooltipId = computed(() => props.id ?? generatedId)

const transitionName = computed(() => {
  switch (props.animation) {
    case 'fade': return 'tooltip-fade'
    case 'scale': return 'tooltip-scale'
    case 'slide-up': return 'tooltip-slide-top'
    case 'slide-down': return 'tooltip-slide-bottom'
    default: return 'tooltip-none'
  }
})

const tooltipStyle = computed(() => {
  const style: Record<string, string> = {
    '--tooltip-offset': `${props.offset}px`,
  }
  if (props.zIndex !== undefined) style['--tooltip-z-index'] = String(props.zIndex)

  // پشتیبانی از maxWidth سفارشی (عدد => px)
  if (props.maxWidth !== undefined) {
    const v = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
    style['--tooltip-max-width'] = v
  }
  return style
})

function show() {
  if (props.disabled) return
  clearTimeout(hideTimeout.value)
  clearTimeout(delayTimeout.value)

  if (props.delay && props.delay > 0) {
    delayTimeout.value = window.setTimeout(commitShow, props.delay)
  } else {
    commitShow()
  }
}

function commitShow() {
  if (isVisible.value) return
  isVisible.value = true
  emit('update:open', true)
  emit('show')
  if (props.flipOnOverflow) nextTickFlip()
}

function hide(immediate = false) {
  clearTimeout(delayTimeout.value)
  if (props.persistent) return

  if (immediate || !props.hideDelay) {
    commitHide()
  } else {
    clearTimeout(hideTimeout.value)
    hideTimeout.value = window.setTimeout(commitHide, props.hideDelay)
  }
}

function commitHide() {
  if (!isVisible.value) return
  isVisible.value = false
  emit('update:open', false)
  emit('hide')
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
    return {
      focus: show,
      blur: () => hide(),
      keydown: (e: KeyboardEvent) => { if (e.key === 'Escape') hide(true) }
    }
  }
  // hover: همچنین فوکوس را هم پوشش بده
  return {
    mouseenter: show,
    mouseleave: () => hide(),
    focus: show,
    blur: () => hide(),
    keydown: (e: KeyboardEvent) => { if (e.key === 'Escape') hide(true) }
  }
})

const activatorAttrs = computed(() => ({
  'aria-describedby': tooltipId.value,
  ref: activator,
}))

function onClickOutside(e: MouseEvent) {
  if (!wrapper.value?.contains(e.target as Node)) hide()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') hide(true)
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
      else hide(true)
    }
  },
  { immediate: true }
)

/**
 * Flip ساده بر اساس فضای ویوپورت
 * بدون محاسبات پیچیدهٔ پاپر—سبک اما کاراست.
 */
const effectivePosition = ref(props.position)
function nextTickFlip() {
  requestAnimationFrame(() => {
    const tip = wrapper.value?.querySelector<HTMLElement>('[role="tooltip"]')
    const act = activator.value ?? wrapper.value
    if (!tip || !act) return

    const tipRect = tip.getBoundingClientRect()
    const actRect = act.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    let pos = props.position

    if (pos === 'top' && tipRect.top < 0) pos = 'bottom'
    else if (pos === 'bottom' && tipRect.bottom > vh) pos = 'top'
    else if (pos === 'left' && tipRect.left < 0) pos = 'right'
    else if (pos === 'right' && tipRect.right > vw) pos = 'left'

    effectivePosition.value = pos
  })
}

onMounted(() => {
  // اگر کاربر position رو عوض کنه در حین استفاده
  watch(() => props.position, (p) => { effectivePosition.value = p })
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style module src="./BaseTooltip.module.css"></style>
