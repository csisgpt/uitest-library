<!-- TableHeader.vue - Renders table header cells and handles sorting -->
<template>
  <tr :class="styles.header">
    <th
      v-for="col in columns"
      :key="col.field"
      :style="{ width: col.width, textAlign: col.align || 'left' }"
      :class="{ [styles.sortable]: col.sortable }"
      @click="emitSort(col)"
    >
      <span>{{ col.header }}</span>
      <span v-if="col.sortable">
        <span v-if="sortState && sortState.field === col.field">
          {{ sortState.order === 'asc' ? '▲' : '▼' }}
        </span>
        <span v-else>↕</span>
      </span>
    </th>
  </tr>
</template>

<script setup lang="ts">
import styles from '../BaseDataTable.module.css';
import type { Column, SortState } from '../types';

const props = defineProps<{ columns: Column[]; sortState: SortState | null }>();
const emit = defineEmits<{ (e: 'sort', field: string): void }>();

function emitSort(col: Column) {
  if (col.sortable) emit('sort', col.field);
}
</script>
