<template>
  <div class="cell-currency" :class="{ 'cell-currency--negative': isNegative }">
    <span v-if="!editing" class="currency-display">
      <span class="currency-value">{{ formattedValue }}</span>
      <span class="currency-symbol">{{ symbol }}</span>
    </span>
    <input
      v-else
      ref="inputRef"
      v-model.number="editValue"
      type="number"
      class="cell-input"
      :min="column.typeOptions?.min"
      :max="column.typeOptions?.max"
      :step="column.typeOptions?.step || 1000"
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
  value: number
  row: any
  column: Column
  editing?: boolean
}>()

const emit = defineEmits<{
  save: [value: number]
  cancel: []
}>()

const inputRef = ref<HTMLInputElement>()
const editValue = ref(props.value || 0)

const options = computed(() => props.column.typeOptions)

const isNegative = computed(() => props.value < 0)

const symbol = computed(() => {
  const symbols: Record<string, string> = {
    IRR: 'ریال',
    IRT: 'تومان',
    USD: '$',
    EUR: '€',
    GBP: '£'
  }
  return symbols[options.value?.currency || 'IRT'] || options.value?.currency || 'تومان'
})

const formattedValue = computed(() => {
  if (props.value == null) return '0'
  
  const locale = options.value?.locale || 'fa-IR'
  const opts: Intl.NumberFormatOptions = {
    minimumFractionDigits: options.value?.minimumFractionDigits || 0,
    maximumFractionDigits: options.value?.maximumFractionDigits || 0
  }
  
  return new Intl.NumberFormat(locale, opts).format(Math.abs(props.value))
})

watch(() => props.editing, async (isEditing) => {
  if (isEditing) {
    editValue.value = props.value || 0
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
  emit('save', editValue.value)
}

function handleCancel() {
  editValue.value = props.value || 0
  emit('cancel')
}
</script>

<style scoped>
.cell-currency {
  font-variant-numeric: tabular-nums;
  width: 100%;
}

.cell-currency--negative {
  color: var(--color-error);
}

.currency-display {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.currency-value {
  font-weight: var(--font-weight-medium);
}

.currency-symbol {
  font-size: 0.85em;
  color: var(--color-muted);
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
  text-align: left;
  direction: ltr;
}

.cell-input:focus {
  box-shadow: 0 0 0 2px rgba(30, 135, 89, 0.2);
}
</style>