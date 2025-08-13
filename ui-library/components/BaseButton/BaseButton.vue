<script setup lang="ts">
import { computed, useSlots } from 'vue'
import styles from './BaseButton.module.css'

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link' | 'text'
export type ButtonTone = 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'neutral'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'rounded' | 'pill' | 'square' | 'circle'

interface Props {
  variant?: ButtonVariant
  tone?: ButtonTone
  size?: ButtonSize
  shape?: ButtonShape
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  disabled?: boolean
  loading?: boolean
  iconOnly?: boolean
  elevation?: 'none' | 'sm' | 'md' | 'lg'
  ripple?: boolean
  ariaLabel?: string
  href?: string
  target?: string
  rel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  tone: 'primary',
  size: 'md',
  shape: 'rounded',
  type: 'button',
  block: false,
  disabled: false,
  loading: false,
  iconOnly: false,
  elevation: 'sm',
  ripple: true,
  ariaLabel: undefined,
  href: undefined,
  target: undefined,
  rel: undefined,
})

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()
const slots = useSlots()

const isDisabled = computed(() => props.disabled || props.loading)
const Tag = computed(() => (props.href ? 'a' : 'button'))

function onClick(e: MouseEvent) {
  if (isDisabled.value) {
    e.preventDefault()
    return
  }
  emit('click', e)
}

function onPointerDown(e: PointerEvent) {
  if (!props.ripple || isDisabled.value) return
  const el = e.currentTarget as HTMLElement
  if (!el) return
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 1.2
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2
  const ripple = document.createElement('span')
  ripple.className = styles.ripple
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  el.appendChild(ripple)
  ripple.addEventListener('animationend', () => ripple.remove())
}

const labelIsEmpty = computed(() => !slots.default)
const computedAriaLabel = computed(() => props.ariaLabel || (props.iconOnly ? 'button' : undefined))

const cls = computed(() => [
  styles.button,
  styles[`variant-${props.variant}`],
  styles[`tone-${props.tone}`],
  styles[`size-${props.size}`],
  styles[`shape-${props.shape}`],
  styles[`elev-${props.elevation}`],
  props.block && styles.block,
  props.iconOnly && styles.iconOnly,
  isDisabled.value && styles.isDisabled,
  props.loading && styles.isLoading,
])
</script>

<template>
  <component
    :is="Tag"
    :type="!href ? type : undefined"
    :href="href"
    :target="target"
    :rel="rel"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="computedAriaLabel"
    :tabindex="isDisabled ? -1 : 0"
    role="button"
    :class="cls"
    @click="onClick"
    @pointerdown="onPointerDown"
  >
    <span v-if="$slots.prefix" :class="styles.prefix" aria-hidden="true">
      <slot name="prefix" />
    </span>

    <span :class="styles.label">
      <slot />
    </span>

    <span v-if="$slots.suffix" :class="styles.suffix" aria-hidden="true">
      <slot name="suffix" />
    </span>

    <span v-if="loading" :class="styles.spinner" aria-hidden="true" />
  </component>
</template>