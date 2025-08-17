<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, withDefaults, defineProps } from 'vue'
import styles from './BaseSelect.module.css'

interface Option {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    options: Option[]
    label?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    error?: string | boolean
    hint?: string
    name?: string
    id?: string
    searchable?: boolean
    clearable?: boolean
    loading?: boolean
    dropdownIcon?: boolean
  }>(),
  {
    placeholder: '',
    disabled: false,
    readonly: false,
    error: false,
    hint: '',
    name: '',
    id: undefined,
    searchable: false,
    clearable: false,
    loading: false,
    dropdownIcon: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'focus', evt: FocusEvent): void
  (e: 'blur', evt: FocusEvent): void
  (e: 'change', value: string | number | null): void
}>()

const isOpen = ref(false)
const search = ref('')
const activeIndex = ref(-1)
const rootRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)

const uid = Math.random().toString(36).slice(2)
const selectId = computed(() => props.id || `base-select-${uid}`)
const labelId = computed(() => `${selectId.value}-label`)
const listId = computed(() => `${selectId.value}-list`)
const activeId = computed(() =>
  activeIndex.value >= 0 ? `${selectId.value}-option-${activeIndex.value}` : undefined
)

const filteredOptions = computed(() => {
  if (!props.searchable || !search.value) return props.options
  return props.options.filter(o =>
    o.label.toLowerCase().includes(search.value.toLowerCase())
  )
})

const selectedOption = computed(() =>
  props.options.find(o => o.value === props.modelValue) || null
)

const hasValue = computed(() =>
  props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
)

function openDropdown() {
  if (props.disabled || props.readonly || props.loading) return
  isOpen.value = true
  if (props.searchable) {
    requestAnimationFrame(() => searchRef.value?.focus())
  }
}

function closeDropdown() {
  isOpen.value = false
  activeIndex.value = -1
  search.value = ''
}

function toggleDropdown() {
  isOpen.value ? closeDropdown() : openDropdown()
}

function selectOption(opt: Option) {
  if (props.disabled || props.readonly || props.loading) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  closeDropdown()
}

function clearSelection(e: MouseEvent) {
  e.stopPropagation()
  emit('update:modelValue', null)
  emit('change', null)
}

function onDocumentClick(e: MouseEvent) {
  if (!rootRef.value?.contains(e.target as Node)) {
    closeDropdown()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled || props.readonly || props.loading) return
  const max = filteredOptions.value.length - 1
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (!isOpen.value) openDropdown()
      activeIndex.value = activeIndex.value < max ? activeIndex.value + 1 : 0
      break
    case 'ArrowUp':
      e.preventDefault()
      if (!isOpen.value) openDropdown()
      activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : max
      break
    case 'Enter':
      e.preventDefault()
      if (!isOpen.value) {
        openDropdown()
      } else if (activeIndex.value >= 0) {
        const opt = filteredOptions.value[activeIndex.value]
        if (opt) selectOption(opt)
      }
      break
    case 'Escape':
      if (isOpen.value) {
        e.preventDefault()
        closeDropdown()
      }
      break
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

watch(filteredOptions, () => {
  if (activeIndex.value >= filteredOptions.value.length) {
    activeIndex.value = filteredOptions.value.length - 1
  }
})
</script>

<template>
  <div :class="styles.wrapper" ref="rootRef">
    <label
      v-if="label"
      :for="selectId"
      :id="labelId"
      :class="styles.label"
    >{{ label }}</label>

    <div
      :id="selectId"
      ref="triggerRef"
      role="combobox"
      :aria-haspopup="'listbox'"
      :aria-expanded="isOpen"
      :aria-controls="listId"
      :aria-activedescendant="activeId"
      :aria-disabled="disabled || undefined"
      :aria-readonly="readonly || undefined"
      :aria-labelledby="label ? labelId : undefined"
      tabindex="0"
      @click="toggleDropdown"
      @keydown="handleKeydown"
      @focus="(e) => emit('focus', e)"
      @blur="(e) => emit('blur', e)"
      :class="[
        styles.control,
        disabled && styles.disabled,
        readonly && styles.readonly,
        error && styles.error,
        isOpen && styles.open,
        loading && styles.loading,
      ]"
    >
      <span v-if="selectedOption" :class="styles.value">{{ selectedOption.label }}</span>
      <span v-else :class="styles.placeholder">{{ placeholder }}</span>
      <button
        v-if="clearable && hasValue && !disabled && !readonly"
        type="button"
        :class="styles.clear"
        @click="clearSelection"
        aria-label="Clear selection"
      >×</button>
      <span v-if="dropdownIcon" :class="styles.icon">▼</span>
      <span v-if="loading" :class="styles.spinner" aria-hidden="true"></span>
      <input
        v-if="name"
        type="hidden"
        :name="name"
        :value="selectedOption ? selectedOption.value : ''"
      />
    </div>

    <ul
      v-show="isOpen"
      :id="listId"
      role="listbox"
      :class="styles.dropdown"
    >
      <li v-if="searchable" :class="styles.search">
        <input
          ref="searchRef"
          v-model="search"
          type="text"
          :class="styles.searchInput"
          :placeholder="placeholder"
          @keydown.stop="handleKeydown"
        />
      </li>
      <li
        v-for="(opt, index) in filteredOptions"
        :key="opt.value"
        :id="`${selectId}-option-${index}`"
        role="option"
        :aria-selected="opt.value === modelValue"
        @click="selectOption(opt)"
        @mousemove="activeIndex = index"
        :class="[
          styles.option,
          opt.value === modelValue && styles.selected,
          index === activeIndex && styles.active,
        ]"
      >
        {{ opt.label }}
      </li>
      <li v-if="!filteredOptions.length" :class="styles.noOptions">No options</li>
    </ul>

    <div v-if="typeof error === 'string'" :class="styles.errorMessage">{{ error }}</div>
    <div v-else-if="hint" :class="styles.hint">{{ hint }}</div>
  </div>
</template>

<style module src="./BaseSelect.module.css">
/* Standardized states */
:focus-visible{outline:none;box-shadow:0 0 0 var(--focus-ring-offset) var(--color-background),0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);}
*{transition:background var(--transition-base),color var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base);}</style>
