<!-- TableHeader.vue - Renders table header cells and handles sorting, resizing, and reordering -->
<template>
  <tr :class="styles.header">
    <th v-if="hasRowExpansion"></th>
    <TableColumnReorder
      v-for="(col, index) in columns"
      :key="col.field"
      :index="index"
      @reorder="onReorder"
      :style="{ width: col.width, textAlign: col.align || 'left', position: 'relative' }"
      :class="{ [styles.sortable]: col.sortable }"
      :tabindex="col.sortable ? 0 : undefined"
      @click="emitSort(col, $event)"
      @keydown.enter.prevent="emitSort(col, $event)"
      @keydown.space.prevent="emitSort(col, $event)"
    >
      <span>{{ col.header }}</span>
      <span v-if="col.sortable">
        <span v-if="currentOrder(col.field)">
          {{ currentOrder(col.field) === 'asc' ? '▲' : '▼' }}
        </span>
        <span v-else>↕</span>
      </span>
      <TableColumnResizer @resize="w => emit('resize', { field: col.field, width: w })" />
    </TableColumnReorder>
  </tr>
</template>

<script setup lang="ts">
import styles from '../AdvancedDataTable.module.css';
import TableColumnResizer from './TableColumnResizer.vue';
import TableColumnReorder from './TableColumnReorder.vue';
import type { Column, SortState } from '../types';

const props = defineProps<{ columns: Column[]; sortState: SortState[]; hasRowExpansion: boolean }>();
const emit = defineEmits<{
  (e: 'sort', payload: { field: string; append: boolean }): void;
  (e: 'resize', payload: { field: string; width: string }): void;
  (e: 'reorder', payload: { from: number; to: number }): void;
}>();

function emitSort(col: Column, evt: MouseEvent | KeyboardEvent) {
  if (col.sortable)
    emit('sort', { field: col.field, append: (evt as MouseEvent).shiftKey });
}

function onReorder(payload: { from: number; to: number }) {
  emit('reorder', payload);
}

function currentOrder(field: string): 'asc' | 'desc' | null {
  const s = props.sortState.find(s => s.field === field);
  return s ? s.order : null;
}
</script>
