
<template>
  <div class="cell-enum">
    <div v-if="!editing" class="enum-display">
      <span 
        class="enum-badge"
        :style="{ 
          backgroundColor: selectedOption?.color || 'var(--color-primary)',
          color: getContrastColor(selectedOption?.color)
        }"
      >
        <component :is="selectedOption?.icon" v-if="selectedOption?.icon" :size="14" />
        {{ selectedOption?.label || value || '-' }}
      </span>
    </div>
    <select
      v-else
      ref="selectRef"
      v-model="editValue"
      class="cell-select"
      @change="handleSave"
      @blur="handleBlur"
      @keyup.esc="handleCancel"
    >
      <option value="">انتخاب کنید</option>
      <option 
        v-for="option in options?.options" 
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
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

const selectRef = ref<HTMLSelectElement>()
const editValue = ref(props.value)
const options = computed(() => props.column.typeOptions)

const selectedOption = computed(() => 
  options.value?.options?.find(opt => opt.value === props.value)
)

watch(() => props.editing, async (isEditing) => {
  if (isEditing) {
    editValue.value = props.value
    await nextTick()
    selectRef.value?.focus()
  }
})

function getContrastColor(bgColor?: string): string {
  if (!bgColor) return '#ffffff'
  
  // Remove # if present
  const color = bgColor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

function handleBlur() {
  if (props.column.editOptions?.submitOnBlur !== false) {
    handleSave()
  }
}

function handleSave() {
  emit('save', editValue.value)
}

function handleCancel() {
  editValue.value = props.value
  emit('cancel')
}
</script>

<style scoped>
.cell-enum {
  width: 100%;
}

.enum-display {
  display: inline-flex;
}

.enum-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.cell-select {
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: inherit;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  cursor: pointer;
}

.cell-select:focus {
  box-shadow: 0 0 0 2px rgba(30, 135, 89, 0.2);
}
</style>