import { Ref } from 'vue';
import type { PaginationConfig } from '../types';
export declare function useTablePagination(data: Ref<any[]>, paginationProp: boolean | PaginationConfig | undefined): {
    currentPage: Ref<number, number>;
    pageSize: Ref<number, number>;
    total: import("vue").ComputedRef<number>;
    totalPages: import("vue").ComputedRef<number>;
    paginatedData: import("vue").ComputedRef<any[]>;
    paginationInfo: import("vue").ComputedRef<{
        start: number;
        end: number;
        total: number;
        current: number;
        pageSize: number;
        totalPages: number;
    }>;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
    goToPrevPage: () => void;
    goToNextPage: () => void;
};
