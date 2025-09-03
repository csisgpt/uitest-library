<template>
  <div class="cell-jalali-date">
    <span v-if="!editing" class="date-display">
      <IconCalendar :size="16" class="date-icon" />
      {{ formattedDate }}
    </span>
    <div v-else class="date-edit">
      <input
        ref="inputRef"
        v-model="editValue"
        type="text"
        class="cell-input"
        placeholder="1403/01/01"
        dir="ltr"
        @blur="handleBlur"
        @keyup.enter="handleSave"
        @keyup.esc="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { IconCalendar } from '@tabler/icons-vue'
import type { Column } from '../../types'

// Simple Jalali date formatter (you can use moment-jalaali or other libraries)
function formatJalaliDate(date: string | Date | null, format?: string): string {
  if (!date) return '-'
  
  // This is a simplified version - in production use a proper library
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  
  // Convert to Jalali (simplified - use proper conversion library)
  const options: Intl.DateTimeFormatOptions = {
    calendar: 'persian',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  
  return new Intl.DateTimeFormat('fa-IR', options).format(d)
}

const props = defineProps<{
  value: string | Date | null
  row: any
  column: Column
  editing?: boolean
}>()

const emit = defineEmits<{
  save: [value: string]
  cancel: []
}>()

const inputRef = ref<HTMLInputElement>()
const editValue = ref('')

const options = computed(() => props.column.typeOptions)

const formattedDate = computed(() => {
  if (!props.value) return '-'
  
  if (props.column.format) {
    return props.column.format(props.value, props.row)
  }
  
  return formatJalaliDate(props.value, options.value?.jalaliFormat)
})

watch(() => props.editing, async (isEditing) => {
  if (isEditing) {
    editValue.value = formattedDate.value !== '-' ? formattedDate.value : ''
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
  // Convert Jalali to Gregorian (simplified - use proper conversion)
  // In production, use a library like moment-jalaali
  emit('save', editValue.value)
}

function handleCancel() {
  editValue.value = ''
  emit('cancel')
}
</script>

<style scoped>
.cell-jalali-date {
  width: 100%;
}

.date-display {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.date-icon {
  color: var(--color-muted);
}

.date-edit {
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