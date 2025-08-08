<!-- TablePagination.vue - Basic pagination controls -->
<template>
  <div :class="styles.pagination">
    <button type="button" @click="prev" :disabled="pagination.page <= 1">◀</button>
    <span>{{ pagination.page }} / {{ pageCount }}</span>
    <button type="button" @click="next" :disabled="pagination.page >= pageCount">▶</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import styles from '../AdvancedDataTable.module.css';
import type { Pagination } from '../types';

const props = defineProps<{ pagination: Pagination }>();
const emit = defineEmits<{ (e: 'update:pagination', value: Pagination): void }>();

const pageCount = computed(() => Math.max(1, Math.ceil(props.pagination.total / props.pagination.pageSize)));

function prev() {
  if (props.pagination.page > 1) {
    emit('update:pagination', { ...props.pagination, page: props.pagination.page - 1 });
  }
}

function next() {
  if (props.pagination.page < pageCount.value) {
    emit('update:pagination', { ...props.pagination, page: props.pagination.page + 1 });
  }
}
</script>
