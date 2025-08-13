// types.ts - Interfaces for AdvancedDataTable component

/** Supported column content types */
export type ColumnType =
  | "text"
  | "number"
  | "currency"
  | "date-fa"
  | "date"
  | "boolean"
  | "file"
  | "slot";

/** Supported filter input types */
export type FilterType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "custom";

/** Option type for select filters */
export interface SelectOption {
  label: string;
  value: any;
}

/** Column definition */
export interface Column {
  field: string;
  header: string;
  type?: ColumnType;
  sortable?: boolean;
  filterable?: boolean;

  /** Type of filter input to render for this column */
  filterType?: FilterType;

  /** Options used by select filters (single or multi) */
  filterOptions?: SelectOption[];

  /** Allow multi-select for select filters */
  filterMultiple?: boolean;

  /** Slot name for custom filter rendering */
  filterSlotName?: string;

  width?: string;
  align?: "left" | "center" | "right";

  /** Slot name for custom cell rendering when type is 'slot' */
  slotName?: string;

  /** Extra options for value formatting (currency symbol, date format, etc.) */
  formatOptions?: Record<string, any>;
}

/** Pagination state */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export type SelectionMode = "single" | "multiple" | null;

/** Sorting state for one column */
export interface SortState {
  field: string;
  order: "asc" | "desc";
}

/** Filter model value types */
export type FilterValue =
  | string                              // text, single-select
  | number                              // numeric exact
  | boolean                             // boolean true/false
  | "all"                               // boolean no filter
  | string[]                            // multi-select
  | number[]                            // multi-select numeric
  | { min?: number | null; max?: number | null }  // numeric range
  | { from?: string; to?: string };     // date range

/** Map of field -> filter value */
export type FilterModel = Record<string, FilterValue>;

/** Event payload for lazy loading */
export interface LazyLoadEvent {
  page: number;
  pageSize: number;
  sort: SortState[];
  filters: FilterModel;
}

/** Event payload for server mode requests */
export interface ServerRequestQuery {
  page: number;
  pageSize: number;
  sort: SortState[];
  filters: FilterModel;
  expandedRows: any[];
}

export type RowExpansionMode = "single" | "multiple";

/** Props passed to custom column slots (e.g. action buttons) */
export interface DataTableColumnSlotProps<Row = any> {
  row: Row;
  index: number;
}

/** Props passed to generic cell slots using "cell-<field>" naming */
export interface DataTableCellSlotProps<Row = any, Value = any> {
  row: Row;
  value: Value;
  column: Column;
  index: number;
}

/** Props passed to custom filter slots */
export interface DataTableFilterSlotProps<Value = any> {
  model: Value;
  update: (value: Value) => void;
}
