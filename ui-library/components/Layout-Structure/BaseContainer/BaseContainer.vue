<template>
  <component
    :is="as"
    :class="containerClasses"
    :style="containerStyles"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import styles from './BaseContainer.module.css'

type SizeKey =
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  | 'full' | 'none'

type PadKey = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface BaseContainerProps {
  /** حداکثر عرض */
  maxWidth?: SizeKey
  /** فاصله افقی */
  paddingX?: PadKey
  /** فاصله عمودی */
  paddingY?: PadKey
  /** شورت‌کات برای هر دو محور */
  padding?: PadKey
  /** مرکز کردن کانتینر به صورت افقی */
  centered?: boolean
  /** بدون محدودیت max-width */
  fluid?: boolean
  /** شکست از محدودیت والد تا لبه‌های viewport */
  breakout?: boolean
  /** تگ HTML */
  as?: string
  /** مقدار سفارشی حداکثر عرض (مثل '68rem' یا '1024px') */
  customMaxWidth?: string
}

const props = withDefaults(defineProps<BaseContainerProps>(), {
  maxWidth: 'lg',
  paddingX: 'md',
  paddingY: 'none',
  padding: undefined,
  centered: true,
  fluid: false,
  breakout: false,
  as: 'div',
  customMaxWidth: undefined
})

defineOptions({ name: 'BaseContainer', inheritAttrs: false })

const containerClasses = computed(() => {
  const cls: string[] = [styles.container]

  // maxWidth
  if (props.customMaxWidth) {
    cls.push(styles['container--max-custom'])
  } else if (props.fluid || props.maxWidth === 'none') {
    cls.push(styles['container--fluid'])
  } else if (props.maxWidth) {
    const key = `container--max-${props.maxWidth}`
    const found = (styles as Record<string, string>)[key]
    if (found) cls.push(found)
  }

  // padding (prop padding اولویت دارد)
  const px = props.padding ?? props.paddingX
  const py = props.padding ?? props.paddingY

  if (px && px !== 'none') {
    const key = `container--padding-x-${px}`
    const found = (styles as Record<string, string>)[key]
    if (found) cls.push(found)
  } else if (px === 'none') {
    cls.push(styles['container--padding-x-none'])
  }

  if (py && py !== 'none') {
    const key = `container--padding-y-${py}`
    const found = (styles as Record<string, string>)[key]
    if (found) cls.push(found)
  } else if (py === 'none') {
    cls.push(styles['container--padding-y-none'])
  }

  if (props.centered) cls.push(styles['container--centered'])
  if (props.breakout) cls.push(styles['container--breakout'])

  return cls
})

const containerStyles = computed(() => {
  // اگر customMaxWidth دادند، CSS variable را روی خود ریشه‌ی کانتینر ست می‌کنیم
  return props.customMaxWidth
    ? { '--container-max-width': props.customMaxWidth } as Record<string, string>
    : undefined
})
</script>
