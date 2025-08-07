<script setup lang="ts">
import { ref, computed } from 'vue'
import styles from './BaseInput.module.css'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error' | 'success' | 'warning' | 'info'
    size?: 'sm' | 'md' | 'lg'
    type?: 'text' | 'password' | 'email' | 'number'
    block?: boolean
    rounded?: boolean
    fullWidth?: boolean
    loading?: boolean
    disabled?: boolean
    readonly?: boolean
    iconLeft?: string
    iconRight?: string
    clearable?: boolean
    errorMessage?: string
    successMessage?: string
    hint?: string
    name?: string
    autocomplete?: string
    id?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'text',
    block: false,
    rounded: false,
    fullWidth: false,
    loading: false,
    disabled: false,
    readonly: false,
    clearable: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
}>()

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

const classes = computed(() => [
  styles.input,
  styles[props.variant],
  styles[props.size],
  props.block && styles.block,
  props.rounded && styles.rounded,
  props.fullWidth && styles.fullWidth,
  props.disabled && styles.disabled,
  isFocused.value && styles.focused
])

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div :class="styles.wrapper">
    <label v-if="label" :for="id" :class="styles.label">{{ label }}</label>

    <div :class="classes">
      <span v-if="iconLeft" :class="styles.iconLeft"><slot name="icon-left" /></span>

      <input
        ref="inputRef"
        :id="id"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :class="styles.native"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <button
        v-if="clearable && modelValue"
        type="button"
        :class="styles.clear"
        @click="clearInput"
        aria-label="Clear input"
      >×</button>

      <span v-if="iconRight" :class="styles.iconRight"><slot name="icon-right" /></span>
    </div>

    <div v-if="hint && !errorMessage && !successMessage" :class="styles.hint">{{ hint }}</div>
    <div v-if="errorMessage" :class="styles.error">{{ errorMessage }}</div>
    <div v-else-if="successMessage" :class="styles.success">{{ successMessage }}</div>
  </div>
</template>
