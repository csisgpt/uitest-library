// composables/useTablePagination.ts
import { ref, computed, Ref } from 'vue'
import type { PaginationConfig } from '../types'

export function useTablePagination(
  data: Ref<any[]>, 
  paginationProp: boolean | PaginationConfig | undefined
) {
  const currentPage = ref(1)
  const pageSize = ref(10)
  
  // Initialize from props
  if (typeof paginationProp === 'object') {
    currentPage.value = paginationProp.current || 1
    pageSize.value = paginationProp.pageSize || 10
  }
  
  const total = computed(() => data.value.length)
  
  const totalPages = computed(() => 
    Math.ceil(total.value / pageSize.value)
  )
  
  const paginatedData = computed(() => {
    if (!paginationProp) return data.value
    
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    
    return data.value.slice(start, end)
  })
  
  const paginationInfo = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value + 1
    const end = Math.min(currentPage.value * pageSize.value, total.value)
    
    return {
      start,
      end,
      total: total.value,
      current: currentPage.value,
      pageSize: pageSize.value,
      totalPages: totalPages.value
    }
  })
  
  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }
  
  function handlePageSizeChange(size: number) {
    pageSize.value = size
    // Reset to first page when page size changes
    currentPage.value = 1
  }
  
  function goToFirstPage() {
    currentPage.value = 1
  }
  
  function goToLastPage() {
    currentPage.value = totalPages.value
  }
  
  function goToPrevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }
  
  function goToNextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }
  
  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    paginatedData,
    paginationInfo,
    handlePageChange,
    handlePageSizeChange,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage
  }
}