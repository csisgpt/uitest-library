<!-- TableBody.vue - Renders table body rows and handles selection -->
<template>
  <tbody>
    <tr v-if="loading" :class="styles.loading">
      <td :colspan="colspan">Loading...</td>
    </tr>
    <tr v-else-if="empty" :class="styles.empty">
      <td :colspan="colspan">No records found</td>
    </tr>
    <template v-else>
      <tr
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        :class="[styles.row, { [styles.selected]: isSelected(row) }]"
        tabindex="0"
        @click="toggle(row)"
        @keydown.enter.prevent="toggle(row)"
        @keydown.space.prevent="toggle(row)"
      >
        <td v-if="hasRowExpansion">
          <button type="button" @click.stop="toggleExpand(row)">
            {{ isExpanded(row) ? '-' : '+' }}
          </button>
        </td>
        <td
          v-for="col in columns"
          :key="col.field"
          :class="styles.cell"
          :style="{ textAlign: defaultAlign(col) }"
        >
          <template v-if="slots[`cell-${col.field}`]">
            <component :is="slots[`cell-${col.field}`]" :row="row" :value="row[col.field]" :column="col" />
          </template>
          <template v-else-if="col.type === 'number'">
            {{ formatNumber(row[col.field], undefined, col.formatOptions) }}
          </template>
          <template v-else-if="col.type === 'currency'">
            {{
              formatCurrency(
                row[col.field],
                col.formatOptions?.currency,
                undefined,
                col.formatOptions
              )
            }}
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
      <TableRowExpansion
        v-for="(row, rowIndex) in rows"
        :key="'exp-' + rowIndex"
        :row="row"
        :expanded="isExpanded(row)"
        :colspan="colspan"
        v-slot="{ row: slotRow }"
      >
        <slot name="rowExpansion" :row="slotRow" />
      </TableRowExpansion>
    </template>
  </tbody>
</template>

<script setup lang="ts">
import { ref, watch, useSlots, computed } from 'vue';
import styles from '../AdvancedDataTable.module.css';
import type { Column, SelectionMode, RowExpansionMode } from '../types';
import { formatNumber, formatCurrency, formatDate, formatDateFa, formatBoolean } from '../utils/formatters';

const props = defineProps<{
  columns: Column[];
  rows: any[];
  selectionMode?: SelectionMode;
  modelValue: any[];
  loading?: boolean;
  empty?: boolean;
  expansionMode?: RowExpansionMode;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void;
  (e: 'row-expand', row: any): void;
  (e: 'row-collapse', row: any): void;
}>();
const slots = useSlots();

const selected = ref<any[]>(props.modelValue ?? []);
const expanded = ref<any[]>([]);
const hasRowExpansion = computed(() => !!slots.rowExpansion);
const colspan = computed(() => props.columns.length + (hasRowExpansion.value ? 1 : 0));

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

function isExpanded(row: any): boolean {
  return expanded.value.includes(row);
}

function toggleExpand(row: any) {
  if (isExpanded(row)) {
    expanded.value = expanded.value.filter(r => r !== row);
    emit('row-collapse', row);
  } else {
    expanded.value =
      props.expansionMode === 'single' ? [row] : [...expanded.value, row];
    emit('row-expand', row);
  }
}
</script>
