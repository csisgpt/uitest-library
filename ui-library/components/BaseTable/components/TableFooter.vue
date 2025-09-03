<template>
  <tfoot class="base-table__footer" v-if="showSummary">
    <tr>
      <!-- Selection Column -->
      <td v-if="selectable" class="base-table__footer-cell"></td>
      
      <!-- Data Columns -->
      <td
        v-for="(column, index) in columns"
        :key="column.key"
        class="base-table__footer-cell"
        :class="getFooterCellClasses(column)"
        :style="getFooterCellStyle(column)"
      >
        <slot :name="`footer-${column.key}`" :column="column" :summary="summaryData[index]">
          {{ formatSummaryValue(summaryData[index], column) }}
        </slot>
      </td>
      
      <!-- Actions Column -->
      <td v-if="hasActions" class="base-table__footer-cell"></td>
    </tr>
  </tfoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Column, SummaryMethodParams } from '../types'

const props = defineProps<{
  columns: Column[]
  data: any[]
  summaryMethod?: (params: SummaryMethodParams) => any[]
  selectable?: boolean
  hasActions?: boolean
  sumText?: string
}>()

const showSummary = computed(() => {
  return props.summaryMethod || props.columns.some(col => col.showSummary)
})

const summaryData = computed(() => {
  if (props.summaryMethod) {
    return props.summaryMethod({
      columns: props.columns,
      data: props.data
    })
  }
  
  // Default summary calculation
  return props.columns.map((column, index) => {
    if (index === 0) {
      return props.sumText || 'جمع'
    }
    
    if (!column.showSummary) return ''
    
    switch (column.type) {
      case 'number':
      case 'currency':
      case 'percent':
        return calculateSum(column)
      case 'rating':
        return calculateAverage(column)
      default:
        return ''
    }
  })
})

function calculateSum(column: Column): number {
  return props.data.reduce((sum, row) => {
    const value = getFieldValue(row, column)
    return sum + (Number(value) || 0)
  }, 0)
}

function calculateAverage(column: Column): number {
  const sum = calculateSum(column)
  return props.data.length > 0 ? sum / props.data.length : 0
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

function formatSummaryValue(value: any, column: Column): string {
  if (value === '' || value == null) return ''
  
  if (column.format) {
    return column.format(value, {})
  }
  
  switch (column.type) {
    case 'currency':
      const locale = column.typeOptions?.locale || 'fa-IR'
      const currency = column.typeOptions?.currency || 'IRT'
      const formatted = new Intl.NumberFormat(locale).format(value)
      return `${formatted} ${currency === 'IRT' ? 'تومان' : currency}`
      
    case 'percent':
      return `${value.toFixed(2)}%`
      
    case 'rating':
      return value.toFixed(1)
      
    default:
      return String(value)
  }
}

function getFooterCellClasses(column: Column) {
  const classes = []
  
  if (column.align) {
    classes.push(`base-table__footer-cell--${column.align}`)
  }
  
  return classes
}

function getFooterCellStyle(column: Column) {
  const style: any = {}
  
  if (column.width) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  }
  
  return style
}
</script>

<style scoped>
.base-table__footer {
  background: var(--color-surface);
  border-top: 2px solid var(--color-border);
  font-weight: var(--font-weight-bold);
}

.base-table__footer-cell {
  padding: var(--space-md);
  text-align: right;
  color: var(--color-text);
}

.base-table__footer-cell--center {
  text-align: center;
}

.base-table__footer-cell--left {
  text-align: left;
}
</style>