import type { VNode, CSSProperties, Component } from "vue";
export type ColumnType = "string" | "number" | "currency" | "percent" | "boolean" | "date" | "datetime" | "jalali" | "enum" | "file" | "image" | "array" | "json" | "html" | "email" | "phone" | "url" | "color" | "rating" | "progress" | "tags" | "status" | "custom";
export interface TypeOptions {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    dateFormat?: string;
    jalaliFormat?: string;
    showTime?: boolean;
    timeFormat?: string;
    options?: Array<{
        label: string;
        value: any;
        color?: string;
        icon?: string | Component;
        disabled?: boolean;
    }>;
    multiple?: boolean;
    accept?: string;
    maxSize?: number;
    preview?: boolean;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    separator?: string;
    maxItems?: number;
    trueLabel?: string;
    falseLabel?: string;
    trueColor?: string;
    falseColor?: string;
    statusMap?: Record<string, {
        label: string;
        color: string;
        icon?: string | Component;
        variant?: "solid" | "outline" | "ghost";
    }>;
    allowHalf?: boolean;
    showLabel?: boolean;
    strokeWidth?: number;
    tagColors?: string[] | ((tag: string) => string);
    maxTags?: number;
}
export interface EditOptions {
    component?: Component | string;
    props?: Record<string, any>;
    placeholder?: string;
    clearable?: boolean;
    readonly?: boolean;
    disabled?: boolean | ((row: any) => boolean);
    trigger?: "click" | "dblclick" | "manual";
    submitOnBlur?: boolean;
    cancelOnEsc?: boolean;
}
export interface ValidationRule {
    validator: (value: any, row?: any) => boolean | Promise<boolean>;
    message: string;
}
export interface CellRenderProps<T = any> {
    value: any;
    row: T;
    column: Column<T>;
    rowIndex: number;
    columnIndex: number;
}
export interface EditCellProps<T = any> extends CellRenderProps<T> {
    editing: boolean;
    save: (value: any) => void;
    cancel: () => void;
}
interface Column<T = any> {
    key: string;
    label: string;
    field?: string | ((row: T) => any);
    type?: ColumnType;
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
    align?: "left" | "center" | "right";
    ellipsis?: boolean;
    tooltip?: boolean | ((value: any, row: T) => string);
    typeOptions?: TypeOptions;
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
    resizable?: boolean;
    fixed?: "left" | "right";
    hidden?: boolean;
    exportable?: boolean;
    editable?: boolean | ((row: T) => boolean);
    editType?: "inline" | "popup" | "drawer";
    editOptions?: EditOptions;
    rules?: ValidationRule[];
    required?: boolean;
    format?: (value: any, row: T) => string;
    parse?: (value: string) => any;
    render?: (props: CellRenderProps<T>) => VNode;
    editRender?: (props: EditCellProps<T>) => VNode;
    headerRender?: () => VNode;
    className?: string | ((value: any, row: T) => string);
    cellStyle?: CSSProperties | ((value: any, row: T) => CSSProperties);
}
export interface CrudActionConfig {
    enabled: boolean;
    label?: string;
    icon?: string | Component;
    color?: string;
    position?: "toolbar" | "row" | "both";
    handler?: (row?: any) => void | Promise<void>;
}
interface CrudConfig {
    enabled: boolean;
    mode?: "inline" | "modal" | "drawer" | "page";
    create?: boolean | CrudActionConfig;
    read?: boolean | CrudActionConfig;
    update?: boolean | CrudActionConfig;
    delete?: boolean | CrudActionConfig;
    batchDelete?: boolean;
    batchUpdate?: boolean;
    api?: {
        baseUrl?: string;
        endpoints?: {
            list?: string | ((params: any) => string);
            create?: string;
            read?: string | ((id: any) => string);
            update?: string | ((id: any) => string);
            delete?: string | ((id: any) => string);
            batchDelete?: string;
        };
        headers?: Record<string, string>;
        transformRequest?: (data: any) => any;
        transformResponse?: (response: any) => any;
        rowKey?: string | ((row: any) => string | number);
    };
    beforeCreate?: (data: any) => Promise<any> | any;
    afterCreate?: (response: any) => void;
    beforeUpdate?: (id: any, data: any) => Promise<any> | any;
    afterUpdate?: (response: any) => void;
    beforeDelete?: (id: any) => Promise<boolean> | boolean;
    afterDelete?: (response: any) => void;
    confirmDelete?: boolean;
    confirmDeleteMessage?: string | ((row: any) => string);
    successMessage?: boolean;
    errorMessage?: boolean;
    canCreate?: boolean | (() => boolean);
    canUpdate?: boolean | ((row: any) => boolean);
    canDelete?: boolean | ((row: any) => boolean);
}
export interface RowAction<T = any> {
    label: string;
    icon?: string | Component;
    color?: string;
    show?: boolean | ((row: T) => boolean);
    disabled?: boolean | ((row: T) => boolean);
    handler: (row: T) => void | Promise<void>;
}
export interface ToolbarAction {
    label: string;
    icon?: string | Component;
    color?: string;
    position?: "left" | "right";
    show?: boolean | (() => boolean);
    disabled?: boolean | (() => boolean);
    handler: () => void | Promise<void>;
}
interface SortConfig {
    field: string;
    order: "asc" | "desc" | null;
}
interface FilterConfig {
    field: string;
    value: any;
    operator?: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "between";
}
interface PaginationConfig {
    current: number;
    pageSize: number;
    total: number;
    pageSizes?: number[];
    layout?: string;
    background?: boolean;
    small?: boolean;
    hideOnSinglePage?: boolean;
}
export interface SelectionConfig {
    type?: "single" | "multiple";
    selectedRowKeys?: (string | number)[];
    onChange?: (keys: (string | number)[], rows: any[]) => void;
}
export interface ExpandConfig {
    expandedRowKeys?: (string | number)[];
    defaultExpandAll?: boolean;
    onChange?: (keys: (string | number)[]) => void;
    rowExpandable?: (row: any) => boolean;
}
export interface SummaryMethodParams<T = any> {
    columns: Column<T>[];
    data: T[];
}
export interface SpanMethodParams<T = any> {
    row: T;
    column: Column<T>;
    rowIndex: number;
    columnIndex: number;
}
interface TableProps<T = any> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    height?: number | string;
    maxHeight?: number | string;
    stripe?: boolean;
    border?: boolean;
    size?: "small" | "medium" | "large";
    showHeader?: boolean;
    highlightCurrentRow?: boolean;
    emptyText?: string;
    rowKey?: string | ((row: T) => string | number);
    rowClassName?: string | ((row: T, index: number) => string);
    rowStyle?: CSSProperties | ((row: T, index: number) => CSSProperties);
    defaultExpandAll?: boolean;
    expandRowKeys?: (string | number)[];
    lazy?: boolean;
    load?: (row: T, resolve: Function) => void;
    treeProps?: {
        children: string;
        hasChildren: string;
    };
    showSummary?: boolean;
    sumText?: string;
    summaryMethod?: (params: SummaryMethodParams<T>) => any[];
    spanMethod?: (params: SpanMethodParams<T>) => [number, number] | void;
    selectable?: boolean;
    selectOnRowClick?: boolean;
    selectionType?: "single" | "multiple";
    selectedRowKeys?: (string | number)[];
    pagination?: boolean | PaginationConfig;
    virtual?: boolean;
    itemHeight?: number;
    overscan?: number;
    stickyHeader?: boolean;
    stickyColumn?: boolean;
    theme?: "light" | "dark" | "auto";
    variant?: "default" | "bordered" | "striped";
    searchable?: boolean;
    exportable?: boolean;
    resizable?: boolean;
    defaultSort?: SortConfig;
    crud?: boolean | CrudConfig;
    rowActions?: RowAction<T>[];
    toolbarActions?: ToolbarAction[];
}
export type { TableProps, Column, CrudConfig, SortConfig, FilterConfig, PaginationConfig, };
