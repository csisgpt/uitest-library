<template>
  <div 
    class="base-table-container"
    :class="[
      `base-table--${size}`,
      `base-table--${variant}`,
      {
        'base-table--loading': loading,
        'base-table--border': border,
        'base-table--stripe': stripe,
        'base-table--sticky-header': stickyHeader
      }
    ]"
  >
    <!-- Toolbar -->
    <div v-if="showToolbar" class="base-table__toolbar">
      <div class="base-table__toolbar-left">
        <!-- Batch Actions -->
        <template v-if="selectedRows.length > 0">
          <span class="selected-count">
            {{ selectedRows.length }} مورد انتخاب شده
          </span>
          <button
            v-if="crudConfig.batchDelete"
            @click="crud.batchDelete()"
            class="btn btn--danger btn--sm"
          >
            <IconTrash :size="16" />
            حذف گروهی
          </button>
        </template>
        
        <!-- Create Button -->
        <button
          v-if="crudConfig.create && crud.canCreate"
          @click="crud.createRow()"
          class="btn btn--primary btn--sm"
        >
          <IconPlus :size="16" />
          {{ typeof crudConfig.create === 'object' ? crudConfig.create.label : 'جدید' }}
        </button>
        
        <!-- Search -->
        <TableSearch 
          v-if="searchable"
          v-model="searchQuery"
          @search="handleSearch"
        />
      </div>
      
      <div class="base-table__toolbar-right">
        <!-- Export -->
        <button 
          v-if="exportable"
          @click="handleExport"
          class="btn btn--default btn--sm"
        >
          <IconDownload :size="16" />
          خروجی
        </button>
        
        <!-- Column Settings -->
        <button
          @click="showColumnPanel = !showColumnPanel"
          class="btn btn--default btn--sm"
        >
          <IconColumns :size="16" />
        </button>
      </div>
    </div>

    <!-- Main Table -->
    <div 
      ref="tableWrapper"
      class="base-table__wrapper"
      :style="{
        height: height,
        maxHeight: maxHeight
      }"
    >
      <table class="base-table">
        <!-- Header -->
        <TableHeader
          v-if="showHeader"
          :columns="visibleColumns"
          :sort-config="sortState"
          :selectable="selectable"
          :has-actions="hasRowActions"
          :selected-all="isAllSelected"
          :indeterminate="isIndeterminate"
          @sort="handleSort"
          @select-all="handleSelectAll"
        />

        <!-- Body -->
        <TableBody
          :data="processedData"
          :columns="visibleColumns"
          :row-key="rowKey"
          :selectable="selectable"
          :has-actions="hasRowActions"
          :selected-rows="selectedRows"
          :editing-row="crud.editingRow"
          :editing-cell="crud.editingCell"
          :crud-config="crudConfig"
          :row-actions="rowActions"
          @row-click="handleRowClick"
          @row-select="handleRowSelect"
          @cell-edit="crud.editCell"
          @cell-save="handleCellSave"
          @row-edit="crud.editRow"
          @row-delete="crud.deleteRow"
        />
        
        <!-- Footer -->
        <TableFooter
          v-if="showSummary"
          :columns="visibleColumns"
          :data="data"
          :summary-method="summaryMethod"
          :selectable="selectable"
          :has-actions="hasRowActions"
        />
      </table>
      
      <!-- Loading -->
      <div v-if="loading" class="base-table__loading">
        <div class="base-table__spinner" />
        <span>در حال بارگذاری...</span>
      </div>
      
      <!-- Empty -->
      <div v-if="!loading && processedData.length === 0" class="base-table__empty">
        <IconDatabaseOff :size="48" />
        <span>{{ emptyText || 'داده‌ای یافت نشد' }}</span>
      </div>
    </div>

    <!-- Pagination -->
    <TablePagination
      v-if="pagination"
      v-bind="typeof pagination === 'object' ? pagination : defaultPagination"
      @change="handlePageChange"
      @size-change="handlePageSizeChange"
    />

    <!-- Column Panel -->
    <ColumnPanel
      v-model="showColumnPanel"
      :columns="columns"
      @update="handleColumnUpdate"
    />
    
    <!-- CRUD Modal -->
    <CrudModal
      v-if="crud.showCreateModal || crud.showEditModal"
      v-model="showCrudModal"
      :title="crudModalTitle"
      :data="crud.formData"
      :columns="editableColumns"
      :mode="crudMode"
      :loading="crud.loading"
      @save="handleCrudSave"
      @cancel="handleCrudCancel"
    />
    
    <!-- Delete Confirm -->
    <ConfirmDialog
      v-model="crud.showDeleteConfirm"
      title="تایید حذف"
      :message="deleteMessage"
      variant="danger"
      :loading="crud.loading"
      @confirm="crud.performDelete"
      @cancel="crud.cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide, onMounted } from 'vue'
import { 
  IconPlus, 
  IconTrash, 
  IconDownload, 
  IconColumns,
  IconDatabaseOff 
} from '@tabler/icons-vue'

// Components
import TableHeader from './components/TableHeader.vue'
import TableBody from './components/TableBody.vue'
import TableFooter from './components/TableFooter.vue'
import TablePagination from './components/TablePagination.vue'
import TableSearch from './components/TableSearch.vue'
import ColumnPanel from './components/ColumnPanel.vue'
import CrudModal from './components/CrudModal.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

// Composables
import { useTableCrud } from './composables/useTableCrud'
import { useTableSort } from './composables/useTableSort'
import { useTableFilter } from './composables/useTableFilter'
import { useTableSelection } from './composables/useTableSelection'
import { useTablePagination } from './composables/useTablePagination'
import { useTableExport } from './composables/useTableExport'

// Types
import type { TableProps, Column, CrudConfig } from './types'

// Props
const props = withDefaults(defineProps<TableProps>(), {
  size: 'medium',
  variant: 'default',
  theme: 'auto',
  showHeader: true,
  selectable: false,
  searchable: false,
  exportable: false,
  resizable: true,
  border: false,
  stripe: false,
  pagination: false,
  virtual: false,
  itemHeight: 48,
  overscan: 5,
  stickyHeader: false,
  stickyColumn: false,
  crud: false
})

// Emits
const emit = defineEmits<{
  'update:selectedRowKeys': [keys: (string | number)[]]
  'sort-change': [sort: any]
  'filter-change': [filters: any[]]
  'page-change': [page: number]
  'size-change': [size: number]
  'row-click': [row: any, index: number]
  'row-select': [rows: any[]]
}>()

// Refs
const tableWrapper = ref<HTMLElement>()
const searchQuery = ref('')
const showColumnPanel = ref(false)
const showCrudModal = computed(() => crud.showCreateModal || crud.showEditModal)

// CRUD Configuration
const crudConfig = computed<CrudConfig>(() => {
  if (typeof props.crud === 'boolean') {
    return {
      enabled: props.crud,
      mode: 'modal',
      create: true,
      update: true,
      delete: true,
      confirmDelete: true,
      successMessage: true,
      errorMessage: true
    }
  }
  return props.crud as CrudConfig
})

// Data ref
const localData = ref([...props.data])
watch(() => props.data, (newData) => {
  localData.value = [...newData]
})

// Composables
const { 
  selectedRows, 
  isAllSelected,
  isIndeterminate,
  handleRowSelect, 
  handleSelectAll 
} = useTableSelection(props, emit)

const { sortState, sortedData, handleSort } = useTableSort(localData, props.columns)
const { filteredData, handleFilter, handleSearch } = useTableFilter(sortedData, props.columns)
const { paginatedData, handlePageChange, handlePageSizeChange } = useTablePagination(
  filteredData, 
  props.pagination
)
const { handleExport } = useTableExport(processedData, props.columns)

// CRUD Composable
const crud = useTableCrud({
  config: crudConfig.value,
  data: localData,
  selectedRows,
  columns: props.columns
})

// Computed
const visibleColumns = computed(() => 
  props.columns.filter(col => !col.hidden)
)

const editableColumns = computed(() =>
  props.columns.filter(col => col.editable !== false)
)

const hasRowActions = computed(() => {
  return (crudConfig.value.update || crudConfig.value.delete) || props.rowActions?.length > 0
})

const processedData = computed(() => {
  if (props.pagination) {
    return paginatedData.value
  }
  return filteredData.value
})

const showToolbar = computed(() => {
  return props.searchable || props.exportable || crudConfig.value.create || 
         props.toolbarActions?.length > 0
})

const crudMode = computed(() => {
  return crud.showCreateModal ? 'create' : 'update'
})

const crudModalTitle = computed(() => {
  return crudMode.value === 'create' ? 'رکورد جدید' : 'ویرایش رکورد'
})

const deleteMessage = computed(() => {
  if (!crud.deleteTarget) return ''
  
  if (typeof crudConfig.value.confirmDeleteMessage === 'function') {
    return crudConfig.value.confirmDeleteMessage(crud.deleteTarget)
  }
  
  return crudConfig.value.confirmDeleteMessage || 'آیا از حذف این رکورد اطمینان دارید؟'
})

const defaultPagination = {
  current: 1,
  pageSize: 10,
  total: localData.value.length,
  pageSizes: [10, 20, 50, 100]
}

// Methods
function handleRowClick(row: any, index: number) {
  emit('row-click', row, index)
  
  if (props.selectOnRowClick) {
    handleRowSelect(row)
  }
}

function handleColumnUpdate(columns: Column[]) {
  // Update column visibility and order
  columns.forEach((col, index) => {
    const originalCol = props.columns.find(c => c.key === col.key)
    if (originalCol) {
      originalCol.hidden = col.hidden
    }
  })
}

async function handleCellSave(row: any, column: Column, value: any) {
  const id = getRowKey(row)
  const data = { ...row, [column.key]: value }
  await crud.saveEdit(id, data)
}

async function handleCrudSave() {
  if (crudMode.value === 'create') {
    await crud.saveCreate(crud.formData)
  } else {
    const id = getRowKey(crud.formData)
    await crud.saveEdit(id, crud.formData)
  }
}

function handleCrudCancel() {
  crud.cancelEdit()
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

// Lifecycle
onMounted(() => {
  if (crudConfig.value.api?.endpoints?.list) {
    crud.fetchData()
  }
})

// Provide context
provide('tableProps', props)
provide('tableCrud', crud)
</script>

<style scoped>
@import './styles/table.css';
</style>