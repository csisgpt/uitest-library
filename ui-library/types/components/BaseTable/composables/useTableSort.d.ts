import { Ref } from 'vue';
import type { Column, SortConfig } from '../types';
export declare function useTableSort(data: Ref<any[]>, columns: Column[]): {
    sortState: Ref<{
        field: string;
        order: "asc" | "desc" | null;
    } | null, SortConfig | {
        field: string;
        order: "asc" | "desc" | null;
    } | null>;
    sortedData: import("vue").ComputedRef<any[]>;
    handleSort: (column: Column) => void;
    clearSort: () => void;
};
