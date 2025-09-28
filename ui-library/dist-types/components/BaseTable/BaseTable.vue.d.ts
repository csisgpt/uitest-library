import type { TableProps, CrudConfig } from "./types";
type __VLS_Props = TableProps;
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "row-click": (row: any, index: number) => any;
    "row-select": (rows: any[]) => any;
    "size-change": (size: number) => any;
    "update:selectedRowKeys": (keys: (string | number)[]) => any;
    "sort-change": (sort: any) => any;
    "filter-change": (filters: any[]) => any;
    "page-change": (page: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onRow-click"?: ((row: any, index: number) => any) | undefined;
    "onRow-select"?: ((rows: any[]) => any) | undefined;
    "onSize-change"?: ((size: number) => any) | undefined;
    "onUpdate:selectedRowKeys"?: ((keys: (string | number)[]) => any) | undefined;
    "onSort-change"?: ((sort: any) => any) | undefined;
    "onFilter-change"?: ((filters: any[]) => any) | undefined;
    "onPage-change"?: ((page: number) => any) | undefined;
}>, {
    variant: "default" | "bordered" | "striped";
    size: "small" | "medium" | "large";
    showHeader: boolean;
    border: boolean;
    selectable: boolean;
    searchable: boolean;
    resizable: boolean;
    exportable: boolean;
    stripe: boolean;
    pagination: boolean | import("./types").PaginationConfig;
    virtual: boolean;
    itemHeight: number;
    overscan: number;
    stickyHeader: boolean;
    stickyColumn: boolean;
    theme: "light" | "dark" | "auto";
    crud: boolean | CrudConfig;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
