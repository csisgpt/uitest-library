import { Ref } from 'vue';
import type { Column } from '../types';
export declare function useTableExport(data: Ref<any[]>, columns: Column[]): {
    handleExport: (format?: "csv" | "excel" | "json") => void;
    exportToCSV: (data: any[], columns: Column[]) => void;
    exportToExcel: (data: any[], columns: Column[]) => void;
    exportToJSON: (data: any[], columns: Column[]) => void;
};
