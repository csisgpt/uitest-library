<!-- TableBody.vue - Renders table body rows and handles selection -->
<template>
  <tbody>
    <tr v-if="loading" :class="styles.loading">
      <td :colspan="columns.length">Loading...</td>
    </tr>
    <tr v-else-if="empty" :class="styles.empty">
      <td :colspan="columns.length">No records found</td>
    </tr>
    <tr
      v-else
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      :class="[styles.row, { [styles.selected]: isSelected(row) }]"
      @click="toggle(row)"
    >
      <td
        v-for="col in columns"
        :key="col.field"
        :class="styles.cell"
        :style="{ textAlign: defaultAlign(col) }"
      >
        <template v-if="col.type === 'number'">
          {{ formatNumber(row[col.field], undefined, col.formatOptions) }}
        </template>
        <template v-else-if="col.type === 'currency'">
          {{ formatCurrency(row[col.field], col.formatOptions?.currency, undefined, col.formatOptions) }}
        </template>
        <template v-else-if="col.type === 'date'">
          {{ formatDate(row[col.field], undefined, col.formatOptions) }}
        </template>
        <template v-else-if="col.type === 'date-fa'">
          {{ formatDateFa(row[col.field], col.formatOptions) }}
        </template>
        <template v-else-if="col.type === 'boolean'">
          <span :class="styles.boolean">{{ formatBoolean(row[col.field]) }}</span>
        </template>
        <template v-else-if="col.type === 'file'">
          <a v-if="row[col.field]" :href="row[col.field]" download target="_blank">📄</a>
        </template>
        <template
          v-else-if="col.type === 'slot' && col.slotName && slots[col.slotName]"
        >
          <component :is="slots[col.slotName]" :row="row" />
        </template>
        <template v-else>
          {{ row[col.field] }}
        </template>
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
import { ref, watch, useSlots } from 'vue';
import styles from '../BaseDataTable.module.css';
import type { Column, SelectionMode } from '../types';
import { formatNumber, formatCurrency, formatDate, formatDateFa, formatBoolean } from '../utils/formatters';

const props = defineProps<{
  columns: Column[];
  rows: any[];
  selectionMode?: SelectionMode;
  modelValue: any[];
  loading?: boolean;
  empty?: boolean;
}>();

const emit = defineEmits<{ (e: 'update:modelValue', value: any[]): void }>();
const slots = useSlots();

const selected = ref<any[]>(props.modelValue ?? []);

watch(
  () => props.modelValue,
  v => {
    selected.value = v ?? [];
  }
);

function isSelected(row: any): boolean {
  return selected.value.includes(row);
}

function toggle(row: any) {
  if (!props.selectionMode) return;
  let next: any[] = [];
  if (props.selectionMode === 'single') {
    next = isSelected(row) ? [] : [row];
  } else {
    next = isSelected(row)
      ? selected.value.filter(r => r !== row)
      : [...selected.value, row];
  }
  selected.value = next;
  emit('update:modelValue', next);
}

function defaultAlign(col: Column): 'left' | 'right' | 'center' {
  if (col.align) return col.align;
  if (col.type === 'number' || col.type === 'currency') return 'right';
  if (col.type === 'boolean') return 'center';
  return 'left';
}
</script>
