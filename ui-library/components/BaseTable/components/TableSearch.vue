<template>
  <div class="table-search">
    <div class="search-input-wrapper">
      <IconSearch :size="18" class="search-icon" />
      <input
        v-model="localValue"
        type="text"
        class="search-input"
        placeholder="جستجو..."
        @input="handleInput"
        @keyup.enter="handleSearch"
      />
      <button
        v-if="localValue"
        @click="handleClear"
        class="search-clear"
      >
        <IconX :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconSearch, IconX } from '@tabler/icons-vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

let searchTimeout: number | undefined

function handleInput() {
  emit('update:modelValue', localValue.value)
  
  // Debounce search
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    handleSearch()
  }, 300) as unknown as number
}

function handleSearch() {
  emit('search', localValue.value)
}

function handleClear() {
  localValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<style scoped>
.table-search {
  position: relative;
  min-width: 250px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  right: 12px;
  color: var(--color-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--space-sm) var(--space-xl);
  padding-right: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: var(--font-size-sm);
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: all var(--transition-fast);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(30, 135, 89, 0.1);
}

.search-input::placeholder {
  color: var(--color-muted);
}

.search-clear {
  position: absolute;
  left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: var(--color-surface);
  color: var(--color-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-clear:hover {
  background: var(--color-border);
  color: var(--color-text);
}
</style>