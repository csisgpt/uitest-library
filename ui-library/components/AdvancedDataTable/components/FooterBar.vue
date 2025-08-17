<template>
  <div :class="styles.footer">
    <div><BaseDropdown :items="pageSizeItems" :modelValue="pagination.pageSize" @update:modelValue="val => emit('pageSize', Number(val))" label-field="label" value-field="value" /></div>
    <div><BaseButton @click="emit('prev')" :disabled="pagination.page <= 1">«</BaseButton><span style="padding: 0 var(--space-sm)">{{ pagination.page }} / {{ pageCount }}</span><BaseButton @click="emit('next')" :disabled="pagination.page >= pageCount">»</BaseButton></div>
  </div>
</template>
<script setup lang="ts">
import { BaseButton, BaseDropdown } from '../../index';
import styles from '../UltimateDataTable.module.css';
import type { PaginationState } from '../types';
const props = defineProps<{ pagination: PaginationState; pageCount: number; pageSizeItems: Array<{ label: string; value: number }>; }>();
const emit = defineEmits<{ (e: 'pageSize', value: number): void; (e: 'prev'): void; (e: 'next'): void; }>();
</script>
