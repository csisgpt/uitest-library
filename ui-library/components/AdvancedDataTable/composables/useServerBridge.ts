import type { FilterModel, PaginationState, SortState } from '../types';
import { watch } from 'vue';
export function useServerBridge(opts: { enabled: boolean; sort: () => SortState[]; filters: () => FilterModel; pagination: () => PaginationState; global: () => string; emit: (q: { page: number; pageSize: number; sort: SortState[]; filters: FilterModel; global?: string }) => void; }) {
  if (!opts.enabled) return;
  const emitQuery = () => opts.emit({ page: opts.pagination().page, pageSize: opts.pagination().pageSize, sort: opts.sort(), filters: opts.filters(), global: opts.global() });
  watch([opts.sort, opts.filters, opts.pagination, opts.global], () => emitQuery(), { deep: true });
  emitQuery();
}
