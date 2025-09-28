import type { Column, CrudConfig, RowAction } from "../types";
type __VLS_Props = {
    data: any[];
    columns: Column[];
    rowKey?: string | ((row: any) => string | number);
    selectable?: boolean;
    hasActions?: boolean;
    selectedRows: any[];
    editingRow: any;
    editingCell: any;
    crudConfig?: CrudConfig;
    rowActions?: RowAction[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "row-click": (row: any, index: number) => any;
    "row-select": (row: any) => any;
    "cell-edit": (row: any, column: string) => any;
    "cell-save": (row: any, column: Column<any>, value: any) => any;
    "row-edit": (row: any) => any;
    "row-delete": (row: any) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onRow-click"?: ((row: any, index: number) => any) | undefined;
    "onRow-select"?: ((row: any) => any) | undefined;
    "onCell-edit"?: ((row: any, column: string) => any) | undefined;
    "onCell-save"?: ((row: any, column: Column<any>, value: any) => any) | undefined;
    "onRow-edit"?: ((row: any) => any) | undefined;
    "onRow-delete"?: ((row: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
