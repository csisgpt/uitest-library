<template>
  <tr v-if="showFilters">
    <th v-if="selectable" :class="[styles.th, styles.checkboxCell]" />
    <th v-for="col in columns" :key="col.id" :class="styles.th">
      <slot :name="`filter-` + col.id" v-bind="filterSlotProps(col)">
        <BaseInput v-if="col.filter?.kind === 'text'" v-model="filters[col.id]" size="sm" :placeholder="col.filter?.label || ('فیلتر ' + (col.header || col.id))" @update:modelValue="emit('filters:update', { id: col.id, value: filters[col.id] })" />
        <BaseDropdown v-else-if="col.filter?.kind === 'enum'" :items="(col.filter.options || [])" label-field="label" value-field="value" :modelValue="filters[col.id]" @update:modelValue="val => emit('filters:update', { id: col.id, value: val })" />
        <BaseCheckbox v-else-if="col.filter?.kind === 'boolean'" :modelValue="filters[col.id] === true" @update:modelValue="val => emit('filters:update', { id: col.id, value: val })" />
        <BaseInput v-else-if="col.filter?.kind === 'number'" type="number" size="sm" v-model="filters[col.id]" :placeholder="col.filter?.label || ('عدد ' + (col.header || col.id))" @update:modelValue="emit('filters:update', { id: col.id, value: Number(filters[col.id]) })" />
      </slot>
    </th>
    <th v-if="expandable" :class="[styles.th, styles.checkboxCell]" />
  </tr>
</template>
<script setup lang="ts">
import { BaseInput, BaseDropdown, BaseCheckbox } from '../../index';
import styles from '../UltimateDataTable.module.css';
import type { Column, FilterModel } from '../types';
const props = defineProps<{ columns: Column<any>[]; filters: FilterModel; showFilters: boolean; selectable: boolean; expandable: boolean; filterSlotProps: (col: Column<any>) => any; }>();
const emit = defineEmits<{ (e: 'filters:update', value: { id: string; value: any }): void; }>();
</script>
