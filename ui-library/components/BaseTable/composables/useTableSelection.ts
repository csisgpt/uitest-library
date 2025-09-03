// composables/useTableSelection.ts
import { ref, computed, watch } from 'vue'
import type { TableProps } from '../types'

export function useTableSelection(props: TableProps, emit: any) {
  const selectedRows = ref<any[]>([])
  
  // Initialize with props
  watch(() => props.selectedRowKeys, (keys) => {
    if (keys && Array.isArray(keys)) {
      selectedRows.value = props.data.filter(row => {
        const key = getRowKey(row)
        return keys.includes(key)
      })
    }
  }, { immediate: true })
  
  const selectedKeys = computed(() => {
    return selectedRows.value.map(row => getRowKey(row))
  })
  
  const isAllSelected = computed(() => {
    if (props.data.length === 0) return false
    return props.data.every(row => selectedRows.value.includes(row))
  })
  
  const isIndeterminate = computed(() => {
    if (selectedRows.value.length === 0) return false
    return !isAllSelected.value && selectedRows.value.length > 0
  })
  
  function handleRowSelect(row: any) {
    const index = selectedRows.value.indexOf(row)
    
    if (props.selectionType === 'single') {
      // Single selection mode
      if (index === -1) {
        selectedRows.value = [row]
      } else {
        selectedRows.value = []
      }
    } else {
      // Multiple selection mode
      if (index === -1) {
        selectedRows.value.push(row)
      } else {
        selectedRows.value.splice(index, 1)
      }
    }
    
    emit('update:selectedRowKeys', selectedKeys.value)
    emit('row-select', selectedRows.value)
  }
  
  function handleSelectAll(checked: boolean) {
    if (checked) {
      selectedRows.value = [...props.data]
    } else {
      selectedRows.value = []
    }
    
    emit('update:selectedRowKeys', selectedKeys.value)
    emit('row-select', selectedRows.value)
  }
  
  function clearSelection() {
    selectedRows.value = []
    emit('update:selectedRowKeys', [])
    emit('row-select', [])
  }
  
  function selectRows(rows: any[]) {
    selectedRows.value = rows
    emit('update:selectedRowKeys', selectedKeys.value)
    emit('row-select', selectedRows.value)
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
  
  return {
    selectedRows,
    selectedKeys,
    isAllSelected,
    isIndeterminate,
    handleRowSelect,
    handleSelectAll,
    clearSelection,
    selectRows
  }
}