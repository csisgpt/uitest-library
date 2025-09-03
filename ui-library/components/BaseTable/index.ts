// index.ts
import BaseTable from './BaseTable.vue'

// Export main component
export { BaseTable }
export default BaseTable

// Export types
export * from './types'

// Export composables
export { useTableCrud } from './composables/useTableCrud'
export { useTableSort } from './composables/useTableSort'
export { useTableFilter } from './composables/useTableFilter'
export { useTableSelection } from './composables/useTableSelection'
export { useTablePagination } from './composables/useTablePagination'
export { useTableExport } from './composables/useTableExport'

// Export components
export { default as TableHeader } from './components/TableHeader.vue'
export { default as TableBody } from './components/TableBody.vue'
export { default as TableFooter } from './components/TableFooter.vue'
export { default as TablePagination } from './components/TablePagination.vue'
export { default as TableSearch } from './components/TableSearch.vue'

// Export cell renderers
export { default as StringCell } from './components/renderers/StringCell.vue'
export { default as NumberCell } from './components/renderers/NumberCell.vue'
export { default as CurrencyCell } from './components/renderers/CurrencyCell.vue'
export { default as BooleanCell } from './components/renderers/BooleanCell.vue'
export { default as DateCell } from './components/renderers/DateCell.vue'
export { default as JalaliDateCell } from './components/renderers/JalaliDateCell.vue'
export { default as EnumCell } from './components/renderers/EnumCell.vue'
export { default as FileCell } from './components/renderers/FileCell.vue'
export { default as TagsCell } from './components/renderers/TagsCell.vue'
export { default as StatusCell } from './components/renderers/StatusCell.vue'
export { default as ProgressCell } from './components/renderers/ProgressCell.vue'
export { default as RatingCell } from './components/renderers/RatingCell.vue'