<template>
  <button
    :class="[
      styles.button,
      styles[variant],
      styles[size],
      styles[modelValue ? 'on' : 'off'],
      modelValue ? styles[color] : '',
      {
        [styles.disabled]: disabled,
        [styles.loading]: loading
      }
    ]"
    type="button"
    :aria-pressed="modelValue"
    :disabled="disabled || loading"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <span v-if="loading" :class="styles.loader"></span>
    <template v-else>
      <slot v-if="modelValue" name="on">
        <i v-if="onIcon" :class="[styles.icon, onIcon]" />
        <span>{{ onLabel }}</span>
      </slot>
      <slot v-else name="off">
        <i v-if="offIcon" :class="[styles.icon, offIcon]" />
        <span>{{ offLabel }}</span>
      </slot>
    </template>
  </button>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import styles from './BaseToggleButton.module.css'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    onLabel?: string
    offLabel?: string
    onIcon?: string
    offIcon?: string
    disabled?: boolean
    loading?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'solid' | 'outline' | 'ghost'
    color?: 'primary' | 'success' | 'error' | 'info' | 'warning'
  }>(),
  {
    modelValue: false,
    onLabel: 'On',
    offLabel: 'Off',
    disabled: false,
    loading: false,
    size: 'md',
    variant: 'solid',
    color: 'primary'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

useAttrs()

function toggle() {
  if (props.disabled || props.loading) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<style module src="./BaseToggleButton.module.css"></style>
