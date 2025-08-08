// types.ts - Interfaces for AdvancedDataTable component

export interface Column {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'currency' | 'date-fa' | 'date' | 'boolean' | 'file' | 'slot';
  sortable?: boolean;
  filterable?: boolean;
  /** Type of filter input to render for this column */
  filterType?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'custom';
  /** Options used by select filters */
  filterOptions?: Array<{ label: string; value: any }>;
  /** Slot name for custom filter rendering */
  filterSlotName?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  slotName?: string;
  formatOptions?: Record<string, any>;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export type SelectionMode = 'single' | 'multiple' | null;

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

export type FilterModel = Record<string, any>;

export interface LazyLoadEvent {
  page: number;
  pageSize: number;
  sort: SortState[];
  filters: FilterModel;
}

export interface ServerRequestQuery {
  page: number;
  pageSize: number;
  sort: SortState[];
  filters: FilterModel;
  expandedRows: any[];
}

export type RowExpansionMode = 'single' | 'multiple';
