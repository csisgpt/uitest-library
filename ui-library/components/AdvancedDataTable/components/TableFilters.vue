<template>
  <div :class="[styles.root, isRtl ? styles.rtl : '']" role="row">
    <div v-if="hasRowExpansion" role="columnheader" />

    <div
      v-for="col in columns"
      :key="getFieldKey(col)"
      role="columnheader"
      :class="[styles.colsFilterBox]"
    >
      <template v-if="col.filterable">
        <!-- فیلتر سفارشی با اسلات -->
        <template
          v-if="
            col.filterType === 'custom' &&
            col.filterSlotName &&
            $slots[col.filterSlotName]
          "
        >
          <slot
            :name="col.filterSlotName"
            :model="local[getFieldKey(col)]"
            :update="(v: any) => updateCustom(getFieldKey(col), v)"
          />
        </template>

        <!-- متن -->
        <BaseInput
          v-else-if="!col.filterType || col.filterType === 'text'"
          v-model="local[getFieldKey(col)]"
          :placeholder="
            localeComputed === 'fa' ? i18n.searchFa(col) : i18n.searchEn(col)
          "
          variant="outline"
          size="sm"
          :fullWidth="true"
          :clearable="true"
          :aria-label="i18n.ariaText(col)"
          @update:modelValue="emitDebounced"
        />

        <!-- عدد (رنج) با BaseInput -->
        <div v-else-if="col.filterType === 'number'" :class="styles.rangeGroup">
          <BaseInput
            type="number"
            :model-value="getNumStr(getFieldKey(col), 'min')"
            @update:modelValue="(val) => setNum(getFieldKey(col), 'min', val)"
            :placeholder="localeComputed === 'fa' ? 'کمینه' : 'Min'"
            :aria-label="i18n.ariaNumberMin(col)"
            inputmode="decimal"
            :step="col.step ?? 'any'"
            :min="col.min ?? undefined"
            :max="col.max ?? undefined"
            variant="outline"
            size="sm"
            :fullWidth="true"
            :clearable="true"
            @clear="() => setNum(getFieldKey(col), 'min', '')"
          />
          <span :class="styles.rangeDash">–</span>
          <BaseInput
            type="number"
            :model-value="getNumStr(getFieldKey(col), 'max')"
            @update:modelValue="(val) => setNum(getFieldKey(col), 'max', val)"
            :placeholder="localeComputed === 'fa' ? 'بیشینه' : 'Max'"
            :aria-label="i18n.ariaNumberMax(col)"
            inputmode="decimal"
            :step="col.step ?? 'any'"
            :min="col.min ?? undefined"
            :max="col.max ?? undefined"
            variant="outline"
            size="sm"
            :fullWidth="true"
            :clearable="true"
            @clear="() => setNum(getFieldKey(col), 'max', '')"
          />
        </div>

        <!-- تاریخ (رنج) با BaseInput -->
        <div v-else-if="col.filterType === 'date'" :class="styles.rangeGroup">
          <input
            :class="[styles.input, styles.dateInput]"
            type="date"
            v-model="local[getFieldKey(col)].from"
            :aria-label="i18n.ariaDateFrom(col)"
            @input="emitDebounced"
          />
          <span :class="styles.rangeDash">–</span>
          <input
            :class="[styles.input, styles.dateInput]"
            type="date"
            v-model="local[getFieldKey(col)].to"
            :aria-label="i18n.ariaDateTo(col)"
            @input="emitDebounced"
          />
        </div>

        <!-- boolean: tri-state checkbox -->
        <div
          v-else-if="col.filterType === 'boolean'"
          :class="styles.booleanCell"
        >
          <BaseCheckbox
            :model-value="local[getFieldKey(col)] === true"
            :indeterminate="local[getFieldKey(col)] === 'all'"
            size="small"
            :label="localeComputed === 'fa' ? 'فعال' : 'Active'"
            :showStatus="false"
            @update:modelValue="onBooleanToggle(getFieldKey(col))"
            :aria-label="i18n.ariaBoolean(col)"
          />
        </div>

        <!-- انتخاب از لیست -->
        <BaseDropdown
          v-else-if="col.filterType === 'select'"
          v-model="local[getFieldKey(col)]"
          :items="col.filterOptions ?? []"
          item-title="label"
          item-value="value"
          size="sm"
          clearable
          :multiple="!!col.filterMultiple"
          :placeholder="col.field"
          :aria-label="i18n.ariaSelect(col)"
          @update:modelValue="emitDebounced"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import styles from "./TableFilters.module.css";
import BaseInput from "../../BaseInput/BaseInput.vue";
import type { Column, FilterModel } from "../types";
import { debounce } from "../utils/filterUtils";
import BaseCheckbox from "../../BaseCheckbox/BaseCheckbox.vue";
import BaseDropdown from "../../BaseDropdown/BaseDropdown.vue";
const props = withDefaults(
  defineProps<{
    columns: Column[];
    model: FilterModel;
    hasRowExpansion: boolean;
    debounceMs?: number;
    dir?: "rtl" | "ltr" | "auto";
    locale?: "fa" | "en";
  }>(),
  {
    debounceMs: 300,
    dir: "auto",
    locale: "fa",
  }
);

const emit = defineEmits<{ (e: "filter", model: FilterModel): void }>();

/* RTL / Locale */
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

/* مدل محلی */
const local = ref<Record<string, any>>({});

function getFieldKey(col: any) {
  return col.field ?? col.key;
}

function initLocal() {
  const next: Record<string, any> = { ...(props.model || {}) };
  for (const col of props.columns) {
    if (!col.filterable) continue;
    const k = getFieldKey(col);
    const t = col.filterType || "text";

    if (next[k] == null) {
      if (t === "number") next[k] = { min: null, max: null };
      else if (t === "date") next[k] = { from: "", to: "" };
      else if (t === "boolean") next[k] = "all";
      else if (t === "select") next[k] = col.filterMultiple ? [] : "";
      else next[k] = "";
    } else {
      if (t === "number" && (typeof next[k] !== "object" || next[k] == null))
        next[k] = { min: null, max: null };
      if (t === "date" && (typeof next[k] !== "object" || next[k] == null))
        next[k] = { from: "", to: "" };
      if (t === "select") {
        // نرمال‌سازی اگر از سینگل به مالتی یا برعکس سوییچ شده
        if (col.filterMultiple && !Array.isArray(next[k]))
          next[k] = next[k] ? [next[k]] : [];
        if (!col.filterMultiple && Array.isArray(next[k]))
          next[k] = next[k][0] ?? "";
      }
    }
  }
  local.value = next;
}
initLocal();

watch(
  () => [props.model, props.columns],
  () => initLocal(),
  { deep: true }
);

function updateCustom(field: string, value: any) {
  local.value[field] = value;
  emitDebounced();
}

/* خروجی */
function doEmit() {
  emit("filter", JSON.parse(JSON.stringify(local.value)));
}
const emitDebounced = debounce(doEmit, props.debounceMs);

/* پشتیبانی از ارقام فارسی/عربی برای عددی‌ها + نرمال‌سازی min/max */
const faToEnDigits = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)])
    .replace(/[٠-٩]/g, (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);

function toNum(val: unknown): number | null {
  if (val == null) return null;
  const str = String(val).trim();
  if (!str) return null;
  const n = Number(faToEnDigits(str).replace(/[^\d.\-+eE]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function getNumStr(field: string, edge: "min" | "max"): string {
  const v = local.value[field]?.[edge];
  return v == null ? "" : String(v);
}

function setNum(field: string, edge: "min" | "max", raw: string) {
  if (!local.value[field]) local.value[field] = { min: null, max: null };
  local.value[field][edge] = toNum(raw);

  const r = local.value[field];
  if (r.min != null && r.max != null && r.min > r.max) {
    [r.min, r.max] = [r.max, r.min];
  }
  emitDebounced();
}

/* i18n */
const i18n = {
  searchFa: (col: Column) => `جستجو در ${col.header || col.field || ""}…`,
  searchEn: (col: Column) => `Search ${col.header || col.field || ""}…`,
  ariaText: (col: Column) =>
    localeComputed.value === "fa"
      ? `ورودی فیلتر متن ${col.header}`
      : `Text filter for ${col.header}`,
  ariaNumberMin: (col: Column) =>
    localeComputed.value === "fa"
      ? `حداقل ${col.header}`
      : `Minimum ${col.header}`,
  ariaNumberMax: (col: Column) =>
    localeComputed.value === "fa"
      ? `حداکثر ${col.header}`
      : `Maximum ${col.header}`,
  ariaDateFrom: (col: Column) =>
    localeComputed.value === "fa"
      ? `از تاریخ برای ${col.header}`
      : `From date for ${col.header}`,
  ariaDateTo: (col: Column) =>
    localeComputed.value === "fa"
      ? `تا تاریخ برای ${col.header}`
      : `To date for ${col.header}`,
  ariaBoolean: (col: Column) =>
    localeComputed.value === "fa"
      ? `فیلتر بولین برای ${col.header}`
      : `Boolean filter for ${col.header}`,
  ariaSelect: (col: Column) =>
    localeComputed.value === "fa"
      ? `انتخاب مقدار برای ${col.header}`
      : `Select value for ${col.header}`,
};

function onBooleanToggle(field: string) {
  const cur = local.value[field];
  // ترتیب چرخش: all -> true -> false -> all
  const next = cur === "all" ? true : cur === true ? false : "all";
  local.value[field] = next;
  emitDebounced();
}

function clearBoolean(field: string) {
  local.value[field] = "all";
  emitDebounced();
}
</script>
