<template>
  <template v-if="!virtual">
    <tr v-for="(row, ri) in pageRows" :key="keyOf(row, ri + rowStart)" role="row" :class="[styles.row, isSelected(keyOf(row, ri + rowStart)) && styles.selected]" @click="emit('row:click', { row, index: ri + rowStart })">
      <td v-if="selectable" :class="[styles.td, styles.checkboxCell, stickyClass('left', 0)]">
        <BaseCheckbox :modelValue="isSelected(keyOf(row, ri + rowStart))" @update:modelValue="val => emit('row:select', { key: keyOf(row, ri + rowStart), on: val })" :aria-label="`انتخاب ردیف ${ri+1}`" />
      </td>
      <td v-for="(col, ci) in columns" :key="col.id" role="gridcell" :style="tdStyle(col)" :class="[styles.td, stickyClass(col.sticky, ci)]">
        <slot :name="col.cellSlot || ('cell-' + col.id)" :row="row" :value="cellValue(row, col)" :column="col" :index="ri + rowStart">{{ displayValue(row, col) }}</slot>
      </td>
      <td v-if="expandable" :class="[styles.td, styles.checkboxCell, stickyClass('right', columns.length)]">
        <BaseButton size="sm" variant="ghost" @click.stop="emit('row:expand', keyOf(row, ri + rowStart))"><BaseIcon :name="isExpanded(keyOf(row, ri + rowStart)) ? 'chevron-up' : 'chevron-down'" /></BaseButton>
      </td>
    </tr>
    <tr v-if="expandable" v-for="(row, ri) in pageRows" :key="keyOf(row, ri + rowStart) + '-exp'">
      <td :colspan="colspan" v-show="isExpanded(keyOf(row, ri + rowStart))"><slot name="row-expand" :row="row" :index="ri + rowStart" /></td>
    </tr>
  </template>
  <template v-else>
    <tr aria-hidden="true"><td :colspan="colspan" :style="{ height: topSpacer + 'px', padding: 0, border: 0 }"></td></tr>
    <tr v-for="(row, ri) in visibleRows" :key="keyOf(row, ri + startIndex)" role="row" :class="[styles.row, isSelected(keyOf(row, ri + startIndex)) && styles.selected]" @click="emit('row:click', { row, index: ri + startIndex })">
      <td v-if="selectable" :class="[styles.td, styles.checkboxCell, stickyClass('left', 0)]"><BaseCheckbox :modelValue="isSelected(keyOf(row, ri + startIndex))" @update:modelValue="val => emit('row:select', { key: keyOf(row, ri + startIndex), on: val })" /></td>
      <td v-for="(col, ci) in columns" :key="col.id" role="gridcell" :style="tdStyle(col)" :class="[styles.td, stickyClass(col.sticky, ci)]"><slot :name="col.cellSlot || ('cell-' + col.id)" :row="row" :value="cellValue(row, col)" :column="col" :index="ri + startIndex">{{ displayValue(row, col) }}</slot></td>
      <td v-if="expandable" :class="[styles.td, styles.checkboxCell, stickyClass('right', columns.length)]"><BaseButton size="sm" variant="ghost" @click.stop="emit('row:expand', keyOf(row, ri + startIndex))"><BaseIcon :name="isExpanded(keyOf(row, ri + startIndex)) ? 'chevron-up' : 'chevron-down'" /></BaseButton></td>
    </tr>
    <tr aria-hidden="true"><td :colspan="colspan" :style="{ height: bottomSpacer + 'px', padding: 0, border: 0 }"></td></tr>
  </template>
</template>
<script setup lang="ts">
import { BaseButton, BaseCheckbox, BaseIcon } from '../../index';
import styles from '../UltimateDataTable.module.css';
import type { Column } from '../types';
const props = defineProps<{ columns: Column<any>[]; pageRows: any[]; colspan: number; selectable: boolean; expandable: boolean; rowStart: number; virtual: boolean; visibleRows: any[]; startIndex: number; topSpacer: number; bottomSpacer: number; cellValue: (row: any, col: Column<any>) => any; displayValue: (row: any, col: Column<any>) => any; keyOf: (row: any, i: number) => any; isSelected: (key: any) => boolean; isExpanded: (key: any) => boolean; stickyClass: (side: any, i: number) => any; tdStyle: (c: Column<any>) => any; }>();
const emit = defineEmits<{ (e: 'row:click', payload: { row: any; index: number }): void; (e: 'row:select', payload: { key: any; on: boolean }): void; (e: 'row:expand', key: any): void; }>();
</script>
