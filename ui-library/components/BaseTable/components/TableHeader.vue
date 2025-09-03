<template>
  <thead class="base-table__header">
    <tr>
      <!-- Selection Column -->
      <th v-if="selectable" class="base-table__header-cell base-table__header-cell--checkbox">
        <input
          type="checkbox"
          :checked="selectedAll"
          :indeterminate="indeterminate"
          @change="$emit('select-all', $event.target.checked)"
        />
      </th>
      
      <!-- Data Columns -->
      <th
        v-for="column in columns"
        :key="column.key"
        class="base-table__header-cell"
        :class="getHeaderClasses(column)"
        :style="getHeaderStyle(column)"
        @click="handleSort(column)"
      >
        <div class="header-cell-content">
          <span class="header-label">{{ column.label }}</span>
          
          <!-- Sort Icon -->
          <span v-if="column.sortable" class="sort-icon">
            <IconChevronUp
              v-if="sortConfig?.field === column.key && sortConfig?.order === 'asc'"
              :size="14"
            />
            <IconChevronDown
              v-else-if="sortConfig?.field === column.key && sortConfig?.order === 'desc'"
              :size="14"
            />
            <IconSelector
              v-else
              :size="14"
              class="sort-icon--inactive"
            />
          </span>
          
          <!-- Filter Icon -->
          <button
            v-if="column.filterable"
            @click.stop="openFilter(column)"
            class="filter-icon"
            :class="{ 'filter-icon--active': hasFilter(column) }"
          >
            <IconFilter :size="14" />
          </button>
        </div>
        
        <!-- Resize Handle -->
        <div
          v-if="column.resizable !== false"
          class="resize-handle"
          @mousedown="startResize($event, column)"
        />
      </th>
      
      <!-- Actions Column -->
      <th v-if="hasActions" class="base-table__header-cell base-table__header-cell--actions">
        عملیات
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  IconChevronUp, 
  IconChevronDown, 
  IconSelector,
  IconFilter 
} from '@tabler/icons-vue'
import type { Column, SortConfig } from '../types'

const props = defineProps<{
  columns: Column[]
  sortConfig?: SortConfig | null
  selectable?: boolean
  hasActions?: boolean
  selectedAll?: boolean
  indeterminate?: boolean
}>()

const emit = defineEmits<{
  'sort': [column: Column]
  'select-all': [checked: boolean]
  'filter': [column: Column]
  'resize': [column: Column, width: number]
}>()

const resizing = ref<{
  column: Column | null
  startX: number
  startWidth: number
}>({
  column: null,
  startX: 0,
  startWidth: 0
})

const activeFilters = ref<Map<string, any>>(new Map())

function getHeaderClasses(column: Column) {
  const classes = []
  
  if (column.sortable) {
    classes.push('base-table__header-cell--sortable')
  }
  
  if (column.align) {
    classes.push(`base-table__header-cell--${column.align}`)
  }
  
  if (column.fixed) {
    classes.push(`base-table__header-cell--fixed-${column.fixed}`)
  }
  
  return classes
}

function getHeaderStyle(column: Column) {
  const style: any = {}
  
  if (column.width) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  }
  
  if (column.minWidth) {
    style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth
  }
  
  if (column.maxWidth) {
    style.maxWidth = typeof column.maxWidth === 'number' ? `${column.maxWidth}px` : column.maxWidth
  }
  
  return style
}

function handleSort(column: Column) {
  if (!column.sortable) return
  emit('sort', column)
}

function openFilter(column: Column) {
  emit('filter', column)
}

function hasFilter(column: Column): boolean {
  return activeFilters.value.has(column.key)
}

function startResize(event: MouseEvent, column: Column) {
  resizing.value = {
    column,
    startX: event.clientX,
    startWidth: (event.target as HTMLElement).parentElement?.offsetWidth || 0
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

function handleMouseMove(event: MouseEvent) {
  if (!resizing.value.column) return
  
  const diff = event.clientX - resizing.value.startX
  const newWidth = Math.max(50, resizing.value.startWidth + diff)
  
  emit('resize', resizing.value.column, newWidth)
}

function handleMouseUp() {
  resizing.value = {
    column: null,
    startX: 0,
    startWidth: 0
  }
  
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}
</script>

<style scoped>
.base-table__header {
  background: var(--color-surface);
  border-bottom: 2px solid var(--color-border);
}

.base-table__header-cell {
  padding: var(--space-md);
  text-align: right;
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  position: relative;
  user-select: none;
}

.base-table__header-cell--sortable {
  cursor: pointer;
  transition: background var(--transition-fast);
}

.base-table__header-cell--sortable:hover {
  background: var(--hover-overlay);
}

.base-table__header-cell--checkbox {
  width: 48px;
  text-align: center;
}

.base-table__header-cell--actions {
  width: 120px;
  text-align: center;
}

.base-table__header-cell--center {
  text-align: center;
}

.base-table__header-cell--left {
  text-align: left;
}

.header-cell-content {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.header-label {
  flex: 1;
}

.sort-icon {
  display: inline-flex;
  color: var(--color-primary);
}

.sort-icon--inactive {
  opacity: 0.3;
  color: var(--color-muted);
}

.filter-icon {
  display: inline-flex;
  padding: 2px;
  border: none;
  background: none;
  color: var(--color-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.filter-icon:hover {
  background: var(--hover-overlay);
  color: var(--color-text);
}

.filter-icon--active {
  color: var(--color-primary);
}

.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background: transparent;
  transition: background var(--transition-fast);
}

.resize-handle:hover {
  background: var(--color-primary);
}

</style >