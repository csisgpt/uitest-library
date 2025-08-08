// BaseDataTable.stories.ts - Storybook stories for BaseDataTable
import BaseDataTable from './BaseDataTable.vue';
import type { Meta, StoryFn } from '@storybook/vue3';
import type { Column, Pagination } from './types';

export default {
  title: 'Components/BaseDataTable',
  component: BaseDataTable,
  argTypes: {
    selectionMode: {
      control: { type: 'select' },
      options: ['single', 'multiple', null],
    },
  },
} as Meta<typeof BaseDataTable>;

const defaultColumns: Column[] = [
  { field: 'name', header: 'Name', sortable: true, filterable: true },
  { field: 'amount', header: 'Amount', type: 'number', sortable: true },
  { field: 'price', header: 'Price', type: 'currency', sortable: true, formatOptions: { currency: 'USD' } },
  { field: 'date', header: 'Date', type: 'date', sortable: true },
  { field: 'active', header: 'Active', type: 'boolean', sortable: true },
];

const defaultData = [
  { name: 'Alpha', amount: 1234, price: 19.99, date: '2023-09-01', active: true },
  { name: 'Beta', amount: 5678, price: 9.5, date: '2023-09-05', active: false },
];

const defaultPagination: Pagination = { page: 1, pageSize: 5, total: defaultData.length };

export const Basic: StoryFn<typeof BaseDataTable> = args => ({
  components: { BaseDataTable },
  setup() {
    return { args };
  },
  template: '<BaseDataTable v-bind="args" />',
});

Basic.args = {
  columns: defaultColumns,
  data: defaultData,
  pagination: defaultPagination,
  loading: false,
  selectionMode: null,
};

export const ColumnTypes: StoryFn<typeof BaseDataTable> = args => ({
  components: { BaseDataTable },
  setup() {
    return { args };
  },
  template: `
    <BaseDataTable v-bind="args">
      <template #custom="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </BaseDataTable>
  `,
});

ColumnTypes.args = {
  columns: [
    { field: 'text', header: 'Text' },
    { field: 'num', header: 'Number', type: 'number' },
    { field: 'curr', header: 'Currency', type: 'currency', formatOptions: { currency: 'USD' } },
    { field: 'date', header: 'Date', type: 'date' },
    { field: 'dateFa', header: 'Date FA', type: 'date-fa' },
    { field: 'bool', header: 'Boolean', type: 'boolean' },
    { field: 'file', header: 'File', type: 'file' },
    { field: 'slot', header: 'Slot', type: 'slot', slotName: 'custom' },
  ] as Column[],
  data: [
    {
      text: 'Row1',
      num: 1000,
      curr: 2000,
      date: '2023-09-01',
      dateFa: '2023-09-01',
      bool: true,
      file: '#',
      name: 'Custom1',
    },
    {
      text: 'Row2',
      num: 2000,
      curr: 3000,
      date: '2023-09-02',
      dateFa: '2023-09-02',
      bool: false,
      file: '#',
      name: 'Custom2',
    },
  ],
  pagination: { page: 1, pageSize: 10, total: 2 },
  selectionMode: null,
  loading: false,
};
