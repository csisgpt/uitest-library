<!-- TableFilters.vue - Renders filter inputs for filterable columns with debounce -->
<template>
  <tr role="row">
    <th v-if="hasRowExpansion" role="columnheader"></th>
    <th v-for="col in columns" :key="col.field" role="columnheader">
      <template v-if="col.filterable">
        <!-- Custom slot -->
        <template
          v-if="col.filterType === 'custom' && col.filterSlotName && $slots[col.filterSlotName]"
        >
          <slot
            :name="col.filterSlotName"
            :model="local[col.field]"
            :update="(v: any) => updateCustom(col.field, v)"
          />
        </template>
        <!-- Text filter -->
        <input
          v-else-if="!col.filterType || col.filterType === 'text'"
          type="text"
          v-model="local[col.field]"
          @input="emitDebounced"
        />
        <!-- Number range filter -->
        <div v-else-if="col.filterType === 'number'">
          <input
            type="number"
            v-model.number="local[col.field].min"
            @input="emitDebounced"
            style="width:45%;"
          />
          <input
            type="number"
            v-model.number="local[col.field].max"
            @input="emitDebounced"
            style="width:45%;"
          />
        </div>
        <!-- Date range filter -->
        <div v-else-if="col.filterType === 'date'">
          <input type="date" v-model="local[col.field].from" @input="emitDebounced" />
          <input type="date" v-model="local[col.field].to" @input="emitDebounced" />
        </div>
        <!-- Boolean filter -->
        <select v-else-if="col.filterType === 'boolean'" v-model="local[col.field]" @change="emitDebounced">
          <option value="all">All</option>
          <option :value="true">True</option>
          <option :value="false">False</option>
        </select>
        <!-- Select filter -->
        <select v-else-if="col.filterType === 'select'" v-model="local[col.field]" @change="emitDebounced">
          <option value=""></option>
          <option v-for="opt in col.filterOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </template>
    </th>
  </tr>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Column, FilterModel } from '../types';
import { debounce } from '../utils/filterUtils';

const props = defineProps<{ columns: Column[]; model: FilterModel; hasRowExpansion: boolean }>();
const emit = defineEmits<{ (e: 'filter', model: FilterModel): void }>();

const local = ref<Record<string, any>>({ ...props.model });

watch(
  () => props.model,
  v => {
    local.value = { ...v };
  },
  { deep: true }
);

function updateCustom(field: string, value: any) {
  local.value[field] = value;
  emitDebounced();
}

function doEmit() {
  emit('filter', JSON.parse(JSON.stringify(local.value)));
}

const emitDebounced = debounce(doEmit, 300);
</script>
