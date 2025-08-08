<!-- AdvancedDataTable.vue - Reusable data table component -->
<template>
  <div :class="styles.root">
    <table :class="styles.table">
      <thead>
        <TableHeader :columns="columns" :sort-state="sortState" @sort="onSort" />
        <TableFilters v-if="hasFilters" :columns="columns" :model="filters" @filter="onFilter" />
      </thead>
      <TableBody
        :columns="columns"
        :rows="paginatedData"
        :loading="loading"
        :empty="!loading && paginatedData.length === 0"
        :selection-mode="selectionMode"
        :model-value="selection"
        @update:modelValue="onSelection"
        v-slots="$slots"
      />
    </table>
    <TableFooter
      v-if="paginationState"
      :pagination="paginationState"
      @update:pagination="onPagination"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import styles from './AdvancedDataTable.module.css';
import type {
  Column,
  Pagination,
  SelectionMode,
  SortState,
  FilterModel,
} from './types';
import TableHeader from './components/TableHeader.vue';
import TableBody from './components/TableBody.vue';
import TableFooter from './components/TableFooter.vue';
import TableFilters from './components/TableFilters.vue';

const props = defineProps<{
  columns: Column[];
  data: any[];
  pagination?: Pagination;
  selectionMode?: SelectionMode;
  modelValue?: any[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void;
  (e: 'update:pagination', value: Pagination): void;
  (e: 'sort', value: SortState): void;
  (e: 'filter', value: FilterModel): void;
}>();

const sortState = ref<SortState | null>(null);
const filters = ref<FilterModel>({});

const selection = ref<any[]>(props.modelValue ?? []);
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

const filteredData = computed(() => {
  if (!Object.keys(filters.value).length) return props.data;
  return props.data.filter(row => {
    return Object.entries(filters.value).every(([field, value]) => {
      if (value == null || value === '') return true;
      const cell = row[field as keyof typeof row];
      return String(cell ?? '')
        .toLowerCase()
        .includes(String(value).toLowerCase());
    });
  });
});

const sortedData = computed(() => {
  if (!sortState.value) return filteredData.value;
  const { field, order } = sortState.value;
  return [...filteredData.value].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av == null) return -1;
    if (bv == null) return 1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return order === 'asc' ? av - bv : bv - av;
    }
    return order === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });
});

const paginatedData = computed(() => {
  if (!paginationState.value) return sortedData.value;
  const start = (paginationState.value.page - 1) * paginationState.value.pageSize;
  const end = start + paginationState.value.pageSize;
  return sortedData.value.slice(start, end);
});

watch(
  sortedData,
  val => {
    if (paginationState.value) {
      paginationState.value.total = val.length;
    }
  },
  { immediate: true }
);

const hasFilters = computed(() => props.columns.some(c => c.filterable));

function onSort(field: string) {
  if (sortState.value && sortState.value.field === field) {
    sortState.value.order = sortState.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.value = { field, order: 'asc' };
  }
  emit('sort', sortState.value);
}

function onFilter(model: FilterModel) {
  filters.value = model;
  emit('filter', model);
}

function onPagination(pag: Pagination) {
  paginationState.value = pag;
  emit('update:pagination', pag);
}

function onSelection(val: any[]) {
  selection.value = val;
  emit('update:modelValue', val);
}
</script>
