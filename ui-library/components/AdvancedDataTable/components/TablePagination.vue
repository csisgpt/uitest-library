<template>
  <div
    :class="[
      styles.footerRoot,
      densityClass,
      isRtl ? styles.rtl : '',
      variantClass,
    ]"
    role="navigation"
    :aria-label="i18n.aria.pagination"
  >
    <!-- بخش شروع: قابل توسعه با اسلات -->
    <div :class="styles.cluster">
      <slot name="start" />
      <div v-if="showSummary" :class="styles.summary" :title="summaryTitle">
        <template v-if="pagination.total > 0">
          <template v-if="localeComputed === 'fa'">
            {{ rangeStartFa }}–{{ rangeEndFa }}
            <span :class="styles.of">{{ i18n.of }} {{ totalFa }}</span>
          </template>
          <template v-else>
            {{ rangeStart }}–{{ rangeEnd }}
            <span :class="styles.of">/ {{ pagination.total }}</span>
          </template>
        </template>
        <template v-else>0 / 0</template>
      </div>
    </div>

    <!-- Pager -->
    <div v-if="!shouldHidePager" :class="styles.pager" aria-live="polite">
      <template v-for="ctrl in pagerOrder" :key="ctrl">
        <!-- first -->
        <button
          v-if="ctrl === 'first' && showFirstLast"
          :class="[styles.btn, styles.btnGhost]"
          type="button"
          :disabled="isFirstPage"
          @click="first"
          :aria-label="i18n.aria.first"
          :title="i18n.first"
        >
          {{ icons.first }}
        </button>

        <!-- prev -->
        <button
          v-else-if="ctrl === 'prev' && showPrevNext"
          :class="[styles.btn, styles.btnGhost]"
          type="button"
          :disabled="isFirstPage"
          @click="prev"
          :aria-label="i18n.aria.prev"
          :title="i18n.prev"
        >
          {{ icons.prev }}
        </button>
        <!-- next -->
        <button
          v-else-if="ctrl === 'next' && showPrevNext"
          :class="[styles.btn, styles.btnGhost]"
          type="button"
          :disabled="isLastPage"
          @click="next"
          :aria-label="i18n.aria.next"
          :title="i18n.next"
        >
          {{ icons.next }}
        </button>

        <!-- last -->
        <button
          v-else-if="ctrl === 'last' && showFirstLast"
          :class="[styles.btn, styles.btnGhost]"
          type="button"
          :disabled="isLastPage"
          @click="last"
          :aria-label="i18n.aria.last"
          :title="i18n.last"
        >
          {{ icons.last }}
        </button>
        <!-- page (input + count) -->
        <div
          v-else-if="ctrl === 'page' && showPageInput"
          :class="styles.pageDisplay"
        >
          <input
            :class="[
              styles.pageInput,
              localeComputed === 'fa' ? styles.pageInputFa : '',
            ]"
            type="number"
            :min="1"
            :max="pageCount"
            v-model.number="pageInput"
            @keydown.enter.prevent="applyPageInput"
            @blur="applyPageInput"
            :aria-label="i18n.aria.current(pageCount)"
            :inputmode="localeComputed === 'fa' ? 'numeric' : 'decimal'"
          />
          <span :class="styles.slash">/</span>
          <span style="width: 100%;">{{ pageCount }}</span>
        </div>
      </template>
    </div>

    <!-- Page size + بخش پایان: قابل توسعه با اسلات -->
    <div :class="styles.clusterEnd">
      <div v-if="showPageSize" :class="styles.pageSize">
        <label :class="styles.pageSizeLabel" :for="idSelect">
          {{ i18n.rowsPerPage }}
        </label>
        <select
          :id="idSelect"
          :class="styles.select"
          :value="pagination.pageSize"
          @change="onPageSizeChange(($event.target as HTMLSelectElement).value)"
          :aria-label="i18n.rowsPerPage"
        >
          <option v-for="s in pageSizeOptions" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>
      <slot name="end" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import styles from "./TablePagination.module.css";
import type { Pagination } from "../types";

type PagerCtrl = "first" | "prev" | "page" | "next" | "last";

const props = withDefaults(
  defineProps<{
    pagination: Pagination;
    pageSizeOptions?: number[];
    /* نمایش بخش‌ها */
    showSummary?: boolean;
    showPageSize?: boolean;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
    showPageInput?: boolean;
    hideOnSinglePage?: boolean;

    /* جهت و زبان */
    dir?: "rtl" | "ltr" | "auto";
    locale?: "fa" | "en";

    /* چیدمان و ظاهر */
    order?: PagerCtrl[];
    density?: "compact" | "comfortable" | "spacious";
    variant?: "surface" | "transparent"; // پس‌زمینه سطح یا شفاف
  }>(),
  {
    pageSizeOptions: () => [10, 20, 50, 100],
    showSummary: false,
    showPageSize: true,
    showFirstLast: false,
    showPrevNext: true,
    showPageInput: true,
    hideOnSinglePage: false,

    dir: "rtl",
    density: "comfortable",
    variant: "surface",
  }
);

const emit = defineEmits<{
  (e: "update:pagination", value: Pagination): void;
}>();

/* RTL/LTR و Locale */
const isRtl = computed(() => {
  if (props.dir === "rtl") return true;
  if (props.dir === "ltr") return false;
  if (typeof window !== "undefined") {
    const el = document.documentElement;
    const attr = (
      el.getAttribute("dir") ||
      el.style.direction ||
      ""
    ).toLowerCase();
    return attr === "rtl";
  }
  return false;
});
const localeComputed = computed<"fa" | "en">(
  () => props.locale ?? (isRtl.value ? "fa" : "en")
);

/* ترجمه و آیکن‌ها */
const i18n = computed(() => {
  if (localeComputed.value === "fa") {
    return {
      first: "اولین",
      prev: "قبلی",
      next: "بعدی",
      last: "آخرین",
      rowsPerPage: "ردیف در هر صفحه",
      of: "از",
      aria: {
        pagination: "صفحه‌بندی جدول",
        first: "رفتن به اولین صفحه",
        prev: "رفتن به صفحه قبلی",
        next: "رفتن به صفحه بعدی",
        last: "رفتن به آخرین صفحه",
        current: (pc: number) => `صفحه فعلی، مجموع ${pc}`,
      },
    };
  }
  return {
    first: "First",
    prev: "Previous",
    next: "Next",
    last: "Last",
    rowsPerPage: "Rows per page",
    of: "of",
    aria: {
      pagination: "Table pagination",
      first: "Go to first page",
      prev: "Go to previous page",
      next: "Go to next page",
      last: "Go to last page",
      current: (pc: number) => `Current page, total ${pc}`,
    },
  };
});
const icons = computed(() =>
  isRtl.value
    ? // RTL: prev ▶ (راست)، next ◀ (چپ)، first ⏭ (راست)، last ⏮ (چپ)
      { first: "⏮", prev: "◀", next: "▶", last: "⏭" }
    : // LTR: prev ◀ (چپ)، next ▶ (راست)، first ⏮ (چپ)، last ⏭ (راست)
      { first: "⏭", prev: "▶", next: "◀", last: "⏮" }
);

/* محاسبات صفحه */
const pageCount = computed(() => {
  const size = Math.max(1, props.pagination.pageSize || 1);
  const total = Math.max(0, props.pagination.total || 0);
  return Math.max(1, Math.ceil(total / size));
});
const isFirstPage = computed(() => props.pagination.page <= 1);
const isLastPage = computed(() => props.pagination.page >= pageCount.value);

const rangeStart = computed(() =>
  props.pagination.total === 0
    ? 0
    : (props.pagination.page - 1) * props.pagination.pageSize + 1
);
const rangeEnd = computed(() =>
  Math.min(
    props.pagination.total,
    props.pagination.page * props.pagination.pageSize
  )
);

/* نمایش اعداد فارسی در Summary */
const toFa = (n: number) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
const rangeStartFa = computed(() => toFa(rangeStart.value));
const rangeEndFa = computed(() => toFa(rangeEnd.value));
const totalFa = computed(() => toFa(props.pagination.total || 0));
const summaryTitle = computed(() =>
  localeComputed.value === "fa"
    ? `${rangeStartFa.value}–${rangeEndFa.value} ${i18n.value.of} ${totalFa.value}`
    : `${rangeStart.value}–${rangeEnd.value} / ${props.pagination.total}`
);

/* کنترل ورودی صفحه */
const pageInput = ref(props.pagination.page);
watch(
  () => props.pagination.page,
  (p) => (pageInput.value = p)
);

function update(patch: Partial<Pagination>) {
  const next = { ...props.pagination, ...patch };
  next.page = Math.min(
    Math.max(1, next.page),
    Math.max(1, Math.ceil((next.total || 0) / Math.max(1, next.pageSize)))
  );
  emit("update:pagination", next);
}
function first() {
  if (!isFirstPage.value) update({ page: 1 });
}
function prev() {
  if (!isFirstPage.value) update({ page: props.pagination.page - 1 });
}
function next() {
  if (!isLastPage.value) update({ page: props.pagination.page + 1 });
}
function last() {
  if (!isLastPage.value) update({ page: pageCount.value });
}
function applyPageInput() {
  const n = Number(pageInput.value);
  if (Number.isFinite(n)) update({ page: n });
  else pageInput.value = props.pagination.page;
}
function onPageSizeChange(val: string) {
  const size = Math.max(1, Number(val) || props.pagination.pageSize);
  update({ pageSize: size, page: 1 });
}

/* نمایش/چیدمان Pager */
const shouldHidePager = computed(
  () => props.hideOnSinglePage && pageCount.value <= 1
);
const defaultOrderRtl: PagerCtrl[] = ["next", "last", "page", "first", "prev"];
const defaultOrderLtr: PagerCtrl[] = ["first", "prev", "page", "next", "last"];
const pagerOrder = computed<PagerCtrl[]>(() =>
  props.order?.length
    ? props.order
    : isRtl.value
    ? defaultOrderRtl
    : defaultOrderLtr
);

/* Density & Variant */
const densityClass = computed(() =>
  props.density === "compact"
    ? styles.compact
    : props.density === "spacious"
    ? styles.spacious
    : styles.comfortable
);
const variantClass = computed(() =>
  props.variant === "transparent" ? styles.transparent : styles.surface
);

/* شناسه‌ها */
const idSelect = `tbl-ps-${Math.random().toString(36).slice(2)}`;
</script>
