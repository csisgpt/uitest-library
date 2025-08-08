// types.ts - Interfaces for BaseDataTable component

export interface Column {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'currency' | 'date-fa' | 'date' | 'boolean' | 'file' | 'slot';
  sortable?: boolean;
  filterable?: boolean;
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
