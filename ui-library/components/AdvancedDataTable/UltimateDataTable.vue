<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  BaseButton,
  BaseCheckbox,
  BaseDropdown,
  BaseInput,
  BaseIcon,
} from "../index";
import styles from "./UltimateDataTable.module.css";
import Toolbar from "./components/Toolbar.vue";
import HeaderRow from "./components/HeaderRow.vue";
import FiltersRow from "./components/FiltersRow.vue";
import BodyRows from "./components/BodyRows.vue";
import FooterBar from "./components/FooterBar.vue";
import Loading from "./components/States/Loading.vue";
import Error from "./components/States/Error.vue";
import Empty from "./components/States/Empty.vue";
import type {
  Column,
  FilterModel,
  PaginationState,
  SortState,
  I18nText,
} from "./types";
import {
  DEFAULT_I18N,
  DEFAULT_PAGE_SIZES,
  DEFAULT_ROW_HEIGHT,
  DEFAULT_VIRTUAL_HEIGHT,
} from "./config/defaults";
import { useDataPipeline } from "./composables/useDataPipeline";
import { useSelection } from "./composables/useSelection";
import { useRowExpansion } from "./composables/useRowExpansion";
import { useColumnSizing } from "./composables/useColumnSizing";
import { usePersist } from "./composables/usePersist";
import { useKeyboardNav } from "./composables/useKeyboardNav";
import { useVirtualScroll } from "./composables/useVirtualScroll";

type Row = any;

const props = withDefaults(
  defineProps<{
    tableId?: string;
    items: Row[];
    columns: Column<Row>[];
    serverMode?: boolean;
    loading?: boolean;
    error?: string | null;
    selectable?: boolean;
    expandable?: boolean;
    showGlobalSearch?: boolean;
    showFilters?: boolean;
    showFooter?: boolean;
    columnsMenu?: boolean;
    enableDensity?: boolean;
    density?: "compact" | "normal" | "spacious";
    pageSizeOptions?: Array<{ label: string; value: number }>;
    pagination?: PaginationState;
    sort?: SortState[];
    filters?: FilterModel;
    search?: string;
    rowKey?: (row: Row, index: number) => string | number;
    ariaLabel?: string;
    i18n?: I18nText;
    virtualScroll?: boolean;
    virtualHeight?: number;
    rowHeight?: number;
  }>(),
  {
    serverMode: false,
    loading: false,
    error: null,
    selectable: false,
    expandable: false,
    showGlobalSearch: true,
    showFilters: true,
    showFooter: true,
    columnsMenu: true,
    enableDensity: true,
    density: "normal",
    pageSizeOptions: () =>
      DEFAULT_PAGE_SIZES.map((n) => ({ label: String(n), value: n })),
    pagination: () => ({ page: 1, pageSize: 10 }),
    sort: () => [],
    filters: () => ({}),
    search: "",
    ariaLabel: "جدول داده",
    i18n: () => DEFAULT_I18N,
    virtualScroll: false,
    virtualHeight: DEFAULT_VIRTUAL_HEIGHT,
    rowHeight: DEFAULT_ROW_HEIGHT,
  }
);

const emit = defineEmits<{
  (e: "update:pagination", value: PaginationState): void;
  (e: "update:sort", value: SortState[]): void;
  (e: "update:filters", value: FilterModel): void;
  (e: "update:search", value: string): void;
  (e: "row:click", payload: { row: Row; index: number }): void;
  (
    e: "server:query",
    query: {
      page: number;
      pageSize: number;
      sort: SortState[];
      filters: FilterModel;
      global?: string;
    }
  ): void;
  (e: "selection:change", value: Array<string | number>): void;
  (e: "column:resize", payload: { id: string; width: number }): void;
  (e: "column:order", payload: string[]): void;
}>();

/* ---------- State & i18n ---------- */
const density = ref(props.density);
const i18n = props.i18n!;
const internalGlobal = ref(props.search);

/* ---------- Columns: internal clone (no props mutation) ---------- */
const internalColumns = ref<Column<Row>[]>(
  props.columns.map((c) => ({ ...c }))
);

// Sync when parent updates columns
watch(
  () => props.columns,
  (next) => {
    internalColumns.value = next.map((c) => ({ ...c }));
  },
  { deep: true }
);

// Visible columns only for header/body
const cols = computed(() => internalColumns.value.filter((c) => !c.hidden));
const colspan = computed(
  () =>
    cols.value.length + (props.selectable ? 1 : 0) + (props.expandable ? 1 : 0)
);

/* ---------- Data pipeline ---------- */
const {
  sortState,
  filterState,
  globalQ,
  pagination,
  processed,
  pageRows,
  pageCount,
  asServerQuery,
  keyOf,
} = useDataPipeline<Row>(
  () => props.items,
  () => internalColumns.value, // ← به‌جای props.columns
  {
    serverMode: props.serverMode,
    globalSearch: () => internalGlobal.value,
    pagination: () => props.pagination,
    sort: () => props.sort,
    filters: () => props.filters,
    rowKey: props.rowKey,
  }
);

/* ---------- Selection / Expansion / Column sizing / Persist ---------- */
const {
  set: selection,
  bulk: selectAllSet,
  clear: clearSelection,
  toggle: toggleSelect,
  has: hasSelected,
} = useSelection<string | number>();

const {
  open: expanded,
  toggle: toggleExpand,
  isOpen: isExpanded,
} = useRowExpansion<string | number>();

const { widths: columnWidths, setWidth } = useColumnSizing();
const { load, save } = usePersist(props.tableId || "table");

/* ---------- Persist order & widths ---------- */
onMounted(() => {
  if (!props.tableId) return;
  const saved = load<{ order?: string[]; widths?: Record<string, number> }>({});

  if (saved?.widths) Object.assign(columnWidths, saved.widths);

  if (saved?.order?.length) {
    const map = new Map(internalColumns.value.map((c) => [c.id, c]));
    const reordered = saved.order
      .map((id) => map.get(id))
      .filter(Boolean) as Column<Row>[];
    if (reordered.length) {
      internalColumns.value = reordered.map((c) => ({ ...c }));
    }
  }
});

watch(
  [internalColumns, () => columnWidths],
  () => {
    if (!props.tableId) return;
    const payload = {
      order: internalColumns.value.map((c) => c.id),
      widths: columnWidths,
    };
    save(payload);
  },
  { deep: true }
);

/* ---------- Selection computed ---------- */
const selectionArray = computed(() => Array.from(selection));
watch(selectionArray, (v) => emit("selection:change", v));

const allSelected = computed(
  () => processed.value.length > 0 && selection.size === processed.value.length
);
const someSelected = computed(
  () => selection.size > 0 && selection.size < processed.value.length
);

/* ---------- Sorting / Filtering / Global ---------- */
function onSort(col: Column<Row>) {
  if (!col.sortable) return;
  const cur = sortState.value.find((s) => s.id === col.id);
  if (!cur) sortState.value = [{ id: col.id, desc: false }];
  else if (!cur.desc) sortState.value = [{ id: col.id, desc: true }];
  else sortState.value = [];
  emit("update:sort", sortState.value);
  if (props.serverMode) emit("server:query", asServerQuery());
}

function onFilterUpdate({ id, value }: { id: string; value: any }) {
  filterState.value = { ...filterState.value, [id]: value };
  emit("update:filters", filterState.value);
  if (props.serverMode) emit("server:query", asServerQuery());
}

function onGlobalChange(val: string) {
  emit("update:search", val);
  if (props.serverMode) emit("server:query", asServerQuery());
}

/* ---------- Filter slot props ---------- */
function filterSlotProps(col: Column<Row>) {
  return {
    model: filterState.value[col.id],
    update: (v: any) => {
      filterState.value = { ...filterState.value, [col.id]: v };
      emit("update:filters", filterState.value);
      if (props.serverMode) emit("server:query", asServerQuery());
    },
  };
}

/* ---------- Cell helpers ---------- */
function cellValue(row: Row, col: Column<Row>) {
  if (col.accessor) return col.accessor(row);
  if (col.field)
    return col.field
      .split(".")
      .reduce(
        (acc: any, k: string) => (acc == null ? undefined : acc[k]),
        row as any
      );
  return undefined;
}
function displayValue(row: Row, col: Column<Row>) {
  const v = cellValue(row, col);
  return col.format ? col.format(v, row) : (v as any);
}

/* ---------- Selection handlers ---------- */
function onSelectRow({ key, on }: { key: any; on: boolean }) {
  toggleSelect(key, on);
}
function toggleAll(value: boolean) {
  if (value) selectAllSet(processed.value.map((r, i) => keyOf(r, i)));
  else clearSelection();
}
function isSelected(key: any) {
  return hasSelected(key);
}

/* ---------- Row click ---------- */
function onRowClick(row: Row, index: number) {
  emit("row:click", { row, index });
}

/* ---------- TH/TD styles ---------- */
function thStyle(col: Column<Row>) {
  const w = columnWidths[col.id] ?? col.width;
  const min = col.minWidth ?? 80;
  const max = col.maxWidth ?? 1200;
  const textAlign =
    col.align === "center" ? "center" : col.align === "end" ? "end" : "start";
  return {
    width: w ? `${w}px` : undefined,
    minWidth: `${min}px`,
    maxWidth: `${max}px`,
    textAlign,
  };
}
function tdStyle(col: Column<Row>) {
  const textAlign =
    col.align === "center" ? "center" : col.align === "end" ? "end" : "start";
  return { textAlign };
}

/* ---------- Resize & DnD for columns (on internalColumns) ---------- */
function startResize(payload: { e: MouseEvent; col: Column<Row> }) {
  const { e, col } = payload;
  e.preventDefault();
  const startX = e.clientX;
  const startW =
    columnWidths[col.id] ??
    col.width ??
    (e.target as HTMLElement).parentElement!.clientWidth;
  const onMove = (ev: MouseEvent) => {
    const w = Math.max(
      col.minWidth ?? 80,
      Math.min(col.maxWidth ?? 1200, startW + (ev.clientX - startX))
    );
    setWidth(col.id, w);
    emit("column:resize", { id: col.id, width: w });
  };
  const onUp = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}
let dragColId: string | null = null;
function onDragStart(id: string) {
  dragColId = id;
}
function onDrop(targetId: string) {
  if (!dragColId || dragColId === targetId) return;
  const ids = internalColumns.value.map((c) => c.id);
  const from = ids.indexOf(dragColId);
  const to = ids.indexOf(targetId);
  if (from < 0 || to < 0) return;
  ids.splice(to, 0, ...ids.splice(from, 1));
  const map = new Map(internalColumns.value.map((c) => [c.id, c]));
  const reordered = ids
    .map((id) => map.get(id))
    .filter(Boolean) as Column<Row>[];
  internalColumns.value = reordered.map((c) => ({ ...c }));
  emit("column:order", ids);
  dragColId = null;
}

/* ---------- Virtual scroll ---------- */
const scrollerRef = ref<HTMLElement | null>(null);
const rowStart = ref(0);
const {
  start: startIndex,
  end: endIndex,
  top: topSpacer,
  bottom: bottomSpacer,
  onScroll: onVirtualScroll,
} = useVirtualScroll(
  () => processed.value.length,
  props.rowHeight,
  props.virtualHeight
);

const visibleRows = computed(() => {
  if (!props.virtualScroll) return [];
  return processed.value.slice(startIndex.value, endIndex.value);
});

function handleScroll() {
  if (props.virtualScroll && scrollerRef.value)
    onVirtualScroll(scrollerRef.value);
  else {
    const rowH = props.rowHeight || 40;
    rowStart.value = Math.floor((scrollerRef.value?.scrollTop || 0) / rowH);
  }
}

/* ---------- a11y / density / sticky ---------- */
const liveRegionText = computed(() => `${processed.value.length} رکورد`);

const densityClass = computed(() => {
  if (density.value === "compact") return (styles as any).compact || "compact";
  if (density.value === "spacious")
    return (styles as any).spacious || "spacious";
  return "";
});

function stickyClass(side: any, _ci: number) {
  if (side === "left") return styles.stickyLeft;
  if (side === "right") return styles.stickyRight;
  return undefined;
}

/* ---------- Pagination ---------- */
function prevPage() {
  updatePagination({
    ...pagination.value,
    page: Math.max(1, pagination.value.page - 1),
  });
}
function nextPage() {
  updatePagination({
    ...pagination.value,
    page: Math.min(pageCount.value, pagination.value.page + 1),
  });
}
function updatePagination(p: PaginationState) {
  emit("update:pagination", p);
  if (props.serverMode) emit("server:query", asServerQuery());
}

/* ---------- Keyboard nav ---------- */
const { onKey: onGridKeydown } = useKeyboardNav(nextPage, prevPage);

/* ---------- Reactivity tweaks ---------- */
watch(
  () => props.items,
  () => {
    if (!props.serverMode) clearSelection();
  }
);

/* ---------- Columns visibility (from Toolbar) ---------- */
function onToggleColumns(ids: string[]) {
  const set = new Set(ids);
  internalColumns.value = internalColumns.value.map((c) => ({
    ...c,
    hidden: !set.has(c.id),
  }));
}
</script>

<template>
  <div
    dir="rtl"
    :class="[styles.root, densityClass]"
    role="region"
    :aria-label="ariaLabel"
  >
    <Toolbar
      :i18n="i18n"
      :showGlobalSearch="showGlobalSearch"
      :enableDensity="enableDensity"
      :columnsMenu="columnsMenu"
      :density="density"
      :search="internalGlobal"
      :columns="internalColumns"
      <!--
      همه
      ستون‌ها
      برای
      منوی
      Visibility
      --
    >
      @update:search="onGlobalChange" @update:density="(val) => (density.value =
      val)" @columns:visibility="onToggleColumns" >
      <template #actions-right
        ><slot name="toolbar-actions-right" :selection="selectionArray"
      /></template>
    </Toolbar>

    <div
      ref="scrollerRef"
      :class="styles.tableBox"
      role="grid"
      :aria-rowcount="processed.length"
      tabindex="0"
      @keydown="onGridKeydown"
      @scroll="handleScroll"
    >
      <table :class="styles.table">
        <thead :class="styles.thead">
          <HeaderRow
            :columns="cols"
            :selectable="selectable"
            :expandable="expandable"
            :sort="sortState"
            :i18n="i18n"
            :stickies="stickyClass"
            :thStyle="thStyle"
            :allSelected="allSelected"
            :someSelected="someSelected"
            @toggle:all="toggleAll"
            @sort:toggle="onSort"
            @resize:start="startResize"
            @drag:start="onDragStart"
            @drag:drop="onDrop"
          />
          <FiltersRow
            v-if="showFilters"
            :columns="cols"
            :filters="filterState"
            :showFilters="showFilters"
            :selectable="selectable"
            :expandable="expandable"
            :filterSlotProps="filterSlotProps"
            @filters:update="onFilterUpdate"
          />
        </thead>

        <!-- Non-virtual -->
        <tbody v-if="!virtualScroll">
          <tr v-if="loading">
            <Loading :colspan="colspan" :text="i18n.loading" />
          </tr>
          <tr v-else-if="error">
            <Error :colspan="colspan" :text="error || i18n.error" />
          </tr>
          <tr v-else-if="!pageRows.length">
            <Empty :colspan="colspan" :text="i18n.empty" />
          </tr>
          <BodyRows
            v-else
            :columns="cols"
            :pageRows="pageRows"
            :colspan="colspan"
            :selectable="selectable"
            :expandable="expandable"
            :rowStart="rowStart"
            :virtual="false"
            :visibleRows="[]"
            :startIndex="0"
            :topSpacer="0"
            :bottomSpacer="0"
            :cellValue="cellValue"
            :displayValue="displayValue"
            :keyOf="keyOf"
            :isSelected="isSelected"
            :isExpanded="isExpanded"
            :stickyClass="stickyClass"
            :tdStyle="tdStyle"
            @row:click="(e) => emit('row:click', e)"
            @row:select="onSelectRow"
            @row:expand="toggleExpand"
          />
        </tbody>

        <!-- Virtual -->
        <tbody v-else>
          <tr v-if="loading">
            <Loading :colspan="colspan" :text="i18n.loading" />
          </tr>
          <tr v-else-if="error">
            <Error :colspan="colspan" :text="error || i18n.error" />
          </tr>
          <tr v-else-if="!processed.length">
            <Empty :colspan="colspan" :text="i18n.empty" />
          </tr>
          <BodyRows
            v-else
            :columns="cols"
            :pageRows="[]"
            :colspan="colspan"
            :selectable="selectable"
            :expandable="expandable"
            :rowStart="startIndex"
            :virtual="true"
            :visibleRows="visibleRows"
            :startIndex="startIndex"
            :topSpacer="topSpacer"
            :bottomSpacer="bottomSpacer"
            :cellValue="cellValue"
            :displayValue="displayValue"
            :keyOf="keyOf"
            :isSelected="isSelected"
            :isExpanded="isExpanded"
            :stickyClass="stickyClass"
            :tdStyle="tdStyle"
            @row:click="(e) => emit('row:click', e)"
            @row:select="onSelectRow"
            @row:expand="toggleExpand"
          />
        </tbody>
      </table>
    </div>

    <div v-if="showFooter" :class="styles.footer">
      <FooterBar
        :pagination="pagination"
        :pageCount="pageCount"
        :pageSizeItems="pageSizeOptions"
        @pageSize="
          (val) => updatePagination({ ...pagination, pageSize: val, page: 1 })
        "
        @prev="prevPage"
        @next="nextPage"
      />
    </div>

    <span :class="styles.srOnly" aria-live="polite">{{ liveRegionText }}</span>
  </div>
</template>
