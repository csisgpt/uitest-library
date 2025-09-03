// types/index.ts
import type { VNode, CSSProperties, Component } from 'vue'

// Column Data Types
export type ColumnType = 
  | 'string'
  | 'number'
  | 'currency'
  | 'percent'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'jalali'
  | 'enum'
  | 'file'
  | 'image'
  | 'array'
  | 'json'
  | 'html'
  | 'email'
  | 'phone'
  | 'url'
  | 'color'
  | 'rating'
  | 'progress'
  | 'tags'
  | 'status'
  | 'custom'

// Type-specific Options
export interface TypeOptions {
  // Currency Options
  currency?: string
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  
  // Date Options
  dateFormat?: string
  jalaliFormat?: string
  showTime?: boolean
  timeFormat?: string
  
  // Enum Options
  options?: Array<{
    label: string
    value: any
    color?: string
    icon?: string | Component
    disabled?: boolean
  }>
  multiple?: boolean
  
  // File Options
  accept?: string
  maxSize?: number
  preview?: boolean
  
  // Number Options
  min?: number
  max?: number
  step?: number
  precision?: number
  
  // Array Options
  separator?: string
  maxItems?: number
  
  // Boolean Options
  trueLabel?: string
  falseLabel?: string
  trueColor?: string
  falseColor?: string
  
  // Status Options
  statusMap?: Record<string, {
    label: string
    color: string
    icon?: string | Component
    variant?: 'solid' | 'outline' | 'ghost'
  }>
  
  // Rating Options
  allowHalf?: boolean
  
  // Progress Options
  showLabel?: boolean
  strokeWidth?: number
  
  // Tags Options
  tagColors?: string[] | ((tag: string) => string)
  maxTags?: number
}

// Edit Options
export interface EditOptions {
  component?: Component | string
  props?: Record<string, any>
  placeholder?: string
  clearable?: boolean
  readonly?: boolean
  disabled?: boolean | ((row: any) => boolean)
  trigger?: 'click' | 'dblclick' | 'manual'
  submitOnBlur?: boolean
  cancelOnEsc?: boolean
}

// Validation Rule
export interface ValidationRule {
  validator: (value: any, row?: any) => boolean | Promise<boolean>
  message: string
}

// Cell Render Props
export interface CellRenderProps<T = any> {
  value: any
  row: T
  column: Column<T>
  rowIndex: number
  columnIndex: number
}

// Edit Cell Props
export interface EditCellProps<T = any> extends CellRenderProps<T> {
  editing: boolean
  save: (value: any) => void
  cancel: () => void
}

// Column Definition
export interface Column<T = any> {
  key: string
  label: string
  field?: string | ((row: T) => any)
  type?: ColumnType
  
  // Display Options
  width?: number | string
  minWidth?: number
  maxWidth?: number
  align?: 'left' | 'center' | 'right'
  ellipsis?: boolean
  tooltip?: boolean | ((value: any, row: T) => string)
  
  // Type-specific Options
  typeOptions?: TypeOptions
  
  // Features
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  resizable?: boolean
  fixed?: 'left' | 'right'
  hidden?: boolean
  exportable?: boolean
  
  // Edit Options
  editable?: boolean | ((row: T) => boolean)
  editType?: 'inline' | 'popup' | 'drawer'
  editOptions?: EditOptions
  
  // Validation
  rules?: ValidationRule[]
  required?: boolean
  
  // Formatting
  format?: (value: any, row: T) => string
  parse?: (value: string) => any
  
  // Rendering
  render?: (props: CellRenderProps<T>) => VNode
  editRender?: (props: EditCellProps<T>) => VNode
  headerRender?: () => VNode
  
  // Styling
  className?: string | ((value: any, row: T) => string)
  cellStyle?: CSSProperties | ((value: any, row: T) => CSSProperties)
}

// CRUD Action Configuration
export interface CrudActionConfig {
  enabled: boolean
  label?: string
  icon?: string | Component
  color?: string
  position?: 'toolbar' | 'row' | 'both'
  handler?: (row?: any) => void | Promise<void>
}

// CRUD Configuration
export interface CrudConfig {
  enabled: boolean
  mode?: 'inline' | 'modal' | 'drawer' | 'page'
  
  // Actions
  create?: boolean | CrudActionConfig
  read?: boolean | CrudActionConfig
  update?: boolean | CrudActionConfig
  delete?: boolean | CrudActionConfig
  
  // Batch Actions
  batchDelete?: boolean
  batchUpdate?: boolean
  
  // API Configuration
  api?: {
    baseUrl?: string
    endpoints?: {
      list?: string | ((params: any) => string)
      create?: string
      read?: string | ((id: any) => string)
      update?: string | ((id: any) => string)
      delete?: string | ((id: any) => string)
      batchDelete?: string
    }
    headers?: Record<string, string>
    transformRequest?: (data: any) => any
    transformResponse?: (response: any) => any
    rowKey?: string | ((row: any) => string | number)
  }
  
  // Hooks
  beforeCreate?: (data: any) => Promise<any> | any
  afterCreate?: (response: any) => void
  beforeUpdate?: (id: any, data: any) => Promise<any> | any
  afterUpdate?: (response: any) => void
  beforeDelete?: (id: any) => Promise<boolean> | boolean
  afterDelete?: (response: any) => void
  
  // UI Options
  confirmDelete?: boolean
  confirmDeleteMessage?: string | ((row: any) => string)
  successMessage?: boolean
  errorMessage?: boolean
  
  // Permissions
  canCreate?: boolean | (() => boolean)
  canUpdate?: boolean | ((row: any) => boolean)
  canDelete?: boolean | ((row: any) => boolean)
}

// Row Action
export interface RowAction<T = any> {
  label: string
  icon?: string | Component
  color?: string
  show?: boolean | ((row: T) => boolean)
  disabled?: boolean | ((row: T) => boolean)
  handler: (row: T) => void | Promise<void>
}

// Toolbar Action
export interface ToolbarAction {
  label: string
  icon?: string | Component
  color?: string
  position?: 'left' | 'right'
  show?: boolean | (() => boolean)
  disabled?: boolean | (() => boolean)
  handler: () => void | Promise<void>
}

// Sort Configuration
export interface SortConfig {
  field: string
  order: 'asc' | 'desc' | null
}

// Filter Configuration
export interface FilterConfig {
  field: string
  value: any
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between'
}

// Pagination Configuration
export interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
  small?: boolean
  hideOnSinglePage?: boolean
}

// Selection Configuration
export interface SelectionConfig {
  type?: 'single' | 'multiple'
  selectedRowKeys?: (string | number)[]
  onChange?: (keys: (string | number)[], rows: any[]) => void
}

// Expand Configuration
export interface ExpandConfig {
  expandedRowKeys?: (string | number)[]
  defaultExpandAll?: boolean
  onChange?: (keys: (string | number)[]) => void
  rowExpandable?: (row: any) => boolean
}

// Summary Method Params
export interface SummaryMethodParams<T = any> {
  columns: Column<T>[]
  data: T[]
}

// Span Method Params
export interface SpanMethodParams<T = any> {
  row: T
  column: Column<T>
  rowIndex: number
  columnIndex: number
}

// Table Props
export interface TableProps<T = any> {
  // Data
  data: T[]
  columns: Column<T>[]
  
  // Display
  loading?: boolean
  height?: number | string
  maxHeight?: number | string
  stripe?: boolean
  border?: boolean
  size?: 'small' | 'medium' | 'large'
  showHeader?: boolean
  highlightCurrentRow?: boolean
  emptyText?: string
  
  // Row
  rowKey?: string | ((row: T) => string | number)
  rowClassName?: string | ((row: T, index: number) => string)
  rowStyle?: CSSProperties | ((row: T, index: number) => CSSProperties)
  
  // Tree
  defaultExpandAll?: boolean
  expandRowKeys?: (string | number)[]
  lazy?: boolean
  load?: (row: T, resolve: Function) => void
  treeProps?: { children: string; hasChildren: string }
  
  // Summary
  showSummary?: boolean
  sumText?: string
  summaryMethod?: (params: SummaryMethodParams<T>) => any[]
  
  // Span
  spanMethod?: (params: SpanMethodParams<T>) => [number, number] | void
  
  // Selection
  selectable?: boolean
  selectOnRowClick?: boolean
  selectionType?: 'single' | 'multiple'
  selectedRowKeys?: (string | number)[]
  
  // Pagination
  pagination?: boolean | PaginationConfig
  
  // Virtual Scroll
  virtual?: boolean
  itemHeight?: number
  overscan?: number
  
  // Sticky
  stickyHeader?: boolean
  stickyColumn?: boolean
  
  // Theme
  theme?: 'light' | 'dark' | 'auto'
  variant?: 'default' | 'bordered' | 'striped'
  
  // Features
  searchable?: boolean
  exportable?: boolean
  resizable?: boolean
  
  // Sort
  defaultSort?: SortConfig
  
  // CRUD
  crud?: boolean | CrudConfig
  
  // Actions
  rowActions?: RowAction<T>[]
  toolbarActions?: ToolbarAction[]
}

// Export all types
export default {
  TableProps,
  Column,
  CrudConfig,
  SortConfig,
  FilterConfig,
  PaginationConfig
}