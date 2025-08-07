<script setup lang="ts">
import { computed } from 'vue'
import styles from './BaseLabel.module.css'

const props = withDefaults(
  defineProps<{
    for: string
    text: string
    required?: boolean
    error?: boolean
    hint?: string
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    align?: 'left' | 'right'
  }>(),
  {
    required: false,
    error: false,
    disabled: false,
    size: 'md',
    align: 'left'
  }
)

const wrapperClasses = computed(() => [styles.wrapper, styles[props.align]])

const labelClasses = computed(() => [
  styles.label,
  styles[props.size],
  props.error && styles.error,
  props.disabled && styles.disabled
])

const hintClasses = computed(() => [
  styles.hint,
  props.error && styles.error,
  props.disabled && styles.disabled
])

const direction = computed(() => (props.align === 'right' ? 'rtl' : 'ltr'))
const hintId = computed(() => (props.hint ? `${props.for}-hint` : undefined))
</script>

<template>
  <div :class="wrapperClasses" :dir="direction">
    <label :for="for" :class="labelClasses">
      {{ text }}
      <span v-if="required" :class="styles.required" aria-hidden="true">*</span>
    </label>
    <span v-if="hint" :id="hintId" :class="hintClasses">{{ hint }}</span>
  </div>
</template>
