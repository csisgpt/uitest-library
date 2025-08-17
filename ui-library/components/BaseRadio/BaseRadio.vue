<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, computed } from 'vue'
import styles from './BaseRadio.module.css'

const props = withDefaults(defineProps<{
  modelValue: string | number | boolean
  value: string | number | boolean
  label?: string
  name?: string
  disabled?: boolean
  error?: boolean
  required?: boolean
  inline?: boolean
  id?: string
  ariaLabel?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  disabled: false,
  error: false,
  required: false,
  inline: false,
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void
  (e: 'change', event: Event): void
}>()

const internalId = props.id || `radio-${Math.random().toString(36).slice(2, 9)}`

const isChecked = computed(() => props.modelValue === props.value)

function onChange(e: Event) {
  if (props.disabled) return
  emit('update:modelValue', props.value)
  emit('change', e)
}
</script>

<template>
  <div
    :class="[
      styles.wrapper,
      styles[size],
      inline && styles.inline,
      disabled && styles.disabled,
      error && styles.error
    ]"
  >
    <input
      :id="internalId"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      :required="required"
      :aria-label="ariaLabel"
      type="radio"
      :class="styles.input"
      @change="onChange"
    />
    <label :for="internalId" :class="styles.label">
      <span :class="styles.control">
        <span :class="styles.dot"></span>
      </span>
      <span v-if="label" :class="styles.text">
        {{ label }}
        <span v-if="required" :class="styles.required">*</span>
      </span>
    </label>
  </div>
</template>

<style module src="./BaseRadio.module.css">
/* Standardized states */
:focus-visible{outline:none;box-shadow:0 0 0 var(--focus-ring-offset) var(--color-background),0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);}
*{transition:background var(--transition-base),color var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base);}</style>
