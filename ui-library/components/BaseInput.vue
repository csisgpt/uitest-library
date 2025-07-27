<template>
  <input
    :class="[
      'border rounded w-full focus:outline-none focus:ring-2',
      sizes[size],
      variants[variant],
      { 'opacity-50 cursor-not-allowed bg-gray-100': disabled }
    ]"
    :disabled="disabled"
    :type="type"
    v-model="inputValue"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits, withDefaults } from 'vue'

interface Props {
  modelValue?: string | number
  variant?: 'default' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  type?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  type: 'text',
  disabled: false,
})
const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => (inputValue.value = val)
)
watch(inputValue, val => emit('update:modelValue', val))

const variants = {
  default: 'border-gray-300 focus:ring-brand',
  underline: 'border-0 border-b border-gray-300 focus:ring-0 focus:border-brand',
}

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2',
  lg: 'px-4 py-3 text-lg',
}
</script>
