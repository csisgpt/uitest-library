// composables/useTableCrud.ts
import { ref, reactive, computed, Ref } from 'vue'
import type { CrudConfig, Column } from '../types'

export interface CrudOptions {
  config: CrudConfig
  data: Ref<any[]>
  selectedRows: Ref<any[]>
  columns: Column[]
}

export function useTableCrud(options: CrudOptions) {
  const loading = ref(false)
  const editingRow = ref<any>(null)
  const editingCell = ref<{ row: any; column: string } | null>(null)
  const formData = reactive<Record<string, any>>({})
  const showCreateModal = ref(false)
  const showEditModal = ref(false)
  const showDeleteConfirm = ref(false)
  const deleteTarget = ref<any>(null)
  
  // Check permissions
  const canCreate = computed(() => {
    if (!options.config.create) return false
    if (typeof options.config.canCreate === 'function') {
      return options.config.canCreate()
    }
    return options.config.canCreate !== false
  })
  
  const canUpdate = computed(() => {
    return (row: any) => {
      if (!options.config.update) return false
      if (typeof options.config.canUpdate === 'function') {
        return options.config.canUpdate(row)
      }
      return options.config.canUpdate !== false
    }
  })
  
  const canDelete = computed(() => {
    return (row: any) => {
      if (!options.config.delete) return false
      if (typeof options.config.canDelete === 'function') {
        return options.config.canDelete(row)
      }
      return options.config.canDelete !== false
    }
  })
  
  // API helper
  async function apiCall(url: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.config.api?.headers,
      ...options.headers
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }
  
  // CRUD Operations
  async function fetchData(params?: any) {
    if (!options.config.api?.endpoints?.list) return
    
    loading.value = true
    try {
      const endpoint = typeof options.config.api.endpoints.list === 'function'
        ? options.config.api.endpoints.list(params)
        : options.config.api.endpoints.list
      
      const url = `${options.config.api.baseUrl || ''}${endpoint}`
      const response = await apiCall(url, { method: 'GET' })
      
      const data = options.config.api?.transformResponse
        ? options.config.api.transformResponse(response)
        : response
      
      options.data.value = data
    } catch (error) {
      handleError('fetch', error)
    } finally {
      loading.value = false
    }
  }
  
  async function createRow(data?: any) {
    if (!canCreate.value) return
    
    if (options.config.mode === 'inline') {
      const newRow = createEmptyRow()
      options.data.value.unshift(newRow)
      editingRow.value = newRow
    } else {
      Object.assign(formData, createEmptyRow())
      showCreateModal.value = true
    }
  }
  
  async function saveCreate(data: any) {
    loading.value = true
    try {
      // Before hook
      if (options.config.beforeCreate) {
        data = await options.config.beforeCreate(data)
        if (!data) return
      }
      
      // Transform request
      if (options.config.api?.transformRequest) {
        data = options.config.api.transformRequest(data)
      }
      
      // API call
      if (options.config.api?.endpoints?.create) {
        const url = `${options.config.api.baseUrl || ''}${options.config.api.endpoints.create}`
        const response = await apiCall(url, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        
        // After hook
        if (options.config.afterCreate) {
          await options.config.afterCreate(response)
        }
        
        // Update local data
        if (options.config.mode === 'inline' && editingRow.value) {
          const index = options.data.value.indexOf(editingRow.value)
          if (index !== -1) {
            options.data.value[index] = response
          }
        } else {
          options.data.value.unshift(response)
        }
        
        // Show success message
        if (options.config.successMessage) {
          console.log('رکورد با موفقیت ایجاد شد')
        }
      }
      
      // Reset
      editingRow.value = null
      showCreateModal.value = false
      resetFormData()
      
    } catch (error) {
      handleError('create', error)
      
      // Remove the empty row if inline mode
      if (options.config.mode === 'inline' && editingRow.value) {
        const index = options.data.value.indexOf(editingRow.value)
        if (index !== -1) {
          options.data.value.splice(index, 1)
        }
      }
    } finally {
      loading.value = false
    }
  }
  
  async function editRow(row: any) {
    if (!canUpdate.value(row)) return
    
    if (options.config.mode === 'inline') {
      editingRow.value = row
      Object.assign(formData, { ...row })
    } else {
      Object.assign(formData, { ...row })
      showEditModal.value = true
    }
  }
  
  async function editCell(row: any, column: string) {
    if (!canUpdate.value(row)) return
    
    const col = options.columns.find(c => c.key === column)
    if (!col?.editable) return
    
    editingCell.value = { row, column }
  }
  
  async function saveEdit(id: any, data: any) {
    loading.value = true
    try {
      // Before hook
      if (options.config.beforeUpdate) {
        data = await options.config.beforeUpdate(id, data)
        if (!data) return
      }
      
      // Transform request
      if (options.config.api?.transformRequest) {
        data = options.config.api.transformRequest(data)
      }
      
      // API call
      if (options.config.api?.endpoints?.update) {
        const endpoint = typeof options.config.api.endpoints.update === 'function'
          ? options.config.api.endpoints.update(id)
          : `${options.config.api.endpoints.update}/${id}`
        
        const url = `${options.config.api.baseUrl || ''}${endpoint}`
        const response = await apiCall(url, {
          method: 'PUT',
          body: JSON.stringify(data)
        })
        
        // After hook
        if (options.config.afterUpdate) {
          await options.config.afterUpdate(response)
        }
        
        // Update local data
        const index = options.data.value.findIndex(
          item => getRowKey(item) === id
        )
        if (index !== -1) {
          options.data.value[index] = response
        }
        
        // Show success message
        if (options.config.successMessage) {
          console.log('رکورد با موفقیت ویرایش شد')
        }
      }
      
      // Reset
      editingRow.value = null
      editingCell.value = null
      showEditModal.value = false
      resetFormData()
      
    } catch (error) {
      handleError('update', error)
    } finally {
      loading.value = false
    }
  }
  
  async function deleteRow(row: any) {
    if (!canDelete.value(row)) return
    
    deleteTarget.value = row
    
    if (options.config.confirmDelete) {
      showDeleteConfirm.value = true
    } else {
      await performDelete()
    }
  }
  
  async function performDelete() {
    if (!deleteTarget.value) return
    
    loading.value = true
    try {
      const id = getRowKey(deleteTarget.value)
      
      // Before hook
      if (options.config.beforeDelete) {
        const proceed = await options.config.beforeDelete(id)
        if (!proceed) return
      }
      
      // API call
      if (options.config.api?.endpoints?.delete) {
        const endpoint = typeof options.config.api.endpoints.delete === 'function'
          ? options.config.api.endpoints.delete(id)
          : `${options.config.api.endpoints.delete}/${id}`
        
        const url = `${options.config.api.baseUrl || ''}${endpoint}`
        const response = await apiCall(url, { method: 'DELETE' })
        
        // After hook
        if (options.config.afterDelete) {
          await options.config.afterDelete(response)
        }
        
        // Remove from local data
        const index = options.data.value.findIndex(
          item => getRowKey(item) === id
        )
        if (index !== -1) {
          options.data.value.splice(index, 1)
        }
        
        // Show success message
        if (options.config.successMessage) {
          console.log('رکورد با موفقیت حذف شد')
        }
      }
      
      // Reset
      showDeleteConfirm.value = false
      deleteTarget.value = null
      
    } catch (error) {
      handleError('delete', error)
    } finally {
      loading.value = false
    }
  }
  
  async function batchDelete() {
    if (!options.config.batchDelete || options.selectedRows.value.length === 0) return
    
    if (options.config.confirmDelete) {
      showDeleteConfirm.value = true
    } else {
      await performBatchDelete()
    }
  }
  
  async function performBatchDelete() {
    loading.value = true
    try {
      const ids = options.selectedRows.value.map(row => getRowKey(row))
      
      // API call
      if (options.config.api?.endpoints?.batchDelete) {
        const url = `${options.config.api.baseUrl || ''}${options.config.api.endpoints.batchDelete}`
        const response = await apiCall(url, {
          method: 'DELETE',
          body: JSON.stringify({ ids })
        })
        
        // Remove from local data
        options.data.value = options.data.value.filter(
          item => !ids.includes(getRowKey(item))
        )
        
        // Clear selection
        options.selectedRows.value = []
        
        // Show success message
        if (options.config.successMessage) {
          console.log(`${ids.length} رکورد با موفقیت حذف شد`)
        }
      }
      
      showDeleteConfirm.value = false
      
    } catch (error) {
      handleError('batchDelete', error)
    } finally {
      loading.value = false
    }
  }
  
  // Helper functions
  function createEmptyRow() {
    const row: Record<string, any> = {}
    
    options.columns.forEach(col => {
      if (col.field) {
        const fieldName = typeof col.field === 'string' ? col.field : col.key
        
        // Set default values based on type
        switch (col.type) {
          case 'boolean':
            row[fieldName] = false
            break
          case 'number':
          case 'currency':
          case 'percent':
            row[fieldName] = 0
            break
          case 'array':
          case 'tags':
            row[fieldName] = []
            break
          case 'date':
          case 'datetime':
          case 'jalali':
            row[fieldName] = null
            break
          case 'enum':
            row[fieldName] = col.typeOptions?.options?.[0]?.value || null
            break
          default:
            row[fieldName] = ''
        }
      }
    })
    
    return row
  }
  
  function getRowKey(row: any): string | number {
    if (typeof options.config.api?.rowKey === 'function') {
      return options.config.api.rowKey(row)
    }
    if (typeof options.config.api?.rowKey === 'string') {
      return row[options.config.api.rowKey]
    }
    return row.id || row._id || row.key
  }
  
  function resetFormData() {
    Object.keys(formData).forEach(key => {
      delete formData[key]
    })
  }
  
  function handleError(operation: string, error: any) {
    console.error(`Error in ${operation}:`, error)
    
    if (options.config.errorMessage) {
      const message = error.message || 'خطایی رخ داده است'
      console.error(message)
    }
  }
  
  function cancelEdit() {
    editingRow.value = null
    editingCell.value = null
    showEditModal.value = false
    resetFormData()
    
    // Remove empty row if it was for create
    if (options.config.mode === 'inline') {
      const emptyRowIndex = options.data.value.findIndex(
        row => !getRowKey(row)
      )
      if (emptyRowIndex !== -1) {
        options.data.value.splice(emptyRowIndex, 1)
      }
    }
  }
  
  function cancelDelete() {
    showDeleteConfirm.value = false
    deleteTarget.value = null
  }
  
  return {
    // State
    loading,
    editingRow,
    editingCell,
    formData,
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    deleteTarget,
    
    // Permissions
    canCreate,
    canUpdate,
    canDelete,
    
    // Operations
    fetchData,
    createRow,
    saveCreate,
    editRow,
    editCell,
    saveEdit,
    deleteRow,
    performDelete,
    batchDelete,
    performBatchDelete,
    
    // Utils
    cancelEdit,
    cancelDelete
  }
}