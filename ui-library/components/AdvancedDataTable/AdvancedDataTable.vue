<!-- AdvancedDataTable.vue - Reusable data table component -->
<template>
  <div :class="[styles.root, stickyHeader ? styles['sticky-header'] : '', stickyFooter ? styles['sticky-footer'] : '']">
    <template v-if="virtualScroll">
      <TableVirtualScroller :rows="processedData" :row-height="rowHeight" :height="virtualHeight" v-slot="{ rows }">
        <table :class="styles.table" role="table">
          <thead>
            <TableHeader
              :columns="internalColumns"
              :sort-state="sortState"
              :has-row-expansion="hasRowExpansion"
              @sort="onSort"
              @resize="onColumnResize"
              @reorder="onColumnReorder"
            />
            <TableFilters
              v-if="hasFilters"
              :columns="internalColumns"
              :model="filters"
              :has-row-expansion="hasRowExpansion"
              @filter="onFilter"
            />
          </thead>
          <TableBody
            :columns="internalColumns"
            :rows="rows"
            :loading="loading"
            :empty="!loading && rows.length === 0"
            :selection-mode="selectionMode"
            :model-value="selection"
            :expansion-mode="expansionMode"
            @update:modelValue="onSelection"
            @row-expand="onRowExpand"
            @row-collapse="onRowCollapse"
            v-slots="$slots"
          />
        </table>
      </TableVirtualScroller>
    </template>
    <template v-else>
      <table :class="styles.table" role="table">
        <thead>
          <TableHeader
            :columns="internalColumns"
            :sort-state="sortState"
            :has-row-expansion="hasRowExpansion"
            @sort="onSort"
            @resize="onColumnResize"
            @reorder="onColumnReorder"
          />
          <TableFilters
            v-if="hasFilters"
            :columns="internalColumns"
            :model="filters"
            :has-row-expansion="hasRowExpansion"
            @filter="onFilter"
          />
        </thead>
        <TableBody
          :columns="internalColumns"
          :rows="paginatedData"
          :loading="loading"
          :empty="!loading && paginatedData.length === 0"
          :selection-mode="selectionMode"
          :model-value="selection"
          :expansion-mode="expansionMode"
          @update:modelValue="onSelection"
          @row-expand="onRowExpand"
          @row-collapse="onRowCollapse"
          v-slots="$slots"
        />
      </table>
    </template>
    <TableFooter
      v-if="paginationState"
      :pagination="paginationState"
      :class="stickyFooter ? styles['sticky-footer'] : ''"
      @update:pagination="onPagination"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue';
import styles from './AdvancedDataTable.module.css';
import type {
  Column,
  Pagination,
  SelectionMode,
  SortState,
  FilterModel,
  RowExpansionMode,
  LazyLoadEvent,
  ServerRequestQuery,
  DataTableColumnSlotProps,
} from './types';
import TableHeader from './components/TableHeader.vue';
import TableBody from './components/TableBody.vue';
import TableFooter from './components/TableFooter.vue';
import TableFilters from './components/TableFilters.vue';
import TableVirtualScroller from './components/TableVirtualScroller.vue';
import { exportCSV, exportExcel } from './utils/exportUtils';
import { applyFilters } from './utils/filterUtils';

const props = defineProps<{
  columns: Column[];
  data: any[];
  pagination?: Pagination;
  selectionMode?: SelectionMode;
  modelValue?: any[];
  loading?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  virtualScroll?: boolean;
  lazy?: boolean;
  expansionMode?: RowExpansionMode;
  serverMode?: boolean;
  exportFilename?: string;
  exportSheetName?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void;
  (e: 'update:pagination', value: Pagination): void;
  (e: 'sort', value: SortState[]): void;
  (e: 'filter', value: FilterModel): void;
  (e: 'row-expand', row: any): void;
  (e: 'row-collapse', row: any): void;
  (e: 'column-resize', widths: Record<string, string | undefined>): void;
  (e: 'column-reorder', columns: Column[]): void;
  (e: 'lazy-load', evt: LazyLoadEvent): void;
  (e: 'server-request', query: ServerRequestQuery): void;
  (e: 'edit', payload: DataTableColumnSlotProps): void;
  (e: 'delete', payload: DataTableColumnSlotProps): void;
  (e: 'add'): void;
}>();

const sortState = ref<SortState[]>([]);
const filters = ref<FilterModel>({});

const selection = ref<any[]>(props.modelValue ?? []);
const expandedRows = ref<any[]>([]);
const slots = useSlots();
watch(
  () => props.modelValue,
  v => {
    selection.value = v ?? [];
  }
);

const paginationState = ref<Pagination | undefined>(
  props.pagination ? { ...props.pagination } : undefined
);
watch(
  () => props.pagination,
  v => {
    paginationState.value = v ? { ...v } : undefined;
  },
  { deep: true }
);

const internalColumns = ref<Column[]>([...props.columns]);
watch(
  () => props.columns,
  v => {
    internalColumns.value = [...v];
  },
  { deep: true }
);

const hasRowExpansion = computed(() => !!slots.rowExpansion);

const filteredData = computed(() => {
  if (props.lazy) return props.data;
  return applyFilters(props.data, filters.value, internalColumns.value);
});

const sortedData = computed(() => {
  if (props.lazy) return filteredData.value;
  if (!sortState.value.length) return filteredData.value;
  return [...filteredData.value].sort((a, b) => {
    for (const s of sortState.value) {
      const av = a[s.field];
      const bv = b[s.field];
      if (av == null && bv == null) continue;
      if (av == null) return -1;
      if (bv == null) return 1;
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv));
      }
      if (cmp !== 0) return s.order === 'asc' ? cmp : -cmp;
    }
    return 0;
  });
});

const paginatedData = computed(() => {
  if (props.virtualScroll) return sortedData.value;
  if (!paginationState.value) return sortedData.value;
  const start = (paginationState.value.page - 1) * paginationState.value.pageSize;
  const end = start + paginationState.value.pageSize;
  return sortedData.value.slice(start, end);
});

watch(
  sortedData,
  val => {
    if (paginationState.value && !props.lazy) {
      paginationState.value.total = val.length;
    }
  },
  { immediate: true }
);

const hasFilters = computed(() => internalColumns.value.some(c => c.filterable));

function onSort(payload: { field: string; append: boolean }) {
  const idx = sortState.value.findIndex(s => s.field === payload.field);
  if (idx >= 0) {
    sortState.value[idx].order = sortState.value[idx].order === 'asc' ? 'desc' : 'asc';
    if (!payload.append) sortState.value = [sortState.value[idx]];
  } else {
    sortState.value = payload.append
      ? [...sortState.value, { field: payload.field, order: 'asc' }]
      : [{ field: payload.field, order: 'asc' }];
  }
  emit('sort', sortState.value);
  if (props.lazy) emitLazy();
  if (props.serverMode) emitServerRequest();
}

function onFilter(model: FilterModel) {
  filters.value = model;
  emit('filter', model);
  if (props.lazy) emitLazy();
  if (props.serverMode) emitServerRequest();
}

function onPagination(pag: Pagination) {
  paginationState.value = pag;
  emit('update:pagination', pag);
  if (props.lazy) emitLazy();
  if (props.serverMode) emitServerRequest();
}

function onSelection(val: any[]) {
  selection.value = val;
  emit('update:modelValue', val);
}

function onColumnResize(payload: { field: string; width: string }) {
  const col = internalColumns.value.find(c => c.field === payload.field);
  if (col) col.width = payload.width;
  const widths = Object.fromEntries(
    internalColumns.value.map(c => [c.field, c.width])
  );
  emit('column-resize', widths);
}

function onColumnReorder(payload: { from: number; to: number }) {
  const cols = internalColumns.value;
  const [moved] = cols.splice(payload.from, 1);
  cols.splice(payload.to, 0, moved);
  internalColumns.value = [...cols];
  emit('column-reorder', internalColumns.value);
}

function onRowExpand(row: any) {
  if (!expandedRows.value.includes(row)) expandedRows.value.push(row);
  emit('row-expand', row);
  if (props.serverMode) emitServerRequest();
}

function onRowCollapse(row: any) {
  expandedRows.value = expandedRows.value.filter(r => r !== row);
  emit('row-collapse', row);
  if (props.serverMode) emitServerRequest();
}

function emitLazy() {
  const evt: LazyLoadEvent = {
    page: paginationState.value?.page || 1,
    pageSize: paginationState.value?.pageSize || props.data.length,
    sort: sortState.value,
    filters: filters.value,
  };
  emit('lazy-load', evt);
}

function emitServerRequest() {
  const query: ServerRequestQuery = {
    page: paginationState.value?.page || 1,
    pageSize: paginationState.value?.pageSize || props.data.length,
    sort: sortState.value,
    filters: filters.value,
    expandedRows: [...expandedRows.value],
  };
  emit('server-request', query);
}

const rowHeight = 40;
const virtualHeight = 400;
const processedData = computed(() => paginatedData.value);

type ExportMode = 'current' | 'filtered' | 'all';

function getExportData(mode: ExportMode) {
  switch (mode) {
    case 'all':
      return props.data;
    case 'filtered':
      return sortedData.value;
    default:
      return paginatedData.value;
  }
}

function exportCSVFn(mode: ExportMode = 'current') {
  exportCSV(
    internalColumns.value,
    getExportData(mode),
    props.exportFilename || 'export.csv'
  );
}

function exportExcelFn(mode: ExportMode = 'current') {
  exportExcel(
    internalColumns.value,
    getExportData(mode),
    props.exportFilename?.replace(/\.csv$/i, '.xls') || 'export.xls',
    props.exportSheetName || 'Sheet1'
  );
}

defineExpose({ exportCSV: exportCSVFn, exportExcel: exportExcelFn });
</script>
