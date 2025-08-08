<!-- TableFooter.vue - Container for pagination or other footer elements -->
<template>
  <div>
    <TablePagination :pagination="pagination" @update:pagination="update" />
  </div>
</template>

<script setup lang="ts">
import TablePagination from './TablePagination.vue';
import type { Pagination } from '../types';

const props = defineProps<{ pagination: Pagination }>();
const emit = defineEmits<{ (e: 'update:pagination', value: Pagination): void }>();

function update(value: Pagination) {
  emit('update:pagination', value);
}
</script>
