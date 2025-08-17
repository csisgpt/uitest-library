import type { Meta, StoryObj } from '@storybook/vue3';
import UltimateDataTable from './UltimateDataTable.vue';
import type { Column, PaginationState, SortState, FilterModel } from './types';
import { makeRows, baseColumns, Row, fakeServerFetch } from './_mocks';

// ---------- Meta ----------
const meta: Meta<typeof UltimateDataTable> = {
  title: 'Data Display/UltimateDataTable',
  component: UltimateDataTable,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'جدول دادهٔ حرفه‌ای با سورت/فیلتر/سلکشن/اکسپنشن/پرسیست/اسکرول مجازی و تمینگ کامل.' } },
    a11y: { disable: false },
  },
  argTypes: {
    selectable: { control: 'boolean' },
    expandable: { control: 'boolean' },
    showGlobalSearch: { control: 'boolean' },
    showFilters: { control: 'boolean' },
    showFooter: { control: 'boolean' },
    columnsMenu: { control: 'boolean' },
    enableDensity: { control: 'boolean' },
    density: { control: { type: 'radio' }, options: ['compact','normal','spacious'] },
    virtualScroll: { control: 'boolean' },
    virtualHeight: { control: 'number' },
    rowHeight: { control: 'number' },
  },
  args: {
    tableId: 'ultimate-demo',
    items: makeRows(250),
    columns: baseColumns as Column<Row>[],
    selectable: true,
    expandable: true,
    showGlobalSearch: true,
    showFilters: true,
    showFooter: true,
    columnsMenu: true,
    enableDensity: true,
    density: 'normal',
    pagination: { page: 1, pageSize: 10 },
    sort: [],
    filters: {},
    search: '',
    virtualScroll: false,
    virtualHeight: 480,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

// ---------- 1) حالت پایه ----------
export const Basic: Story = {
  name: 'پایه',
  render: (args) => ({
    components: { UltimateDataTable },
    setup() { return { args }; },
    template: `
      <UltimateDataTable v-bind="args">
        <template #row-expand="{ row }">
          <div style="padding: var(--space-md); background: var(--color-surface); border-radius: var(--radius-md);">
            جزئیات کاربر: <strong>{{ row.name }}</strong> - {{ row.email }}
          </div>
        </template>
      </UltimateDataTable>
    `,
  }),
};

// ---------- 2) سلول‌های سفارشی ----------
export const CustomCells: Story = {
  name: 'سلول سفارشی',
  args: { items: makeRows(50) },
  render: (args) => ({
    components: { UltimateDataTable },
    setup() { return { args }; },
    template: `
      <UltimateDataTable v-bind="args">
        <template #cell-name="{ value }">
          <div style="display:flex; gap: var(--space-sm); align-items:center;">
            <span style="width:8px;height:8px;border-radius:var(--radius-full);background:var(--color-primary);"></span>
            <strong>{{ value }}</strong>
          </div>
        </template>
        <template #cell-active="{ value }">
          <span :style="{ 
            padding: '2px 8px', 
            borderRadius: 'var(--radius-full)', 
            background: value ? 'var(--color-success)' : 'var(--color-error)', 
            color: 'var(--color-on-success)' 
          }">{{ value ? 'فعال' : 'غیرفعال' }}</span>
        </template>
      </UltimateDataTable>
    `,
  }),
};

// ---------- 3) چگالی‌ها ----------
export const DensityCompact: Story = { name: 'چگالی: فشرده', args: { density: 'compact' } };
export const DensitySpacious: Story = { name: 'چگالی: جادار', args: { density: 'spacious' } };

// ---------- 4) استیکی چپ/راست ----------
export const StickyColumns: Story = {
  name: 'ستون‌های چسبنده',
  args: {
    columns: baseColumns.map(c => ({ ...c })), // ensure fresh clone
  },
  parameters: { docs: { description: { story: 'ستون name به چپ و country به راست چسبیده‌اند.' } } },
};

// ---------- 5) فیلتر و سورت اولیه ----------
export const InitialSortFilter: Story = {
  name: 'سورت/فیلتر اولیه',
  args: {
    sort: [{ id: 'age', desc: true }] as SortState[],
    filters: { country: 'DE' } as FilterModel,
  },
};

// ---------- 6) اسکرول مجازی (۵هزار ردیف) ----------
export const Virtualized: Story = {
  name: 'اسکرول مجازی',
  args: { items: makeRows(5000), virtualScroll: true, virtualHeight: 480, pagination: { page: 1, pageSize: 50 } },
};

// ---------- 7) حالت‌های UI ----------
export const LoadingState: Story = { name: 'حالت لودینگ', args: { loading: true, items: [] } };
export const ErrorState: Story = { name: 'حالت خطا', args: { error: 'مشکلی پیش آمد', items: [] } };
export const EmptyState: Story = { name: 'حالت خالی', args: { items: [] } };

// ---------- 8) سرور مود (API فیک) ----------
export const ServerMode: Story = {
  name: 'سرور مود',
  args: { serverMode: true, items: [], pagination: { page: 1, pageSize: 10 } as PaginationState },
  render: (args) => ({
    components: { UltimateDataTable },
    data: () => ({
      rows: [] as Row[],
      total: 0,
      pagination: { page: 1, pageSize: 10 } as PaginationState,
      sort: [] as SortState[],
      filters: {} as FilterModel,
      loading: false,
      search: '',
    }),
    methods: {
      async fetchServer(q: any) {
        this.loading = true;
        const res = await fakeServerFetch(q);
        this.rows = res.rows;
        this.total = res.total;
        this.loading = false;
      },
    },
    mounted() {
      // initial load
      this.fetchServer({
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        sort: this.sort, filters: this.filters, global: this.search
      });
    },
    template: `
      <UltimateDataTable
        v-bind="args"
        :items="rows"
        :pagination="pagination"
        :sort="sort"
        :filters="filters"
        :loading="loading"
        serverMode
        @server:query="fetchServer"
      />
      <div style="margin-top: var(--space-md); color: var(--color-muted);">
        Total: {{ total.toLocaleString() }}
      </div>
    `,
  }),
};

// ---------- 9) Persist (order + width) ----------
export const Persisted: Story = {
  name: 'پرسیست ستون‌ها',
  args: { tableId: 'ultimate-persist-demo' },
  parameters: { docs: { description: { story: 'عرض و ترتیب ستون‌ها پس از refresh باقی می‌ماند.' } } },
};

// ---------- 10) اکشن‌های Toolbar (Bulk actions) ----------
export const ToolbarActions: Story = {
  name: 'اکشن‌های بالک',
  render: (args) => ({
    components: { UltimateDataTable },
    setup() { return { args }; },
    template: `
      <UltimateDataTable v-bind="args">
        <template #toolbar-actions-right="{ selection }">
          <div style="display:flex; gap: var(--space-sm);">
            <button
              :disabled="!selection.length"
              style="padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md); border: none; background: var(--color-secondary); color: var(--color-on-secondary); cursor: pointer; transition: var(--transition-fast);">
              حذف {{ selection.length ? '(' + selection.length + ')' : '' }}
            </button>
            <button
              :disabled="!selection.length"
              style="padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md); border: none; background: var(--color-primary); color: var(--color-on-primary); cursor: pointer; transition: var(--transition-fast);">
              خروجی CSV
            </button>
          </div>
        </template>
      </UltimateDataTable>
    `,
  }),
};

// ---------- 11) Resize/Drag columns ----------
export const ColumnSizingReorder: Story = {
  name: 'تغییر عرض / جابجایی ستون‌ها',
  parameters: { docs: { description: { story: 'گرفتن دستگیرهٔ ستون و درگ به چپ/راست.' } } },
};

// ---------- 12) ناوبری کیبورد ----------
export const KeyboardNav: Story = {
  name: 'ناوبری کیبورد',
  parameters: {
    docs: { description: { story: 'Focus روی گرید + کلیدهای PageUp/PageDown یا Arrow برای صفحه‌بندی.' } },
  },
};

// ---------- 13) i18n (نمونه انگلیسی) ----------
export const I18nEnglish: Story = {
  name: 'i18n: English',
  args: {
    i18n: {
      searchPlaceholder: 'Search...',
      columns: 'Columns',
      density: 'Density',
      compact: 'Compact',
      normal: 'Normal',
      spacious: 'Spacious',
      loading: 'Loading…',
      error: 'Error',
      empty: 'No data',
      selectAll: 'Select all',
    },
  },
};

// ---------- 14) پرفورمنس دیتاست بزرگ ----------
export const LargeDataset: Story = {
  name: '۵۰هزار ردیف (Virtual)',
  args: { items: makeRows(50000), virtualScroll: true, virtualHeight: 560, pagination: { page: 1, pageSize: 100 } },
};
