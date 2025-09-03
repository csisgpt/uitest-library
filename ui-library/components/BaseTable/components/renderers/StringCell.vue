<template>
  <div class="cell-string" :class="className">
    <span v-if="!editing" :title="tooltipText" class="cell-value">
      {{ displayValue }}
    </span>
    <input
      v-else
      ref="inputRef"
      v-model="editValue"
      type="text"
      class="cell-input"
      :placeholder="column.editOptions?.placeholder"
      @blur="handleBlur"
      @keyup.enter="handleSave"
      @keyup.esc="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Column } from '../../types'

const props = defineProps<{
  value: any
  row: any
  column: Column
  editing?: boolean
}>()

const emit = defineEmits<{
  save: [value: any]
  cancel: []
}>()

const inputRef = ref<HTMLInputElement>()
const editValue = ref(props.value)

const displayValue = computed(() => {
  if (props.column.format) {
    return props.column.format(props.value, props.row)
  }
  return props.value || '-'
})

const tooltipText = computed(() => {
  if (typeof props.column.tooltip === 'function') {
    return props.column.tooltip(props.value, props.row)
  }
  return props.column.tooltip ? String(props.value) : undefined
})

const className = computed(() => {
  if (typeof props.column.className === 'function') {
    return props.column.className(props.value, props.row)
  }
  return props.column.className
})

watch(() => props.editing, async (isEditing) => {
  if (isEditing) {
    editValue.value = props.value
    await nextTick()
    inputRef.value?.focus()
    inputRef.value?.select()
  }
})

function handleBlur() {
  if (props.column.editOptions?.submitOnBlur !== false) {
    handleSave()
  }
}

function handleSave() {
  const finalValue = props.column.parse ? props.column.parse(editValue.value) : editValue.value
  emit('save', finalValue)
}

function handleCancel() {
  editValue.value = props.value
  emit('cancel')
}
</script>

<style scoped>
.cell-string {
  width: 100%;
}

.cell-value {
  display: block;
  width: 100%;
}

.cell-input {
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: inherit;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
}

.cell-input:focus {
  box-shadow: 0 0 0 2px rgba(30, 135, 89, 0.2);
}
</style>