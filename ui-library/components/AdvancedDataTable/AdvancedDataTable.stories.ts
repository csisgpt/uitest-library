// AdvancedDataTable.stories.ts - Final demo stories for AdvancedDataTable
import AdvancedDataTable from './AdvancedDataTable.vue';
import BaseButton from '../BaseButton/BaseButton.vue';
import type { Meta, StoryFn, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { datasetColumns, generateDataset } from './utils/datasetGenerator';
import type { Pagination, ServerRequestQuery } from './types';
import { applyFilters } from './utils/filterUtils';

export default {
  title: 'Components/AdvancedDataTable',
  component: AdvancedDataTable,
} as Meta<typeof AdvancedDataTable>;

const render: StoryFn<typeof AdvancedDataTable> = (args) => ({
  components: { AdvancedDataTable },
  setup() {
    return { args };
  },
  template: '<AdvancedDataTable v-bind="args" />',
});

const basicData = generateDataset(20);
const basicPagination: Pagination = {
  page: 1,
  pageSize: 10,
  total: basicData.length,
};

const serverData = ref(generateDataset(100).slice(0, 10));
const serverPagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 100,
});
const serverLoading = ref(false);
function serverRequest(q: ServerRequestQuery) {
  serverLoading.value = true;
  setTimeout(() => {
    const full = generateDataset(100);
    const filtered = applyFilters(full, q.filters, datasetColumns);
    serverPagination.value.total = filtered.length;
    const start = (q.page - 1) * q.pageSize;
    serverData.value = filtered.slice(start, start + q.pageSize);
    serverLoading.value = false;
  }, 500);
}

// Basic table
export const Basic: StoryObj<typeof AdvancedDataTable> = {
  render,
  args: {
    columns: datasetColumns,
    data: basicData,
    pagination: basicPagination,
  },
};

// Virtual scroll performance story
export const Performance: StoryObj<typeof AdvancedDataTable> = {
  render,
  args: {
    columns: datasetColumns,
    data: generateDataset(50000),
    virtualScroll: true,
  },
};

// Server side simulation
export const ServerSide: StoryObj<typeof AdvancedDataTable> = {
  render,
  args: {
    columns: datasetColumns,
    data: serverData,
    pagination: serverPagination,
    loading: serverLoading,
    serverMode: true,
    onServerRequest: serverRequest,
  },
};

// Advanced filtering showcase
export const AdvancedFiltering: StoryObj<typeof AdvancedDataTable> = {
  render,
  args: {
    columns: datasetColumns,
    data: generateDataset(100),
  },
};

// Theme switching demo
export const Theming: StoryObj<typeof AdvancedDataTable> = {
  render: (args) => ({
    components: { AdvancedDataTable },
    setup() {
      function setTheme(t: string) {
        import(`./themes/${t}.css`);
      }
      setTheme('light');
      return { args, setTheme };
    },
    template: `
      <div>
        <select @change="setTheme(($event.target as HTMLSelectElement).value)">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="brandX">BrandX</option>
        </select>
        <AdvancedDataTable v-bind="args" />
      </div>
    `,
  }),
  args: {
    columns: datasetColumns,
    data: generateDataset(20),
  },
};

// Accessibility demo
export const Accessibility: StoryObj<typeof AdvancedDataTable> = {
  render,
  args: {
    columns: datasetColumns,
    data: generateDataset(20),
  },
};

// Export story
export const Exporting: StoryObj<typeof AdvancedDataTable> = {
  render: (args) => ({
    components: { AdvancedDataTable },
    setup() {
      const tableRef = ref();
      function exportCurrent() {
        tableRef.value.exportCSV('current');
      }
      function exportFiltered() {
        tableRef.value.exportExcel('filtered');
      }
      return { args, tableRef, exportCurrent, exportFiltered };
    },
    template: `
      <div>
        <button @click="exportCurrent">CSV Current</button>
        <button @click="exportFiltered">Excel Filtered</button>
        <AdvancedDataTable ref="tableRef" v-bind="args" />
      </div>
    `,
  }),
  args: {
    columns: datasetColumns,
    data: generateDataset(20),
  },
};

// Custom empty/loading state
export const CustomStates: StoryObj<typeof AdvancedDataTable> = {
  render: (args) => ({
    components: { AdvancedDataTable },
    setup() {
      return { args };
    },
    template: `
      <AdvancedDataTable v-bind="args">
        <template #emptyState><div>No data!</div></template>
        <template #loadingState><div>Loading please wait...</div></template>
      </AdvancedDataTable>
    `,
  }),
  args: {
    columns: datasetColumns,
    data: [],
    loading: false,
  },
};

// Row action buttons using custom slot
export const WithActions: StoryObj<typeof AdvancedDataTable> = {
  render: (args) => ({
    components: { AdvancedDataTable, BaseButton },
    setup() {
      return { args };
    },
    template: `
      <AdvancedDataTable v-bind="args">
        <template #actions="{ row, index }">
          <BaseButton variant="primary" @click.stop="args.onEdit({ row, index })">Edit</BaseButton>
          <BaseButton variant="danger" @click.stop="args.onDelete({ row, index })">Delete</BaseButton>
        </template>
      </AdvancedDataTable>
    `,
  }),
  args: {
    columns: [
      ...datasetColumns,
      { field: 'actions', header: 'Actions', type: 'slot', slotName: 'actions' },
    ],
    data: generateDataset(5),
    onEdit: (payload: any) => console.log('edit', payload),
    onDelete: (payload: any) => console.log('delete', payload),
  },
};

