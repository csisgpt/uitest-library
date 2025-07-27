<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black opacity-50" @click="close"></div>
    <div :class="['bg-white rounded shadow-lg z-10', sizes[size]]" role="dialog">
      <header class="border-b p-4">
        <slot name="header">Modal</slot>
      </header>
      <section class="p-4">
        <slot />
      </section>
      <footer class="border-t p-4 text-right">
        <slot name="footer">
          <BaseButton @click="close">Close</BaseButton>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, withDefaults } from 'vue'
import BaseButton from './BaseButton.vue'

interface Props {
  modelValue: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})
const emit = defineEmits(['update:modelValue'])

const open = props.modelValue

function close() {
  emit('update:modelValue', false)
}

const sizes = {
  sm: 'max-w-sm w-full',
  md: 'max-w-md w-full',
  lg: 'max-w-lg w-full',
}
</script>
