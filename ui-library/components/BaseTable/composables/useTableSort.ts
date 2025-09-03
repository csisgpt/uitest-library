// composables/useTableSort.ts
import { ref, computed, Ref } from 'vue'
import type { Column, SortConfig } from '../types'

export function useTableSort(data: Ref<any[]>, columns: Column[]) {
  const sortState = ref<SortConfig | null>(null)
  
  const sortedData = computed(() => {
    if (!sortState.value || !sortState.value.field || !sortState.value.order) {
      return data.value
    }
    
    const { field, order } = sortState.value
    const column = columns.find(col => col.key === field)
    
    if (!column) return data.value
    
    const sorted = [...data.value].sort((a, b) => {
      let aVal = getFieldValue(a, column)
      let bVal = getFieldValue(b, column)
      
      // Handle null/undefined values
      if (aVal == null) return order === 'asc' ? 1 : -1
      if (bVal == null) return order === 'asc' ? -1 : 1
      
      // Type-specific sorting
      switch (column.type) {
        case 'number':
        case 'currency':
        case 'percent':
        case 'progress':
        case 'rating':
          aVal = Number(aVal) || 0
          bVal = Number(bVal) || 0
          break
          
        case 'date':
        case 'datetime':
        case 'jalali':
          aVal = new Date(aVal).getTime()
          bVal = new Date(bVal).getTime()
          break
          
        case 'boolean':
          aVal = aVal ? 1 : 0
          bVal = bVal ? 1 : 0
          break
          
        case 'array':
        case 'tags':
          aVal = Array.isArray(aVal) ? aVal.length : 0
          bVal = Array.isArray(bVal) ? bVal.length : 0
          break
          
        default:
          // String comparison
          aVal = String(aVal).toLowerCase()
          bVal = String(bVal).toLowerCase()
      }
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
    
    return sorted
  })
  
  function handleSort(column: Column) {
    if (!column.sortable) return
    
    if (sortState.value?.field === column.key) {
      // Toggle sort order
      if (sortState.value.order === 'asc') {
        sortState.value.order = 'desc'
      } else if (sortState.value.order === 'desc') {
        sortState.value = null
      } else {
        sortState.value = { field: column.key, order: 'asc' }
      }
    } else {
      // New column sort
      sortState.value = { field: column.key, order: 'asc' }
    }
  }
  
  function getFieldValue(row: any, column: Column): any {
    if (typeof column.field === 'function') {
      return column.field(row)
    }
    if (typeof column.field === 'string') {
      return row[column.field]
    }
    return row[column.key]
  }
  
  function clearSort() {
    sortState.value = null
  }
  
  return {
    sortState,
    sortedData,
    handleSort,
    clearSort
  }
}