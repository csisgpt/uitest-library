import type { Column, SortConfig } from "../types";
type __VLS_Props = {
    columns: Column[];
    sortConfig?: SortConfig | null;
    selectable?: boolean;
    hasActions?: boolean;
    selectedAll?: boolean;
    indeterminate?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    sort: (column: Column<any>) => any;
    filter: (column: Column<any>) => any;
    resize: (column: Column<any>, width: number) => any;
    "select-all": (checked: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSort?: ((column: Column<any>) => any) | undefined;
    onFilter?: ((column: Column<any>) => any) | undefined;
    onResize?: ((column: Column<any>, width: number) => any) | undefined;
    "onSelect-all"?: ((checked: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
