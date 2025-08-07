<script setup lang="ts">
import styles from './BaseFormField.module.css'

withDefaults(
  defineProps<{
    label?: string
    for?: string
    hint?: string
    error?: boolean
    errorMessage?: string
    required?: boolean
    disabled?: boolean
    inline?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    label: '',
    for: '',
    hint: '',
    error: false,
    errorMessage: '',
    required: false,
    disabled: false,
    inline: false,
    size: 'md'
  }
)
</script>

<template>
  <div :class="[styles.wrapper, styles[size], disabled && styles.disabled]">
    <div :class="[styles.control, inline && styles.inline]">
      <label v-if="label" :for="for" :class="styles.label">
        {{ label }}
        <span v-if="required" :class="styles.required">*</span>
      </label>
      <div :class="styles.field">
        <slot />
      </div>
    </div>
    <div v-if="error && errorMessage" :class="styles.error">{{ errorMessage }}</div>
    <div v-else-if="hint" :class="styles.hint">{{ hint }}</div>
  </div>
</template>
