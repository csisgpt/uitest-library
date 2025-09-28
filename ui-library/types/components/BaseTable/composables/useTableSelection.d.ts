import type { TableProps } from '../types';
export declare function useTableSelection(props: TableProps, emit: any): {
    selectedRows: import("vue").Ref<any[], any[]>;
    selectedKeys: import("vue").ComputedRef<(string | number)[]>;
    isAllSelected: import("vue").ComputedRef<boolean>;
    isIndeterminate: import("vue").ComputedRef<boolean>;
    handleRowSelect: (row: any) => void;
    handleSelectAll: (checked: boolean) => void;
    clearSelection: () => void;
    selectRows: (rows: any[]) => void;
};
