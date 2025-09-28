import { Ref } from 'vue';
import type { CrudConfig, Column } from '../types';
export interface CrudOptions {
    config: CrudConfig;
    data: Ref<any[]>;
    selectedRows: Ref<any[]>;
    columns: Column[];
}
export declare function useTableCrud(options: CrudOptions): {
    loading: Ref<boolean, boolean>;
    editingRow: Ref<any, any>;
    editingCell: Ref<{
        row: any;
        column: string;
    } | null, {
        row: any;
        column: string;
    } | {
        row: any;
        column: string;
    } | null>;
    formData: Record<string, any>;
    showCreateModal: Ref<boolean, boolean>;
    showEditModal: Ref<boolean, boolean>;
    showDeleteConfirm: Ref<boolean, boolean>;
    deleteTarget: Ref<any, any>;
    canCreate: import("vue").ComputedRef<boolean>;
    canUpdate: import("vue").ComputedRef<(row: any) => boolean>;
    canDelete: import("vue").ComputedRef<(row: any) => boolean>;
    fetchData: (params?: any) => Promise<void>;
    createRow: (data?: any) => Promise<void>;
    saveCreate: (data: any) => Promise<void>;
    editRow: (row: any) => Promise<void>;
    editCell: (row: any, column: string) => Promise<void>;
    saveEdit: (id: any, data: any) => Promise<void>;
    deleteRow: (row: any) => Promise<void>;
    performDelete: () => Promise<void>;
    batchDelete: () => Promise<void>;
    performBatchDelete: () => Promise<void>;
    cancelEdit: () => void;
    cancelDelete: () => void;
};
