// AdvancedDataTable.stories.ts - Final demo stories for AdvancedDataTable
import AdvancedDataTable from './AdvancedDataTable.vue';
import type { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';
import { datasetColumns, generateDataset } from './utils/datasetGenerator';
import type { Pagination, ServerRequestQuery } from './types';
import { applyFilters } from './utils/filterUtils';

export default {
  title: 'Components/AdvancedDataTable',
  component: AdvancedDataTable,
} as Meta<typeof AdvancedDataTable>;

// Basic table
export const Basic: StoryFn<typeof AdvancedDataTable> = () => ({
  components: { AdvancedDataTable },
  setup() {
    const data = generateDataset(20);
    const pagination: Pagination = { page: 1, pageSize: 10, total: data.length };
    return { data, columns: datasetColumns, pagination };
  },
  template: '<AdvancedDataTable :columns="columns" :data="data" :pagination="pagination" />',
});

// Virtual scroll performance story
export const Performance: StoryFn<typeof AdvancedDataTable> = () => ({
  components: { AdvancedDataTable },
  setup() {
    const data = generateDataset(50000);
    return { data, columns: datasetColumns };
  },
  template: '<AdvancedDataTable virtualScroll :columns="columns" :data="data" />',
});

// Server side simulation
export const ServerSide: StoryFn<typeof AdvancedDataTable> = () => ({
  components: { AdvancedDataTable },
  setup() {
    const data = ref(generateDataset(100).slice(0, 10));
    const pagination = ref<Pagination>({ page: 1, pageSize: 10, total: 100 });
    const loading = ref(false);
    function request(q: ServerRequestQuery) {
      loading.value = true;
      setTimeout(() => {
        const full = generateDataset(100);
        const filtered = applyFilters(full, q.filters, datasetColumns);
        pagination.value.total = filtered.length;
        const start = (q.page - 1) * q.pageSize;
        data.value = filtered.slice(start, start + q.pageSize);
        loading.value = false;
      }, 500);
    }
    return { data, columns: datasetColumns, pagination, loading, request };
  },
  template: `
    <AdvancedDataTable
      serverMode
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :loading="loading"
      @server-request="request"
    />
  `,
});

// Advanced filtering showcase
export const AdvancedFiltering: StoryFn<typeof AdvancedDataTable> = () => ({
  components: { AdvancedDataTable },
  setup() {
    const data = generateDataset(100);
    return { data, columns: datasetColumns };
  },
  template: '<AdvancedDataTable :columns="columns" :data="data" />',
});

// Theme switching demo
export const Theming: StoryFn<typeof AdvancedDataTable> = () => ({
  components: { AdvancedDataTable },
  setup() {
    const data = generateDataset(20);
    function setTheme(t: string) {
      import(`./themes/${t}.css`);
    }
    setTheme('light');
    return { data, columns: datasetColumns, setTheme };
  },
  template: `
    <div>
      <select @change="setTheme(($event.target as HTMLSelectElement).value)">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="brandX">BrandX</option>
      </select>
      <AdvancedDataTable :columns="columns" :data="data" />
    </div>
  `,
});

// Accessibility demo
export const Accessibility: StoryFn<typeof AdvancedDataTable> = () => ({
  components: { AdvancedDataTable },
  setup() {
    const data = generateDataset(20);
    return { data, columns: datasetColumns };
  },
  template: '<AdvancedDataTable :columns="columns" :data="data" />',
});

// Export story
export const Exporting: StoryFn<typeof AdvancedDataTable> = () => ({
  components: { AdvancedDataTable },
  setup() {
    const tableRef = ref();
    const data = generateDataset(20);
    function exportCurrent() {
      tableRef.value.exportCSV('current');
    }
    function exportFiltered() {
      tableRef.value.exportExcel('filtered');
    }
    return { tableRef, data, columns: datasetColumns, exportCurrent, exportFiltered };
  },
  template: `
    <div>
      <button @click="exportCurrent">CSV Current</button>
      <button @click="exportFiltered">Excel Filtered</button>
      <AdvancedDataTable ref="tableRef" :columns="columns" :data="data" />
    </div>
  `,
});

// Custom empty/loading state
export const CustomStates: StoryFn<typeof AdvancedDataTable> = () => ({
  components: { AdvancedDataTable },
  setup() {
    const data: any[] = [];
    const loading = ref(false);
    return { data, columns: datasetColumns, loading };
  },
  template: `
    <AdvancedDataTable :columns="columns" :data="data" :loading="loading">
      <template #emptyState><div>No data!</div></template>
      <template #loadingState><div>Loading please wait...</div></template>
    </AdvancedDataTable>
  `,
});

