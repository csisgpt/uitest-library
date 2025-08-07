<script setup lang="ts">
import { useAttrs } from 'vue'
import styles from './BaseSwitch.module.css'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    onText?: string
    offText?: string
    name?: string
    id?: string
    labelPosition?: 'left' | 'right'
  }>(),
  {
    modelValue: false,
    disabled: false,
    size: 'md',
    labelPosition: 'right'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const attrs = useAttrs()

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    toggle()
  }
}
</script>

<template>
  <label
    :class="[styles.wrapper, styles[size], styles[labelPosition], disabled && styles.disabled]"
    v-bind="attrs"
  >
    <span v-if="label && labelPosition === 'left'" :class="styles.label">{{ label }}</span>

    <span :class="styles.switch">
      <input
        :id="id"
        :name="name"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :class="styles.input"
        role="switch"
        :aria-checked="modelValue"
        @change="toggle"
        @keydown="onKeydown"
      />
      <span :class="styles.track">
        <span :class="styles.thumb"></span>
        <span v-if="onText || offText" :class="styles.text">
          {{ modelValue ? onText : offText }}
        </span>
      </span>
    </span>

    <span v-if="label && labelPosition === 'right'" :class="styles.label">{{ label }}</span>
  </label>
</template>
