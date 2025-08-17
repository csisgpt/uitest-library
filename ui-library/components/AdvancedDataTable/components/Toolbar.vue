<template>
  <div :class="styles.toolbar">
    <BaseInput v-if="showGlobalSearch" v-model="modelSearch" :placeholder="i18n.searchPlaceholder" :class="styles.searchInput" @update:modelValue="emit('update:search', modelSearch)" />
    <BaseDropdown v-if="enableDensity" :items="densityOptions" :modelValue="density" @update:modelValue="val => emit('update:density', val)" label-field="label" value-field="value" />
    <BaseDropdown v-if="columnsMenu" :items="columnsMenuItems" label-field="label" value-field="id" multiple :modelValue="visibleColumnIds" @update:modelValue="ids => emit('columns:visibility', ids)" />
    <div :class="styles.right"><slot name="actions-right" /></div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { BaseDropdown, BaseInput } from '../../index';
import styles from './Toolbar.module.css';
import type { I18nText, Column } from '../types';
const props = defineProps<{ i18n: I18nText; showGlobalSearch: boolean; enableDensity: boolean; columnsMenu: boolean; density: 'compact' | 'normal' | 'spacious'; search: string; columns: Column<any>[]; }>();
const emit = defineEmits<{ (e: 'update:search', value: string): void; (e: 'update:density', value: 'compact' | 'normal' | 'spacious'): void; (e: 'columns:visibility', ids: string[]): void; }>();
let modelSearch = $ref(props.search);
const densityOptions = [ { label: 'فشرده', value: 'compact' }, { label: 'معمولی', value: 'normal' }, { label: 'جادار', value: 'spacious' }, ];
const columnsMenuItems = computed(() => props.columns.map(c => ({ id: c.id, label: c.header || c.id })));
const visibleColumnIds = computed(() => props.columns.filter(c => !c.hidden).map(c => c.id));
</script>
