// composables/useTableExport.ts
import { Ref } from 'vue'
import type { Column } from '../types'

export function useTableExport(data: Ref<any[]>, columns: Column[]) {
  
  function handleExport(format: 'csv' | 'excel' | 'json' = 'csv') {
    const exportableColumns = columns.filter(col => col.exportable !== false)
    
    switch (format) {
      case 'csv':
        exportToCSV(data.value, exportableColumns)
        break
      case 'excel':
        exportToExcel(data.value, exportableColumns)
        break
      case 'json':
        exportToJSON(data.value, exportableColumns)
        break
    }
  }
  
  function exportToCSV(data: any[], columns: Column[]) {
    // Create CSV header
    const headers = columns.map(col => col.label).join(',')
    
    // Create CSV rows
    const rows = data.map(row => {
      return columns.map(col => {
        const value = getFieldValue(row, col)
        const formatted = formatValueForExport(value, col)
        
        // Escape special characters
        if (typeof formatted === 'string' && formatted.includes(',')) {
          return `"${formatted.replace(/"/g, '""')}"`
        }
        return formatted
      }).join(',')
    })
    
    // Combine header and rows
    const csv = [headers, ...rows].join('\n')
    
    // Add BOM for Excel UTF-8 support
    const bom = '\uFEFF'
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
    
    // Download file
    downloadFile(blob, `export_${Date.now()}.csv`)
  }
  
  function exportToExcel(data: any[], columns: Column[]) {
    // For Excel export, you would typically use a library like SheetJS
    // This is a simplified version that creates an HTML table
    let html = '<table border="1">'
    
    // Header
    html += '<thead><tr>'
    columns.forEach(col => {
      html += `<th>${col.label}</th>`
    })
    html += '</tr></thead>'
    
    // Body
    html += '<tbody>'
    data.forEach(row => {
      html += '<tr>'
      columns.forEach(col => {
        const value = getFieldValue(row, col)
        const formatted = formatValueForExport(value, col)
        html += `<td>${formatted}</td>`
      })
      html += '</tr>'
    })
    html += '</tbody></table>'
    
    const blob = new Blob([html], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    })
    
    downloadFile(blob, `export_${Date.now()}.xls`)
  }
  
  function exportToJSON(data: any[], columns: Column[]) {
    const exportData = data.map(row => {
      const exportRow: Record<string, any> = {}
      
      columns.forEach(col => {
        const value = getFieldValue(row, col)
        exportRow[col.key] = formatValueForExport(value, col)
      })
      
      return exportRow
    })
    
    const json = JSON.stringify(exportData, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    
    downloadFile(blob, `export_${Date.now()}.json`)
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
  
  function formatValueForExport(value: any, column: Column): string {
    if (value == null) return ''
    
    // Use column's export format if available
    if (column.format) {
      return column.format(value, {})
    }
    
    // Type-specific formatting
    switch (column.type) {
      case 'boolean':
        return value ? 'بله' : 'خیر'
        
      case 'date':
      case 'datetime':
        return new Date(value).toLocaleDateString('fa-IR')
        
      case 'jalali':
        // Use Persian date formatting
        return new Intl.DateTimeFormat('fa-IR', {
          calendar: 'persian',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date(value))
        
      case 'currency':
        return new Intl.NumberFormat('fa-IR').format(value)
        
      case 'array':
      case 'tags':
        return Array.isArray(value) ? value.join(', ') : String(value)
        
      case 'enum':
        // Return the label if available
        if (column.typeOptions?.options) {
          const option = column.typeOptions.options.find(opt => opt.value === value)
          return option?.label || String(value)
        }
        return String(value)
        
      default:
        return String(value)
    }
  }
  
  function downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(url)
  }
  
  return {
    handleExport,
    exportToCSV,
    exportToExcel,
    exportToJSON
  }
}