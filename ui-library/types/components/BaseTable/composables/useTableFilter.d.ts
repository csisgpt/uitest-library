import { Ref } from 'vue';
import type { Column, FilterConfig } from '../types';
export declare function useTableFilter(data: Ref<any[]>, columns: Column[]): {
    filters: Ref<{
        field: string;
        value: any;
        operator?: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "between" | undefined;
    }[], FilterConfig[] | {
        field: string;
        value: any;
        operator?: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "between" | undefined;
    }[]>;
    searchQuery: Ref<string, string>;
    filteredData: import("vue").ComputedRef<any[]>;
    handleFilter: (column: Column, value: any, operator?: FilterConfig["operator"]) => void;
    handleSearch: (data: any[], query: string) => any[];
    clearFilters: () => void;
    clearFilter: (field: string) => void;
};
