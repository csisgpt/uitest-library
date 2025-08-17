<script setup lang="ts">
import { defineProps, defineEmits, withDefaults, ref, watch, onMounted, nextTick } from 'vue'
import styles from './BaseCheckbox.module.css'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  disabled?: boolean
  color?: string
  size?: 'small' | 'medium' | 'large'
  indeterminate?: boolean
  advancedAnimation?: boolean
  showStatus?: boolean
}>(), {
  modelValue: false,
  label: '',
  disabled: false,
  color: 'var(--color-primary)',
  size: 'medium',
  indeterminate: false,
  advancedAnimation: true,
  showStatus: true,
})

const emit = defineEmits(['update:modelValue'])
const checkbox = ref<HTMLInputElement | null>(null)

function setIndeterminate() {
  if (checkbox.value) checkbox.value.indeterminate = !!props.indeterminate
}

onMounted(() => setIndeterminate())
watch(() => props.indeterminate, setIndeterminate)

function handleChange(e: Event) {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label :class="[styles.root, props.disabled && styles.disabled]">
    <!-- input باید بالاتر باشد تا کیبورد و کلیک عادی کار کند -->
    <input
      ref="checkbox"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :class="styles.input"
      @change="handleChange"
      :aria-checked="indeterminate ? 'mixed' : modelValue"
      tabindex="0"
    />
    <!-- مربع نمایشی -->
    <span
      :class="[
        styles.box,
        styles[size],
        modelValue && styles.checked,
        indeterminate && styles.indeterminate,
        disabled && styles.disabledBox
      ]"
      :style="{ borderColor: color }"
    >
      <svg
        v-if="modelValue || indeterminate"
        :class="styles.icon"
        viewBox="0 0 20 20"
        fill="none"
      >
        <!-- تیک -->
        <path
          v-if="!indeterminate"
          d="M5 10.5L9 14.2L15 6"
          stroke="var(--color-on-primary, #fff)"
          stroke-width="2.1"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- خط indeterminate -->
        <rect
          v-else
          x="5" y="9" width="10" height="2.2" rx="1"
          fill="var(--color-on-primary, #fff)"
        />
      </svg>
    </span>
    <span :class="styles.label">{{ label }}</span>
    <div v-if="$slots.status" :class="styles.status">
      <slot name="status" />
    </div>
    <div v-else-if="showStatus" :class="styles.status">
      <span :class="[modelValue ? styles.active : styles.inactive]">
        {{ modelValue ? 'فعال' : 'غیرفعال' }}
      </span>
    </div>
  </label>
</template>

<style module src="./BaseCheckbox.module.css">
/* Standardized states */
:focus-visible{outline:none;box-shadow:0 0 0 var(--focus-ring-offset) var(--color-background),0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);}
*{transition:background var(--transition-base),color var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base);}</style>
