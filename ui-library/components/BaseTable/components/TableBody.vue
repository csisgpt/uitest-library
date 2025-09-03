<template>
  <tbody class="base-table__body">
    <tr
      v-for="(row, rowIndex) in data"
      :key="getRowKey(row)"
      class="base-table__row"
      :class="getRowClasses(row, rowIndex)"
      @click="handleRowClick(row, rowIndex)"
      @dblclick="handleRowDblClick(row)"
    >
      <!-- Selection Column -->
      <td v-if="selectable" class="base-table__cell base-table__cell--checkbox">
        <input
          type="checkbox"
          :checked="isRowSelected(row)"
          @click.stop
          @change="handleRowSelect(row)"
        />
      </td>
      
      <!-- Data Columns -->
      <td
        v-for="column in columns"
        :key="column.key"
        class="base-table__cell"
        :class="getCellClasses(column, row)"
        :style="getCellStyle(column, row)"
        @dblclick="handleCellDblClick(row, column)"
      >
        <component
          :is="getCellRenderer(column)"
          :value="getCellValue(row, column)"
          :row="row"
          :column="column"
          :editing="isEditing(row, column)"
          @save="(value) => handleCellSave(row, column, value)"
          @cancel="handleCellCancel"
        />
      </td>
      
      <!-- Actions Column -->
      <td v-if="hasActions" class="base-table__cell base-table__cell--actions">
        <div class="row-actions">
          <!-- Edit Button -->
          <button
            v-if="crudConfig?.update && canUpdate(row)"
            @click.stop="handleEdit(row)"
            class="btn-action"
            title="ویرایش"
          >
            <IconEdit :size="16" />
          </button>
          
          <!-- Delete Button -->
          <button
            v-if="crudConfig?.delete && canDelete(row)"
            @click.stop="handleDelete(row)"
            class="btn-action btn-action--danger"
            title="حذف"
          >
            <IconTrash :size="16" />
          </button>
          
          <!-- Custom Actions -->
          <button
            v-for="action in getVisibleActions(row)"
            :key="action.label"
            @click.stop="action.handler(row)"
            :disabled="getActionDisabled(action, row)"
            class="btn-action"
            :class="`btn-action--${action.color || 'default'}`"
            :title="action.label"
          >
            <component :is="action.icon" v-if="action.icon" :size="16" />
          </button>
        </div>
      </td>
    </tr>
    
    <!-- Empty Row -->
    <tr v-if="data.length === 0" class="base-table__row base-table__row--empty">
      <td 
        :colspan="totalColumns" 
        class="base-table__cell base-table__cell--empty"
      >
        <slot name="empty">
          داده‌ای یافت نشد
        </slot>
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { IconEdit, IconTrash } from '@tabler/icons-vue'

// Cell Renderers
import StringCell from './renderers/StringCell.vue'
import NumberCell from './renderers/NumberCell.vue'
import CurrencyCell from './renderers/CurrencyCell.vue'
import BooleanCell from './renderers/BooleanCell.vue'
import DateCell from './renderers/DateCell.vue'
import JalaliDateCell from './renderers/JalaliDateCell.vue'
import EnumCell from './renderers/EnumCell.vue'
import FileCell from './renderers/FileCell.vue'
import TagsCell from './renderers/TagsCell.vue'
import StatusCell from './renderers/StatusCell.vue'
import ProgressCell from './renderers/ProgressCell.vue'
import RatingCell from './renderers/RatingCell.vue'

import type { Column, CrudConfig, RowAction } from '../types'

const props = defineProps<{
  data: any[]
  columns: Column[]
  rowKey?: string | ((row: any) => string | number)
  selectable?: boolean
  hasActions?: boolean
  selectedRows: any[]
  editingRow: any
  editingCell: any
  crudConfig?: CrudConfig
  rowActions?: RowAction[]
}>()

const emit = defineEmits<{
  'row-click': [row: any, index: number]
  'row-select': [row: any]
  'cell-edit': [row: any, column: string]
  'cell-save': [row: any, column: Column, value: any]
  'row-edit': [row: any]
  'row-delete': [row: any]
}>()

// Inject crud methods
const tableCrud = inject<any>('tableCrud')

// Cell renderer mapping
const cellRenderers = {
  string: StringCell,
  number: NumberCell,
  currency: CurrencyCell,
  boolean: BooleanCell,
  date: DateCell,
  datetime: DateCell,
  jalali: JalaliDateCell,
  enum: EnumCell,
  file: FileCell,
  image: FileCell,
  tags: TagsCell,
  array: TagsCell,
  status: StatusCell,
  progress: ProgressCell,
  rating: RatingCell
}

const totalColumns = computed(() => {
  let count = props.columns.length
  if (props.selectable) count++
  if (props.hasActions) count++
  return count
})

function getCellRenderer(column: Column) {
  if (column.render) {
    return column.render
  }
  return cellRenderers[column.type || 'string'] || cellRenderers.string
}

function getCellValue(row: any, column: Column) {
  if (typeof column.field === 'function') {
    return column.field(row)
  }
  if (typeof column.field === 'string') {
    return row[column.field]
  }
  return row[column.key]
}

function getRowKey(row: any): string | number {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  if (typeof props.rowKey === 'string') {
    return row[props.rowKey]
  }
  return row.id || row._id || row.key
}

function getRowClasses(row: any, index: number) {
  const classes = []
  
  if (isRowSelected(row)) {
    classes.push('base-table__row--selected')
  }
  
  if (props.editingRow === row) {
    classes.push('base-table__row--editing')
  }
  
  if (index % 2 === 0) {
    classes.push('base-table__row--even')
  }
  
  return classes
}

function getCellClasses(column: Column, row: any) {
  const classes = []
  
  if (column.align) {
    classes.push(`base-table__cell--${column.align}`)
  }
  
  if (column.ellipsis) {
    classes.push('base-table__cell--ellipsis')
  }
  
  if (column.editable && canUpdate(row)) {
    classes.push('base-table__cell--editable')
  }
  
  if (typeof column.className === 'function') {
    classes.push(column.className(getCellValue(row, column), row))
  } else if (column.className) {
    classes.push(column.className)
  }
  
  return classes
}

function getCellStyle(column: Column, row: any) {
  const style: any = {}
  
  if (column.width) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  }
  
  if (typeof column.cellStyle === 'function') {
    Object.assign(style, column.cellStyle(getCellValue(row, column), row))
  } else if (column.cellStyle) {
    Object.assign(style, column.cellStyle)
  }
  
  return style
}

function isRowSelected(row: any): boolean {
  return props.selectedRows.includes(row)
}

function isEditing(row: any, column: Column): boolean {
  if (props.crudConfig?.mode === 'inline') {
    return props.editingRow === row
  }
  return props.editingCell?.row === row && props.editingCell?.column === column.key
}

function canUpdate(row: any): boolean {
  if (!props.crudConfig?.update) return false
  
  if (typeof props.crudConfig.canUpdate === 'function') {
    return props.crudConfig.canUpdate(row)
  }
  
  return props.crudConfig.canUpdate !== false
}

function canDelete(row: any): boolean {
  if (!props.crudConfig?.delete) return false
  
  if (typeof props.crudConfig.canDelete === 'function') {
    return props.crudConfig.canDelete(row)
  }
  
  return props.crudConfig.canDelete !== false
}

function getVisibleActions(row: any): RowAction[] {
  if (!props.rowActions) return []
  
  return props.rowActions.filter(action => {
    if (typeof action.show === 'function') {
      return action.show(row)
    }
    return action.show !== false
  })
}

function getActionDisabled(action: RowAction, row: any): boolean {
  if (typeof action.disabled === 'function') {
    return action.disabled(row)
  }
  return action.disabled === true
}

function handleRowClick(row: any, index: number) {
  emit('row-click', row, index)
}

function handleRowDblClick(row: any) {
  if (props.crudConfig?.mode === 'inline' && canUpdate(row)) {
    emit('row-edit', row)
  }
}

function handleRowSelect(row: any) {
  emit('row-select', row)
}

function handleCellDblClick(row: any, column: Column) {
  if (column.editable && canUpdate(row)) {
    const trigger = column.editOptions?.trigger || 'dblclick'
    if (trigger === 'dblclick') {
      emit('cell-edit', row, column.key)
    }
  }
}

function handleCellSave(row: any, column: Column, value: any) {
  emit('cell-save', row, column, value)
}

function handleCellCancel() {
  if (tableCrud) {
    tableCrud.editingCell = null
  }
}

function handleEdit(row: any) {
  emit('row-edit', row)
}

function handleDelete(row: any) {
  emit('row-delete', row)
}
</script>

<style scoped>
.base-table__body {
  background: var(--color-background);
}

.base-table__row {
  border-bottom: 1px solid var(--color-border);
  transition: background var(--transition-fast);
}

.base-table__row:hover {
  background: var(--hover-overlay);
}

.base-table__row--selected {
  background: rgba(30, 135, 89, 0.1);
}

.base-table__row--editing {
  background: rgba(59, 130, 246, 0.05);
}

.base-table__cell {
  padding: var(--space-md);
  vertical-align: middle;
}

.base-table__cell--checkbox {
  width: 48px;
  text-align: center;
}

.base-table__cell--actions {
  width: 120px;
}

.base-table__cell--center {
  text-align: center;
}

.base-table__cell--left {
  text-align: left;
}

.base-table__cell--ellipsis {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-table__cell--editable {
  cursor: pointer;
  position: relative;
}

.base-table__cell--editable:hover::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px dashed var(--color-primary);
  border-radius: var(--radius-sm);
  pointer-events: none;
}

.row-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-action:hover {
  background: var(--color-primary);
  color: white;
}

.btn-action--danger:hover {
  background: var(--color-error);
}

.btn-action:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
</style>