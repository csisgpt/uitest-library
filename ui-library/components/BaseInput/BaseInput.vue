<script setup lang="ts">
import { ref, computed, toRefs, defineExpose } from 'vue'
import styles from './BaseInput.module.css'

defineOptions({ inheritAttrs: false }) // اجازهٔ پاس‌دادن اتریبیوت‌ها روی <input/>

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
    /** 'rtl' | 'ltr' | 'auto' */
    dir?: 'rtl' | 'ltr' | 'auto'
    /** دکمهٔ نمایش/مخفی‌سازی پسورد */
    showPasswordToggle?: boolean
  }>(),
  {
    variant: 'outline',
    size: 'md',
    type: 'text',
    block: false,
    rounded: false,
    fullWidth: false,
    loading: false,
    disabled: false,
    readonly: false,
    clearable: false,
    dir: 'auto',
    showPasswordToggle: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const isPasswordVisible = ref(false)

const isInvalid = computed(() => !!props.errorMessage)
const isSuccess = computed(() => !!props.successMessage && !props.errorMessage)
const resolvedType = computed(() =>
  props.type === 'password' && props.showPasswordToggle && isPasswordVisible.value ? 'text' : props.type
)

const resolvedDir = computed<undefined | 'rtl' | 'ltr'>(() => {
  if (props.dir === 'rtl') return 'rtl'
  if (props.dir === 'ltr') return 'ltr'
  // auto: از document بگیر
  if (typeof window !== 'undefined') {
    const el = document.documentElement
    const attr = (el.getAttribute('dir') || el.style.direction || '').toLowerCase()
    return (attr === 'rtl' || attr === 'ltr') ? (attr as 'rtl'|'ltr') : undefined
  }
  return undefined
})

const classes = computed(() => [
  styles.input,
  styles[props.variant],
  styles[props.size],
  props.block && styles.block,
  props.rounded && styles.rounded,
  props.fullWidth && styles.fullWidth,
  props.disabled && styles.disabled,
  isFocused.value && styles.focused,
  isInvalid.value && styles.invalid,
  isSuccess.value && styles.valid,
  props.loading && styles.loading
])

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
}

const onFocus = () => {
  isFocused.value = true
  emit('focus')
}

const onBlur = () => {
  isFocused.value = false
  emit('blur')
}

const clearInput = () => {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', '')
  emit('clear')
  // برگرداندن فوکوس به ورودی
  requestAnimationFrame(() => inputRef.value?.focus())
}

function focus() { inputRef.value?.focus() }
function blur() { inputRef.value?.blur() }
defineExpose({ focus, blur })
</script>

<template>
  <div :class="styles.wrapper">
    <label v-if="label" :for="id" :class="styles.label">{{ label }}</label>

    <div :class="classes" :aria-invalid="isInvalid || undefined">
      <span v-if="$slots['prefix']" :class="styles.affix"><slot name="prefix" /></span>

      <span v-if="iconLeft" :class="styles.iconLeft">
        <slot name="icon-left" />
      </span>

      <input
        v-bind="$attrs"
        ref="inputRef"
        :id="id"
        :dir="resolvedDir"
        :type="resolvedType"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :class="styles.native"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <!-- Clear -->
      <button
        v-if="clearable && modelValue && !disabled && !readonly"
        type="button"
        :class="styles.clear"
        @click="clearInput"
        aria-label="Clear input"
        title="Clear"
      >×</button>

      <!-- Password toggle -->
      <button
        v-if="type === 'password' && showPasswordToggle && !disabled"
        type="button"
        :class="styles.eye"
        @click="isPasswordVisible = !isPasswordVisible"
        :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
        :title="isPasswordVisible ? 'Hide' : 'Show'"
      >👁</button>

      <span v-if="props.loading" :class="styles.spinner" aria-hidden="true"></span>

      <span v-if="iconRight" :class="styles.iconRight">
        <slot name="icon-right" />
      </span>

      <span v-if="$slots['suffix']" :class="styles.affix"><slot name="suffix" /></span>
    </div>

    <div v-if="hint && !errorMessage && !successMessage" :class="styles.hint">{{ hint }}</div>
    <div v-if="errorMessage" :class="styles.errorMsg">{{ errorMessage }}</div>
    <div v-else-if="successMessage" :class="styles.successMsg">{{ successMessage }}</div>
  </div>
</template>
