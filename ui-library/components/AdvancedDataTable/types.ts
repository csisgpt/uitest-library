export type ColumnAlign = 'start' | 'center' | 'end';
export type StickySide = 'left' | 'right' | undefined;

export type TextOperator = 'contains' | 'startsWith' | 'endsWith' | 'equals';
export type NumberOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between';
export type DateOperator = 'on' | 'before' | 'after' | 'between';

export type FilterKind = 'text' | 'number' | 'numberRange' | 'date' | 'dateRange' | 'boolean' | 'enum' | 'custom';

export interface BaseFilterConfig { kind: FilterKind; enabled?: boolean; label?: string; }
export interface TextFilterConfig extends BaseFilterConfig { kind: 'text'; operator?: TextOperator; caseSensitive?: boolean; }
export interface NumberFilterConfig extends BaseFilterConfig { kind: 'number'; operator?: NumberOperator; }
export interface NumberRangeFilterConfig extends BaseFilterConfig { kind: 'numberRange'; }
export interface DateFilterConfig extends BaseFilterConfig { kind: 'date'; operator?: DateOperator; format?: string; }
export interface DateRangeFilterConfig extends BaseFilterConfig { kind: 'dateRange'; format?: string; }
export interface BooleanFilterConfig extends BaseFilterConfig { kind: 'boolean'; }
export interface EnumFilterConfig<T = any> extends BaseFilterConfig { kind: 'enum'; options: Array<{ label: string; value: T }>; multiple?: boolean; }
export interface CustomFilterConfig<Value = any> extends BaseFilterConfig { kind: 'custom'; predicate?: (value: Value, row: any) => boolean; }

export type FilterConfig =
  | TextFilterConfig | NumberFilterConfig | NumberRangeFilterConfig
  | DateFilterConfig | DateRangeFilterConfig | BooleanFilterConfig
  | EnumFilterConfig | CustomFilterConfig;

export type FilterValue =
  | string | number | boolean | null | undefined
  | { from?: number | string | Date; to?: number | string | Date }
  | Array<any>;

export type FilterModel = Record<string, FilterValue>;

export interface SortState { id: string; desc?: boolean; priority?: number; }
export interface PaginationState { page: number; pageSize: number; }

export interface Column<Row = any, Value = any> {
  id: string;
  header?: string;
  field?: string;
  accessor?: (row: Row) => Value;
  format?: (value: Value, row: Row) => string;
  align?: ColumnAlign;
  sticky?: StickySide;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  sortComparator?: (a: any, b: any, rowA: Row, rowB: Row) => number;
  filter?: FilterConfig;
  headerSlot?: string;
  cellSlot?: string;
  hideable?: boolean;
  hidden?: boolean;
}

export interface ServerQuery { page: number; pageSize: number; sort: SortState[]; filters: FilterModel; global?: string; }
export type RowKeyGetter<Row = any> = (row: Row, index: number) => string | number;

export interface I18nText {
  loading: string; empty: string; error: string; searchPlaceholder: string; selectAll: string;
}

export interface ExportOptions { filename?: string; sheetName?: string; columns?: string[]; }

// ---- CRUD Types ----
export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'date';
export interface FieldSchema { id: string; type: FieldType; label: string; required?: boolean; placeholder?: string; options?: Array<{ label: string; value: any }>; }
export interface FormSchema { fields: FieldSchema[]; }
export interface CrudHandlers<Row = any> { create?: (payload: Record<string, any>) => Promise<Row>; update?: (row: Row, payload: Record<string, any>) => Promise<Row>; delete?: (row: Row) => Promise<void>; }
