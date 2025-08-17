import { computed, ref, watch } from 'vue';
import type { Column, FilterModel, PaginationState, ServerQuery, SortState } from '../types';
import { get } from '../utils/get';
import { cmp } from '../utils/compare';
import { buildPredicate } from '../utils/filters';

export function useDataPipeline<Row = any>(
  rows: () => Row[], columns: () => Column<Row>[],
  opts: { serverMode?: boolean; globalSearch?: () => string; pagination?: () => PaginationState; sort?: () => SortState[]; filters?: () => FilterModel; rowKey?: (row: Row, i: number) => string | number; } = {}
) {
  const sortState = ref<SortState[]>(opts.sort?.() ?? []);
  const filterState = ref<FilterModel>(opts.filters?.() ?? {});
  const globalQ = ref(opts.globalSearch?.() ?? '');
  const pagination = ref<PaginationState>(opts.pagination?.() ?? { page: 1, pageSize: 10 });

  watch(() => opts.sort?.(), v => { if (v) sortState.value = [...v]; });
  watch(() => opts.filters?.(), v => { if (v) filterState.value = { ...v }; });
  watch(() => opts.globalSearch?.(), v => { if (v !== undefined) globalQ.value = v; });
  watch(() => opts.pagination?.(), v => { if (v) pagination.value = { ...v }; });

  const processed = computed(() => {
    let data = rows(); const cols = columns();
    if (!opts.serverMode) {
      if (globalQ.value?.toString().trim()) {
        const q = globalQ.value.toString().toLowerCase();
        data = data.filter(r => cols.some(c => String((c.accessor ? c.accessor(r) : get(r as any, c.field)) ?? '').toLowerCase().includes(q)));
      }
      const predicate = buildPredicate(cols, filterState.value); data = data.filter(predicate);
      if (sortState.value?.length) {
        const states = [...sortState.value];
        data = [...data].sort((a: any, b: any) => {
          for (const s of states) {
            const c = cols.find(cc => cc.id === s.id); if (!c) continue;
            const av = c.accessor ? c.accessor(a) : get(a, c.field);
            const bv = c.accessor ? c.accessor(b) : get(b, c.field);
            const res = c.sortComparator ? c.sortComparator(av, bv, a, b) : cmp(av, bv);
            if (res !== 0) return s.desc ? -res : res;
          } return 0;
        });
      }
    }
    return data;
  });

  const pageCount = computed(() => Math.max(1, Math.ceil(processed.value.length / pagination.value.pageSize)));
  const pageRows = computed(() => {
    if (opts.serverMode) return rows();
    const start = (pagination.value.page - 1) * pagination.value.pageSize;
    return processed.value.slice(start, start + pagination.value.pageSize);
  });

  function asServerQuery(): ServerQuery {
    return { page: pagination.value.page, pageSize: pagination.value.pageSize, sort: sortState.value, filters: filterState.value, global: globalQ.value };
  }
  function keyOf(row: Row, i: number) { return opts.rowKey ? opts.rowKey(row, i) : (i as any); }
  return { sortState, filterState, globalQ, pagination, processed, pageRows, pageCount, asServerQuery, keyOf };
}
