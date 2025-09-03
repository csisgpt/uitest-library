
// composables/useTableFilter.ts
import { ref, computed, Ref } from 'vue'
import type { Column, FilterConfig } from '../types'

export function useTableFilter(data: Ref<any[]>, columns: Column[]) {
  const filters = ref<FilterConfig[]>([])
  const searchQuery = ref('')
  
  const filteredData = computed(() => {
    let result = [...data.value]
    
    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const searchableColumns = columns.filter(col => col.searchable !== false)
      
      result = result.filter(row => {
        return searchableColumns.some(column => {
          const value = getFieldValue(row, column)
          if (value == null) return false
          
          const stringValue = String(value).toLowerCase()
          return stringValue.includes(query)
        })
      })
    }
    
    // Apply column filters
    filters.value.forEach(filter => {
      const column = columns.find(col => col.key === filter.field)
      if (!column) return
      
      result = result.filter(row => {
        const value = getFieldValue(row, column)
        return applyFilter(value, filter)
      })
    })
    
    return result
  })
  
  function handleFilter(column: Column, value: any, operator: FilterConfig['operator'] = 'eq') {
    const existingIndex = filters.value.findIndex(f => f.field === column.key)
    
    if (value === null || value === undefined || value === '') {
      // Remove filter
      if (existingIndex !== -1) {
        filters.value.splice(existingIndex, 1)
      }
    } else {
      // Add or update filter
      const filter: FilterConfig = {
        field: column.key,
        value,
        operator
      }
      
      if (existingIndex !== -1) {
        filters.value[existingIndex] = filter
      } else {
        filters.value.push(filter)
      }
    }
  }
  
  function handleSearch(data: any[], query: string) {
    searchQuery.value = query
    return filteredData.value
  }
  
  function applyFilter(value: any, filter: FilterConfig): boolean {
    const { value: filterValue, operator = 'eq' } = filter
    
    switch (operator) {
      case 'eq':
        return value === filterValue
      case 'ne':
        return value !== filterValue
      case 'gt':
        return value > filterValue
      case 'gte':
        return value >= filterValue
      case 'lt':
        return value < filterValue
      case 'lte':
        return value <= filterValue
      case 'like':
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
      case 'in':
        return Array.isArray(filterValue) ? filterValue.includes(value) : false
      case 'between':
        return Array.isArray(filterValue) && filterValue.length === 2
          ? value >= filterValue[0] && value <= filterValue[1]
          : false
      default:
        return true
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
  
  function clearFilters() {
    filters.value = []
    searchQuery.value = ''
  }
  
  function clearFilter(field: string) {
    const index = filters.value.findIndex(f => f.field === field)
    if (index !== -1) {
      filters.value.splice(index, 1)
    }
  }
  
  return {
    filters,
    searchQuery,
    filteredData,
    handleFilter,
    handleSearch,
    clearFilters,
    clearFilter
  }
}