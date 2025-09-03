<template>
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="modelValue" class="column-panel-overlay" @click="handleClose">
        <div class="column-panel" @click.stop>
          <div class="column-panel__header">
            <h3>تنظیمات ستون‌ها</h3>
            <button @click="handleClose" class="close-btn">
              <IconX :size="20" />
            </button>
          </div>
          
          <div class="column-panel__body">
            <div class="column-actions">
              <button @click="selectAll" class="action-btn">
                انتخاب همه
              </button>
              <button @click="deselectAll" class="action-btn">
                لغو انتخاب همه
              </button>
              <button @click="resetOrder" class="action-btn">
                بازنشانی ترتیب
              </button>
            </div>
            
            <div class="column-list">
              <TransitionGroup name="list">
                <div
                  v-for="(column, index) in localColumns"
                  :key="column.key"
                  class="column-item"
                  :class="{ 'column-item--dragging': dragIndex === index }"
                  draggable="true"
                  @dragstart="handleDragStart(index)"
                  @dragend="handleDragEnd"
                  @dragover.prevent
                  @drop="handleDrop(index)"
                >
                  <span class="drag-handle">
                    <IconGripVertical :size="16" />
                  </span>
                  
                  <label class="column-label">
                    <input
                      type="checkbox"
                      :checked="!column.hidden"
                      @change="toggleColumn(index)"
                      class="column-checkbox"
                    />
                    <span class="column-name">{{ column.label }}</span>
                  </label>
                  
                  <div class="column-info">
                    <span v-if="column.fixed" class="column-badge">
                      {{ column.fixed === 'left' ? 'ثابت چپ' : 'ثابت راست' }}
                    </span>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
          
          <div class="column-panel__footer">
            <button @click="handleSave" class="btn btn--primary">
              ذخیره تغییرات
            </button>
            <button @click="handleClose" class="btn btn--default">
              انصراف
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconX, IconGripVertical } from '@tabler/icons-vue'
import type { Column } from '../types'

const props = defineProps<{
  modelValue: boolean
  columns: Column[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update': [columns: Column[]]
}>()

const localColumns = ref<Column[]>([])
const dragIndex = ref<number | null>(null)
const originalColumns = ref<Column[]>([])

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    // Create a deep copy of columns
    localColumns.value = props.columns.map(col => ({ ...col }))
    originalColumns.value = props.columns.map(col => ({ ...col }))
  }
})

function toggleColumn(index: number) {
  localColumns.value[index].hidden = !localColumns.value[index].hidden
}

function selectAll() {
  localColumns.value.forEach(col => {
    col.hidden = false
  })
}

function deselectAll() {
  localColumns.value.forEach(col => {
    col.hidden = true
  })
}

function resetOrder() {
  localColumns.value = originalColumns.value.map(col => ({ ...col }))
}

function handleDragStart(index: number) {
  dragIndex.value = index
}

function handleDragEnd() {
  dragIndex.value = null
}

function handleDrop(dropIndex: number) {
  if (dragIndex.value === null || dragIndex.value === dropIndex) return
  
  const draggedColumn = localColumns.value[dragIndex.value]
  const newColumns = [...localColumns.value]
  
  // Remove dragged item
  newColumns.splice(dragIndex.value, 1)
  
  // Insert at new position
  const insertIndex = dragIndex.value < dropIndex ? dropIndex - 1 : dropIndex
  newColumns.splice(insertIndex, 0, draggedColumn)
  
  localColumns.value = newColumns
  dragIndex.value = null
}

function handleSave() {
  emit('update', localColumns.value)
  handleClose()
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.column-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-index-modal);
  display: flex;
  justify-content: flex-end;
}

.column-panel {
  width: 400px;
  height: 100%;
  background: var(--color-background);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.column-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.column-panel__header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-text);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.close-btn:hover {
  background: var(--color-border);
}

.column-panel__body {
  flex: 1;
  overflow: auto;
  padding: var(--space-lg);
}

.column-actions {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.action-btn {
  flex: 1;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--color-border);
}

.column-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.column-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: move;
  transition: all var(--transition-fast);
}

.column-item:hover {
  background: var(--color-background);
  box-shadow: var(--shadow-sm);
}

.column-item--dragging {
  opacity: 0.5;
}

.drag-handle {
  display: flex;
  color: var(--color-muted);
  cursor: move;
}

.column-label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
}

.column-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.column-name {
  font-size: var(--font-size-md);
}

.column-info {
  display: flex;
  gap: var(--space-xs);
}

.column-badge {
  padding: 2px 8px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

.column-panel__footer {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.btn {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover {
  filter: brightness(1.1);
}

.btn--default {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn--default:hover {
  background: var(--color-border);
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from .column-panel,
.slide-leave-to .column-panel {
  transform: translateX(100%);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
  right: 0;
  left: 0;
}

@media (max-width: 480px) {
  .column-panel {
    width: 100%;
  }
}
</style>