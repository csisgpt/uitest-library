<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import styles from './BaseTextarea.module.css'

const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  rows?: number
  maxLength?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  autoResize?: boolean
  error?: string | boolean
  hint?: string
  name?: string
  id?: string
}>(), {
  rows: 3,
  resize: 'vertical',
  disabled: false,
  readonly: false,
  autoResize: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input', event: Event): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const isFocused = ref(false)

const textareaId = computed(() => props.id || `textarea-${Math.random().toString(36).slice(2)}`)
const hintId = computed(() => props.hint ? `${textareaId.value}-hint` : undefined)
const errorId = computed(() => typeof props.error === 'string' ? `${textareaId.value}-error` : undefined)
const describedBy = computed(() => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined)

const resizeClass = computed(() => {
  switch (props.resize) {
    case 'none':
      return styles.resizeNone
    case 'both':
      return styles.resizeBoth
    case 'horizontal':
      return styles.resizeHorizontal
    default:
      return styles.resizeVertical
  }
})

const classes = computed(() => [
  styles.textarea,
  resizeClass.value,
  props.disabled && styles.disabled,
  isFocused.value && styles.focused
])

const adjustHeight = () => {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

const onInput = (e: Event) => {
  const value = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
  emit('input', e)
  if (props.autoResize) adjustHeight()
}

const onFocus = (e: FocusEvent) => {
  isFocused.value = true
  emit('focus', e)
}

const onBlur = (e: FocusEvent) => {
  isFocused.value = false
  emit('blur', e)
}

watch(() => props.modelValue, () => {
  if (props.autoResize) nextTick(adjustHeight)
})

onMounted(() => {
  if (props.autoResize) adjustHeight()
})
</script>

<template>
  <div :class="styles.wrapper">
    <label v-if="label" :for="textareaId" :class="styles.label">{{ label }}</label>
    <textarea
      ref="textareaRef"
      :id="textareaId"
      :name="name"
      :class="classes"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxLength"
      :aria-invalid="!!error"
      :aria-describedby="describedBy"
      :value="modelValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <div v-if="hint && !error" :id="hintId" :class="styles.hint">{{ hint }}</div>
    <div v-if="typeof error === 'string'" :id="errorId" :class="styles.error">{{ error }}</div>
    <div v-if="maxLength" :class="styles.counter">{{ modelValue.length }} / {{ maxLength }}</div>
  </div>
</template>
