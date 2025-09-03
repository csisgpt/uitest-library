<template>
  <div class="cell-tags">
    <div v-if="!editing" class="tags-display">
      <span
        v-for="(tag, index) in displayTags"
        :key="index"
        class="tag"
        :style="{ backgroundColor: getTagColor(tag) }"
      >
        {{ tag }}
      </span>
      <span v-if="hiddenCount > 0" class="tag tag--more">
        +{{ hiddenCount }}
      </span>
    </div>
    <div v-else class="tags-edit">
      <div class="tags-list">
        <span
          v-for="(tag, index) in editTags"
          :key="index"
          class="tag tag--editable"
          :style="{ backgroundColor: getTagColor(tag) }"
        >
          {{ tag }}
          <button @click="removeTag(index)" class="tag-remove">×</button>
        </span>
        <input
          ref="inputRef"
          v-model="inputValue"
          type="text"
          class="tags-input"
          placeholder="افزودن برچسب..."
          @keydown.enter.prevent="addTag"
          @keydown.backspace="removeLastTag"
          @blur="handleBlur"
          @keyup.esc="handleCancel"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Column } from '../../types'

const props = defineProps<{
  value: string[] | string | null
  row: any
  column: Column
  editing?: boolean
}>()

const emit = defineEmits<{
  save: [value: string[]]
  cancel: []
}>()

const inputRef = ref<HTMLInputElement>()
const inputValue = ref('')
const editTags = ref<string[]>([])
const options = computed(() => props.column.typeOptions)

const tags = computed(() => {
  if (!props.value) return []
  if (Array.isArray(props.value)) return props.value
  if (typeof props.value === 'string') {
    const separator = options.value?.separator || ','
    return props.value.split(separator).filter(Boolean)
  }
  return []
})

const displayTags = computed(() => {
  const max = options.value?.maxTags || 3
  return tags.value.slice(0, max)
})

const hiddenCount = computed(() => {
  const max = options.value?.maxTags || 3
  return Math.max(0, tags.value.length - max)
})

watch(() => props.editing, async (isEditing) => {
  if (isEditing) {
    editTags.value = [...tags.value]
    inputValue.value = ''
    await nextTick()
    inputRef.value?.focus()
  }
})

function getTagColor(tag: string): string {
  const colors = options.value?.tagColors
  if (!colors) return 'var(--color-primary)'
  
  if (typeof colors === 'function') {
    return colors(tag)
  }
  
  if (Array.isArray(colors)) {
    // Use hash function to consistently assign colors
    let hash = 0
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }
  
  return 'var(--color-primary)'
}

function addTag() {
  const tag = inputValue.value.trim()
  if (tag && !editTags.value.includes(tag)) {
    const maxItems = options.value?.maxItems
    if (!maxItems || editTags.value.length < maxItems) {
      editTags.value.push(tag)
      inputValue.value = ''
    }
  }
}

function removeTag(index: number) {
  editTags.value.splice(index, 1)
}

function removeLastTag() {
  if (inputValue.value === '' && editTags.value.length > 0) {
    editTags.value.pop()
  }
}

function handleBlur() {
  // Add any remaining input
  if (inputValue.value.trim()) {
    addTag()
  }
  
  if (props.column.editOptions?.submitOnBlur !== false) {
    emit('save', editTags.value)
  }
}

function handleCancel() {
  editTags.value = [...tags.value]
  inputValue.value = ''
  emit('cancel')
}
</script>

<style scoped>
.cell-tags {
  width: 100%;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tags-edit {
  width: 100%;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  min-height: 32px;
  align-items: center;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: white;
  white-space: nowrap;
  background: var(--color-primary);
}

.tag--more {
  background-color: var(--color-muted);
}

.tag--editable {
  padding-right: 4px;
  gap: 4px;
}

.tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  padding: 0;
  transition: background var(--transition-fast);
}

.tag-remove:hover {
  background: rgba(255, 255, 255, 0.5);
}

.tags-input {
  flex: 1;
  min-width: 100px;
  border: none;
  background: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  color: var(--color-text);
  padding: 2px;
}
</style>