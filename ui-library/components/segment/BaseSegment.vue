<script setup lang="ts">
import { ref, computed, provide, watch, onMounted, onBeforeUnmount, nextTick, useSlots } from 'vue';
import BaseSegmentButton from './BaseSegmentButton.vue';
import styles from './BaseSegment.module.css';

export type SegmentValue = string | number;

export interface SegmentItem {
  label?: string;
  value: SegmentValue;
  icon?: string;
  disabled?: boolean;
}

export interface BaseSegmentProps {
  modelValue?: SegmentValue | SegmentValue[] | null;
  items?: Array<SegmentItem | SegmentValue>;
  label?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'outline' | 'ghost';
  shape?: 'pill' | 'rounded';
  fullWidth?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  multiple?: boolean;
  required?: boolean;
  allowEmpty?: boolean;
  ariaLabel?: string;
  scrollable?: boolean;
  mode?: 'ios' | 'md';
}

export const segmentInjectionKey = Symbol('BaseSegment');

interface SegmentItemData {
  el: HTMLElement;
  disabled: boolean;
}

interface SegmentContext {
  size: BaseSegmentProps['size'];
  variant: BaseSegmentProps['variant'];
  mode: BaseSegmentProps['mode'];
  disabled: ComputedRef<boolean>;
  readonly: ComputedRef<boolean>;
  multiple: boolean;
  select: (v: SegmentValue) => void;
  isActive: (v: SegmentValue) => boolean;
  register: (v: SegmentValue, el: HTMLElement, disabled: boolean) => void;
  unregister: (v: SegmentValue) => void;
  setDisabled: (v: SegmentValue, disabled: boolean) => void;
  getTabIndex: (v: SegmentValue, disabled: boolean) => number;
}

const props = withDefaults(defineProps<BaseSegmentProps>(), {
  size: 'md',
  variant: 'primary',
  shape: 'pill',
  fullWidth: false,
  disabled: false,
  readonly: false,
  multiple: false,
  required: false,
  allowEmpty: true,
  scrollable: false,
  mode: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: SegmentValue | SegmentValue[] | null): void;
  (e: 'change', value: SegmentValue | SegmentValue[] | null): void;
}>();

const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);

const root = ref<HTMLElement>();
const indicatorRef = ref<HTMLElement>();
const internalValue = ref<SegmentValue | SegmentValue[] | null>(props.modelValue ?? (props.multiple ? [] : null));

watch(() => props.modelValue, v => {
  internalValue.value = v ?? (props.multiple ? [] : null);
});

watch(internalValue, v => emit('update:modelValue', v));

function isActive(v: SegmentValue): boolean {
  return props.multiple
    ? Array.isArray(internalValue.value) && internalValue.value.includes(v)
    : internalValue.value === v;
}

function select(v: SegmentValue) {
  if (props.disabled || props.readonly) return;
  if (props.multiple) {
    const arr = Array.isArray(internalValue.value) ? [...internalValue.value] : [];
    const idx = arr.indexOf(v);
    if (idx >= 0) {
      if (props.required && arr.length <= 1 && !props.allowEmpty) return;
      arr.splice(idx, 1);
    } else {
      arr.push(v);
    }
    internalValue.value = arr;
    emit('change', internalValue.value);
  } else {
    const current = internalValue.value as SegmentValue | null;
    if (current === v) {
      if (!props.allowEmpty) return;
      internalValue.value = null;
    } else {
      internalValue.value = v;
    }
    emit('change', internalValue.value);
  }
  nextTick(updateIndicator);
}

const items = new Map<SegmentValue, SegmentItemData>();
const order = ref<SegmentValue[]>([]);

function register(value: SegmentValue, el: HTMLElement, disabled: boolean) {
  items.set(value, { el, disabled });
  if (!order.value.includes(value)) order.value.push(value);
  ro.observe(el);
  nextTick(updateIndicator);
}

function unregister(value: SegmentValue) {
  const item = items.get(value);
  if (item) ro.unobserve(item.el);
  items.delete(value);
  order.value = order.value.filter(v => v !== value);
  nextTick(updateIndicator);
}

function setDisabled(value: SegmentValue, disabled: boolean) {
  const item = items.get(value);
  if (item) item.disabled = disabled;
}

function getTabIndex(value: SegmentValue, disabled: boolean) {
  if (props.disabled || disabled) return -1;
  if (props.multiple) return 0;
  if (isActive(value)) return 0;
  const current = internalValue.value as SegmentValue | null;
  if (current == null) {
    const first = order.value.find(v => !items.get(v)?.disabled);
    return value === first ? 0 : -1;
  }
  return -1;
}

const ctx: SegmentContext = {
  size: props.size,
  variant: props.variant,
  mode: props.mode,
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  multiple: props.multiple,
  select,
  isActive,
  register,
  unregister,
  setDisabled,
  getTabIndex,
};

provide(segmentInjectionKey, ctx);

const indicatorWidth = ref(0);
const indicatorX = ref(0);

function updateIndicator() {
  if (props.multiple) return;
  const val = internalValue.value as SegmentValue | null;
  if (!val) {
    indicatorWidth.value = 0;
    indicatorX.value = 0;
    return;
  }
  const item = items.get(val);
  const el = item?.el;
  if (!el || !root.value) return;
  const parent = root.value;
  const parentRect = parent.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const dir = getComputedStyle(parent).direction;
  const scrollLeft = parent.scrollLeft;
  let x = elRect.left - parentRect.left + scrollLeft;
  if (dir === 'rtl') {
    x = parentRect.right - elRect.right + scrollLeft;
  }
  indicatorWidth.value = elRect.width;
  indicatorX.value = x;
}

const ro = new ResizeObserver(() => updateIndicator());

onMounted(() => {
  if (root.value) ro.observe(root.value);
  updateIndicator();
});

onBeforeUnmount(() => ro.disconnect());

function onKeydown(e: KeyboardEvent) {
  const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End', ' ', 'Enter'];
  if (!keys.includes(e.key)) return;
  const enabled = order.value.filter(v => !items.get(v)?.disabled);
  const activeEl = document.activeElement as HTMLElement | null;
  const current = enabled.find(v => items.get(v)?.el === activeEl);
  let index = current ? enabled.indexOf(current) : -1;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    index = index < enabled.length - 1 ? index + 1 : 0;
    items.get(enabled[index])?.el.focus();
    e.preventDefault();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    index = index > 0 ? index - 1 : enabled.length - 1;
    items.get(enabled[index])?.el.focus();
    e.preventDefault();
  } else if (e.key === 'Home') {
    items.get(enabled[0])?.el.focus();
    e.preventDefault();
  } else if (e.key === 'End') {
    items.get(enabled[enabled.length - 1])?.el.focus();
    e.preventDefault();
  } else if (e.key === ' ' || e.key === 'Enter') {
    if (current != null) select(current);
    e.preventDefault();
  }
}

const normalizedItems = computed<SegmentItem[]>(() => {
  if (!props.items) return [];
  return props.items.map(i => {
    if (typeof i === 'object' && 'value' in i) return i as SegmentItem;
    return { label: String(i), value: i as SegmentValue };
  });
});

const liveMessage = computed(() => {
  if (props.multiple) {
    return Array.isArray(internalValue.value) ? internalValue.value.join(', ') : '';
  }
  return internalValue.value != null ? String(internalValue.value) : '';
});

const hiddenValues = computed(() => {
  if (!props.name) return [] as SegmentValue[];
  if (props.multiple) return Array.isArray(internalValue.value) ? internalValue.value : [];
  return internalValue.value != null ? [internalValue.value] : [];
});

const labelId = `seg-${Math.random().toString(36).slice(2, 8)}`;

const cls = computed(() => [
  styles.segment,
  styles[`mode_${props.mode}`],
  styles[props.size],
  styles[props.shape],
  styles[`variant_${props.variant}`],
  props.fullWidth && styles.fullWidth,
  props.scrollable && styles.scrollable,
  props.disabled && styles.disabled,
  props.readonly && styles.readonly,
  props.multiple && styles.multiple,
]);

const indicatorStyle = computed(() => ({
  width: `${indicatorWidth.value}px`,
  transform: `translateX(${indicatorX.value}px)`,
}));
</script>

<template>
  <div
    ref="root"
    :class="cls"
    :role="multiple ? 'group' : 'radiogroup'"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
    :aria-label="ariaLabel"
    :aria-labelledby="label ? labelId : undefined"
    @keydown="onKeydown"
  >
    <span v-if="label" :id="labelId" class="visually-hidden">{{ label }}</span>
    <template v-if="!hasDefaultSlot && normalizedItems.length">
      <BaseSegmentButton
        v-for="item in normalizedItems"
        :key="item.value"
        :value="item.value"
        :label="item.label"
        :icon="item.icon"
        :disabled="item.disabled"
      />
    </template>
    <slot v-else />
    <div v-if="!multiple" ref="indicatorRef" :class="styles.indicator" :style="indicatorStyle" />
    <input
      v-for="val in hiddenValues"
      :key="val"
      type="hidden"
      :name="name"
      :value="val"
    />
    <span aria-live="polite" class="visually-hidden">{{ liveMessage }}</span>
  </div>
</template>

<style module src="./BaseSegment.module.css"></style>
