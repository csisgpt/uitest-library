<template>
  <div
    :class="[
      $style.segment,
      $style[size],
      $style[`variant_${variant}`],
      $style[`mode_${mode}`],
      {
        [$style.fullWidth]: fullWidth,
        [$style.disabled]: disabled,
        [$style.readonly]: readonly,
        [$style.pill]: shape === 'pill',
        [$style.rounded]: shape === 'rounded',
        [$style.multiple]: multiple,
        [$style.scrollable]: scrollable,
      },
    ]"
    :style="segInlineStyle"
    :role="multiple ? 'group' : 'radiogroup'"
    :aria-required="!multiple && required ? true : undefined"
    :aria-disabled="disabled ? true : undefined"
    :aria-label="ariaLabel || label || 'Segmented buttons'"
    ref="root"
    @keydown="onKeydown"
  >
    <!-- Live region for SR -->

    <!-- Active indicator (single-select only) -->
    <div
      v-if="!multiple && indicator.visible"
      :class="[
        $style.indicator,
        { [$style.pill]: shape === 'pill', [$style.rounded]: shape === 'rounded' },
      ]"
      :style="{
        width: (100 / normalizedItems.length) + '%',
        transform: `translateX(${indicator.x}px)`,
      }"
      aria-hidden="true"
    />

    <!-- Items -->
    <button
      v-for="(it, idx) in normalizedItems"
      :key="String(it.value)"
      type="button"
      :class="[
        $style.item,
        isActive(it.value) && $style.active,
        isItemDisabled(it) && $style.itemDisabled,
        it.icon && !it.label && $style.iconOnly,
      ]"
      style="width: 100%;display: flex; justify-content: center;"
      :role="multiple ? 'button' : 'radio'"
      :tabindex="getTabIndex(it.value, idx)"
      :aria-checked="!multiple ? isActive(it.value) : undefined"
      :aria-pressed="multiple ? isActive(it.value) : undefined"
      :aria-disabled="disabled || isItemDisabled(it) ? true : undefined"
      :disabled="disabled || isItemDisabled(it)"
      :aria-label="it.label ? undefined : String(it.value)"
      :ref="(el) => setItemRef(el as HTMLButtonElement | null, idx)"
      @click="onSelect(it)"
    >
      <span v-if="it.icon" :class="$style.iconWrap">
        <BaseIcon :name="it.icon" :size="iconSizeMap[size]" />
      </span>
      <span v-if="it.label" :class="[$style.size]">{{ it.label }}</span>
    </button>

    <!-- Hidden inputs for forms -->
    <template v-if="name">
      <input
        v-if="!multiple"
        type="hidden"
        :name="name"
        :value="modelSingle != null ? String(modelSingle) : ''"
      />
      <template v-else>
        <input
          v-for="(val, i) in modelArray"
          :key="i"
          type="hidden"
          :name="name"
          :value="String(val)"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import BaseIcon from "../BaseIcon/BaseIcon.vue";

type V = string | number;
export interface SegmentItem {
  label?: string;
  value: V;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: V | V[] | null;
    items?: Array<SegmentItem | V>;
    label?: string;
    name?: string;
    size?: "sm" | "md" | "lg";
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "tertiary"
      | "success"
      | "warning"
      | "info"
      | "error"
      | "danger"
      | "light"
      | "medium"
      | "dark"
      | "outline"
      | "ghost";
    shape?: "pill" | "rounded";
    fullWidth?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    multiple?: boolean;
    required?: boolean;
    allowEmpty?: boolean;
    ariaLabel?: string;
    scrollable?: boolean;
    mode?: "ios" | "md";
  }>(),
  {
    size: "md",
    variant: "primary",
    shape: "pill",
    fullWidth: false,
    disabled: false,
    readonly: false,
    multiple: false,
    required: false,
    allowEmpty: true,
    scrollable: false,
    mode: "md",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: V | V[] | null): void;
  (e: "change", v: V | V[] | null): void;
}>();

/** Inline variables: accent + track + density (padding) */
const segInlineStyle = computed(() => {
  const accentMap: Record<string, string> = {
    default: "var(--color-primary)",
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    tertiary: "var(--color-tertiary, var(--color-info))",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    info: "var(--color-info)",
    error: "var(--color-error)",
    danger: "var(--color-error)",
    light: "var(--color-text)",
    medium: "var(--color-text)",
    dark: "var(--color-text)",
    outline: "var(--color-primary)",
    ghost: "var(--color-primary)",
  };
  const tintPctMap: Record<string, number> = {
    default: 6, light: 3, medium: 8, dark: 14,
    primary: 14, secondary: 12, tertiary: 12, success: 12, warning: 12, info: 12, error: 12, danger: 12,
    outline: 6, ghost: 6,
  };

  const accent = accentMap[props.variant ?? "primary"] ?? "var(--color-primary)";
  const pct = tintPctMap[props.variant ?? "default"] ?? 6;

  const sizePadding: Record<typeof props.size, string> = {
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
  };

  const style: Record<string, string> = {
    "--seg-accent": accent,
    "--seg-item-px": sizePadding[props.size ?? "md"],
  };

  if (props.mode === "md") {
    style["--seg-track-bg"] = "transparent";
  } else {
    style["--seg-track-bg"] =
      props.variant === "outline" || props.variant === "ghost"
        ? "color-mix(in srgb, var(--color-text) 6%, var(--color-surface))"
        : `color-mix(in srgb, ${accent} ${pct}%, var(--color-surface))`;
  }
  return style;
});

/* Normalize items */
const normalizedItems = computed<SegmentItem[]>(() =>
  (props.items ?? []).map((it) =>
    typeof it === "object" ? (it as SegmentItem) : { value: it as V, label: String(it) }
  )
);

function isItemDisabled(it: SegmentItem) {
  return !!it.disabled;
}

/* Model helpers */
const isActive = (val: V) =>
  props.multiple
    ? Array.isArray(props.modelValue)
      ? (props.modelValue as V[]).includes(val)
      : false
    : props.modelValue === val;

const modelArray = computed<V[]>(() =>
  Array.isArray(props.modelValue) ? (props.modelValue as V[]) : []
);
const modelSingle = computed<V | null>(() =>
  Array.isArray(props.modelValue) ? null : props.modelValue ?? null
);

function setSingle(next: V | null) {
  if (props.multiple) return;
  if (props.required && next == null) return;
  if (!props.allowEmpty && modelSingle.value != null && next == null) return;
  emit("update:modelValue", next);
  emit("change", next);
}
function setMultiple(next: V) {
  if (!props.multiple) return;
  const curr = new Set(modelArray.value);
  curr.has(next) ? curr.delete(next) : curr.add(next);
  const arr = Array.from(curr);
  emit("update:modelValue", arr);
  emit("change", arr);
}
function onSelect(it: SegmentItem) {
  if (props.readonly || props.disabled || isItemDisabled(it)) return;
  props.multiple ? setMultiple(it.value) : setSingle(isActive(it.value) ? null : it.value);
  nextTick(updateIndicator);
}

/* A11y live text */
const liveStatus = computed(() => {
  if (props.multiple) {
    const sel = normalizedItems.value
      .filter((i) => isActive(i.value))
      .map((i) => i.label ?? String(i.value));
    return sel.length ? `Selected: ${sel.join(", ")}` : "No option selected";
  } else {
    const curr = normalizedItems.value.find((i) => isActive(i.value));
    return curr ? `${curr.label ?? curr.value} selected` : "No option selected";
  }
});

/* Indicator */
const root = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLButtonElement[]>([]);
function setItemRef(el: HTMLButtonElement | null, idx: number) {
  if (el) itemRefs.value[idx] = el;
}
const indicator = reactive({ visible: false, width: 0, x: 0 });

function updateIndicator() {
  if (props.multiple) {
    indicator.visible = false;
    return;
  }
  const rootEl = root.value;
  const idx = normalizedItems.value.findIndex((i) => isActive(i.value));
  if (!rootEl || idx < 0) { indicator.visible = false; return; }

  const btn = itemRefs.value[idx];
  if (!btn) { indicator.visible = false; return; }

  const rootRect = rootEl.getBoundingClientRect();
  const rect = btn.getBoundingClientRect();
  const inset = props.mode === "md" ? 0 : 4; // thumb inset iOS
  indicator.width = Math.max(0, rect.width - inset);
  indicator.x = rect.left - rootRect.left + inset / 2 + rootEl.scrollLeft;
  indicator.visible = true;
}

/* Resize/scroll observers */
let ro: ResizeObserver | null = null;
function watchResize() {
  if (!root.value) return;
  ro = new ResizeObserver(() => updateIndicator());
  ro.observe(root.value);
  itemRefs.value.forEach((b) => b && ro?.observe(b));
}
function unwatchResize() {
  ro?.disconnect();
  ro = null;
}

onMounted(async () => {
  await nextTick();
  updateIndicator();
  watchResize();
  window.addEventListener("resize", updateIndicator, { passive: true });
  root.value?.addEventListener("scroll", updateIndicator, { passive: true });
});
onBeforeUnmount(() => {
  unwatchResize();
  window.removeEventListener("resize", updateIndicator);
  root.value?.removeEventListener("scroll", updateIndicator);
});

/* Watchers */
watch(() => props.modelValue, () => nextTick(updateIndicator));
watch(normalizedItems, async () => {
  itemRefs.value = [];
  await nextTick();
  unwatchResize();
  updateIndicator();
  watchResize();
});

/* Keyboard */
function focusAt(idx: number) { itemRefs.value[idx]?.focus(); }
function currentIndex() { return itemRefs.value.findIndex((el) => el === document.activeElement); }
function getTabIndex(val: V, idx: number) {
  if (props.disabled) return -1;
  if (props.multiple) return 0;
  const active = modelSingle.value;
  if (active == null) return idx === 0 ? 0 : -1;
  return active === val ? 0 : -1;
}
function onKeydown(e: KeyboardEvent) {
  const i = currentIndex(); if (i === -1) return;
  const count = itemRefs.value.length;
  const next = (i + 1) % count;
  const prev = (i - 1 + count) % count;

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault(); focusAt(next);
    if (!props.multiple && !props.readonly) { const it = normalizedItems.value[next]; if (it) onSelect(it); }
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault(); focusAt(prev);
    if (!props.multiple && !props.readonly) { const it = normalizedItems.value[prev]; if (it) onSelect(it); }
  } else if (e.key === "Home") {
    e.preventDefault(); focusAt(0);
    if (!props.multiple && !props.readonly) onSelect(normalizedItems.value[0]);
  } else if (e.key === "End") {
    e.preventDefault(); focusAt(count - 1);
    if (!props.multiple && !props.readonly) onSelect(normalizedItems.value[count - 1]);
  } else if (e.key === " " || e.key === "Enter") {
    e.preventDefault(); const it = normalizedItems.value[i]; if (it) onSelect(it);
  }
}

const iconSizeMap = { sm: 14, md: 16, lg: 18 } as const;
</script>

<style src="./BaseSegment.module.css" module></style>
