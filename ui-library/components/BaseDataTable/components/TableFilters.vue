<!-- TableFilters.vue - Renders filter inputs for filterable columns -->
<template>
  <tr>
    <th v-for="col in columns" :key="col.field">
      <input
        v-if="col.filterable"
        type="text"
        v-model="local[col.field]"
        @input="emitFilter"
      />
    </th>
  </tr>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Column, FilterModel } from '../types';

const props = defineProps<{ columns: Column[]; model: FilterModel }>();
const emit = defineEmits<{ (e: 'filter', model: FilterModel): void }>();

const local = ref<Record<string, string>>({ ...props.model });

watch(
  () => props.model,
  v => {
    local.value = { ...v };
  }
);

function emitFilter() {
  emit('filter', { ...local.value });
}
</script>
