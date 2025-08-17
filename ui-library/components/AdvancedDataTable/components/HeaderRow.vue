<template>
  <tr :class="styles.headerRow" role="row">
    <th v-if="selectable" role="columnheader" :class="[styles.th, styles.checkboxCell, stickyClass('left', 0)]">
      <BaseCheckbox :modelValue="allSelected" :indeterminate="someSelected" @update:modelValue="emit('toggle:all', $event)" :aria-label="i18n.selectAll" />
    </th>
    <th v-for="(col, ci) in columns" :key="col.id" role="columnheader" scope="col" :aria-sort="ariaSort(col.id)" :style="thStyle(col)" :class="[styles.th, col.sortable && styles.sortable, stickyClass(col.sticky, ci)]" draggable @dragstart="emit('drag:start', col.id)" @drop.prevent="emit('drag:drop', col.id)" @dragover.prevent @click="emit('sort:toggle', col)">
      <slot :name="col.headerSlot || 'header'" :column="col">{{ col.header || col.id }}</slot>
      <span v-if="col.sortable" :class="styles.sortIcon"><BaseIcon :name="sortIcon(col.id)" /></span>
      <span :class="styles.resizer" @mousedown="(e) => emit('resize:start', { e, col })" aria-hidden="true" />
    </th>
    <th v-if="expandable" role="columnheader" :class="[styles.th, styles.checkboxCell, stickyClass('right', columns.length)]"><span class="sr-only">Expand</span></th>
  </tr>
</template>
<script setup lang="ts">
import { BaseCheckbox, BaseIcon } from '../../index';
import styles from '../UltimateDataTable.module.css';
import type { Column, SortState, I18nText } from '../types';
const props = defineProps<{ columns: Column<any>[]; selectable: boolean; expandable: boolean; sort: SortState[]; i18n: I18nText; stickies: (side: any, index: number) => any; thStyle: (c: Column<any>) => any; allSelected: boolean; someSelected: boolean; }>();
const emit = defineEmits<{ (e: 'toggle:all', value: boolean): void; (e: 'sort:toggle', col: Column<any>): void; (e: 'resize:start', payload: { e: MouseEvent; col: Column<any> }): void; (e: 'drag:start', id: string): void; (e: 'drag:drop', id: string): void; }>();
function ariaSort(id: string) { const s = props.sort.find(x => x.id === id); return s ? (s.desc ? 'descending' : 'ascending') : 'none'; }
function sortIcon(id: string) { const s = props.sort.find(x => x.id === id); if (!s) return 'chevrons-up-down'; return s.desc ? 'chevron-down' : 'chevron-up'; }
function stickyClass(side: any, i: number) { return props.stickies(side, i); }
</script>
