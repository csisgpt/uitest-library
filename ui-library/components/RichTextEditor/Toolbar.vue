<script setup lang="ts">
import styles from './Toolbar.module.css'
import type { ToolbarButton } from './types'

const props = withDefaults(defineProps<{
  buttons?: ToolbarButton[]
  disabled?: boolean
}>(), {
  buttons: () => [],
  disabled: false
})

const emit = defineEmits<{(e:'command', button: ToolbarButton): void}>()

const onClick = (btn: ToolbarButton) => {
  if (props.disabled) return
  emit('command', btn)
}
</script>

<template>
  <div :class="styles.toolbar">
    <button
      v-for="btn in props.buttons"
      :key="btn.command + (btn.value || '')"
      type="button"
      :class="styles.button"
      :disabled="props.disabled"
      @click="onClick(btn)"
    >
      <slot :name="btn.command" :button="btn">{{ btn.label }}</slot>
    </button>
    <slot />
  </div>
</template>
