// AdvancedDataTable.stories.ts - Storybook stories for AdvancedDataTable
import AdvancedDataTable from './AdvancedDataTable.vue';
import type { Meta, StoryFn } from '@storybook/vue3';
import type { Column, Pagination } from './types';

export default {
  title: 'Components/AdvancedDataTable',
  component: AdvancedDataTable,
  argTypes: {
    selectionMode: {
      control: { type: 'select' },
      options: ['single', 'multiple', null],
    },
  },
} as Meta<typeof AdvancedDataTable>;

const sampleColumns: Column[] = [
  { field: 'id', header: 'ID', type: 'number', sortable: true, align: 'right' },
  {
    field: 'name',
    header: 'Full Name',
    type: 'text',
    sortable: true,
    filterable: true,
  },
  {
    field: 'salary',
    header: 'Salary',
    type: 'currency',
    sortable: true,
    formatOptions: { currency: 'IRR' },
    align: 'right',
  },
  { field: 'hireDate', header: 'Hire Date', type: 'date-fa', sortable: true },
  { field: 'active', header: 'Active', type: 'boolean', sortable: true },
  { field: 'resume', header: 'Resume File', type: 'file' },
];

const sampleData = [
  {
    id: 1,
    name: 'Ali Rezaei',
    salary: 12000000,
    hireDate: '2023-02-15',
    active: true,
    resume: '/files/ali.pdf',
  },
  {
    id: 2,
    name: 'Sara Ahmadi',
    salary: 9500000,
    hireDate: '2022-11-01',
    active: false,
    resume: '/files/sara.pdf',
  },
  {
    id: 3,
    name: 'Hossein Karimi',
    salary: 15000000,
    hireDate: '2023-07-20',
    active: true,
    resume: '/files/hossein.pdf',
  },
];

const defaultPagination: Pagination = {
  page: 1,
  pageSize: 5,
  total: sampleData.length,
};

export const Basic: StoryFn<typeof AdvancedDataTable> = args => ({
  components: { AdvancedDataTable },
  setup() {
    return { args };
  },
  template: '<AdvancedDataTable v-bind="args" />',
});

Basic.args = {
  columns: sampleColumns,
  data: sampleData,
  pagination: defaultPagination,
  loading: false,
  selectionMode: null,
};

export const AllColumnTypes: StoryFn<typeof AdvancedDataTable> = args => ({
  components: { AdvancedDataTable },
  setup() {
    return { args };
  },
  template: `
    <AdvancedDataTable v-bind="args">
      <template #custom="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </AdvancedDataTable>
  `,
});

AllColumnTypes.args = {
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
