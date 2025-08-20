<script setup lang="ts">
import { computed, defineEmits, defineProps, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch, withDefaults, defineExpose } from 'vue';
import s from './BasePopover.module.css';

type PlacementBase = 'top'|'bottom'|'left'|'right';
type Placement =
  | PlacementBase
  | 'top-start'|'top-end'
  | 'bottom-start'|'bottom-end'
  | 'left-start'|'left-end'
  | 'right-start'|'right-end';

type TriggerType = 'click'|'hover'|'focus'|'manual';
type Strategy = 'absolute'|'fixed';

type PanelRole = 'dialog'|'menu'|'listbox'|'tooltip';

type Color = 'primary'|'success'|'error'|'warning'|'info'|'neutral';
type Variant = 'solid'|'soft'|'outline';
type Size = 'sm'|'md'|'lg';
type Rounded = 'sm'|'md'|'lg'|'full';

interface Props {
  modelValue?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;

  placement?: Placement;
  offset?: number;
  strategy?: Strategy;
  flip?: boolean;

  trigger?: TriggerType;
  openDelay?: number;
  closeDelay?: number;

  closeOnEsc?: boolean;
  closeOnOutside?: boolean;
  matchTriggerWidth?: boolean;
  portal?: boolean;

  arrow?: boolean;
  arrowSize?: number;

  autoFocus?: 'first'|'container'|false;

  id?: string;
  panelClass?: string;
  triggerTag?: keyof HTMLElementTagNameMap | 'button';

  /** A11y role (پیش‌فرض dialog) */
  role?: PanelRole;

  /** تم‌ها مانند BaseBadge */
  color?: Color;
  variant?: Variant;
  size?: Size;
  rounded?: Rounded;
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
  disabled: false,

  placement: 'bottom-start',
  offset: 8,
  strategy: 'absolute',
  flip: true,

  trigger: 'click',
  openDelay: 75,
  closeDelay: 100,

  closeOnEsc: true,
  closeOnOutside: true,
  matchTriggerWidth: false,
  portal: true,

  arrow: true,
  arrowSize: 8,

  autoFocus: 'first',

  triggerTag: 'button',
  role: 'dialog',

  color: 'neutral',
  variant: 'soft',
  size: 'md',
  rounded: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
  (e: 'toggle', v: boolean): void;
  (e: 'positioned', payload: { top: number; left: number; placement: Placement }): void;
}>();

// ---------- State ----------
const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const arrowRef = ref<HTMLElement | null>(null);

const state = reactive({
  internalOpen: props.defaultOpen,
  panelStyles: {
    top: '0px',
    left: '0px',
    '--popover-position': props.strategy,
    position: props.strategy as Strategy,
  } as Record<string, string>,
  arrowStyles: {} as Record<string, string>,
  placementResolved: props.placement as Placement,
});

const isControlled = computed(() => props.modelValue !== undefined);
const isOpen = computed<boolean>(() => (isControlled.value ? !!props.modelValue : state.internalOpen));

function setOpen(v: boolean) {
  if (props.disabled) return;
  if (isControlled.value) emit('update:modelValue', v);
  else state.internalOpen = v;
  emit(v ? 'open' : 'close');
  emit('toggle', v);
}

function open() { if (!isOpen.value) setOpen(true); }
function close() { if (isOpen.value) setOpen(false); }
function toggle() { setOpen(!isOpen.value); }

// ---------- IDs & ARIA ----------
let uidCounter = 0;
function genId() {
  if (typeof window === 'undefined') return `bp-${++uidCounter}`;
  // SSR-safe
  return (crypto as any)?.randomUUID?.() ?? `bp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
}

const localId = ref(props.id || '');
onMounted(() => { if (!localId.value) localId.value = genId(); });
const baseId = computed(() => localId.value || 'bp-fallback');
const triggerId = computed(() => `${baseId.value}-trigger`);
const panelId = computed(() => `${baseId.value}-panel`);

// ---------- Positioning ----------
function getViewportRect() {
  return { width: window.innerWidth, height: window.innerHeight };
}
function getRects() {
  const trigger = triggerRef.value!;
  const panel = panelRef.value!;
  const tr = trigger.getBoundingClientRect();
  const pr = panel.getBoundingClientRect();
  return { triggerRect: tr, panelRect: pr };
}

function getDocumentDirection() {
  const html = document?.documentElement;
  const dirAttr = html?.getAttribute('dir');
  if (dirAttr) return dirAttr.toLowerCase();
  return window.getComputedStyle(html!).direction;
}

function applyPosition() {
  const trigger = triggerRef.value;
  const panel = panelRef.value;
  if (!trigger || !panel) return;

  const { triggerRect, panelRect } = getRects();
  const vp = getViewportRect();

  const [sideRaw, alignRaw] = props.placement.split('-') as [PlacementBase, 'start'|'end'|undefined];
  let side: PlacementBase = sideRaw ?? 'bottom';
  let align: 'start'|'center'|'end' = alignRaw ?? 'start';

  const isRTL = getDocumentDirection() === 'rtl';

  function inlineAlignX() {
    if (align === 'center') return triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
    if (align === 'start') return (isRTL ? (triggerRect.right - panelRect.width) : triggerRect.left);
    return (isRTL ? triggerRect.left : (triggerRect.right - panelRect.width));
  }
  function inlineAlignY() {
    if (align === 'center') return triggerRect.top + triggerRect.height / 2 - panelRect.height / 2;
    if (align === 'start') return triggerRect.top;
    return triggerRect.bottom - panelRect.height;
  }

  let top = 0, left = 0;

  if (side === 'top') {
    top = triggerRect.top - panelRect.height - props.offset;
    left = inlineAlignX();
  } else if (side === 'bottom') {
    top = triggerRect.bottom + props.offset;
    left = inlineAlignX();
  } else if (side === 'left') {
    top = inlineAlignY();
    left = triggerRect.left - panelRect.width - props.offset;
  } else {
    top = inlineAlignY();
    left = triggerRect.right + props.offset;
  }

  if (props.flip) {
    const overflowTop = top < 0;
    const overflowBottom = top + panelRect.height > vp.height;
    const overflowLeft = left < 0;
    const overflowRight = left + panelRect.width > vp.width;

    // فلیپ سمت
    if (side === 'top' && overflowTop) side = 'bottom';
    else if (side === 'bottom' && overflowBottom) side = 'top';
    else if (side === 'left' && overflowLeft) side = 'right';
    else if (side === 'right' && overflowRight) side = 'left';

    // بازتنظیم پس از فلیپ
    if (side === 'top') { top = triggerRect.top - panelRect.height - props.offset; left = inlineAlignX(); }
    else if (side === 'bottom') { top = triggerRect.bottom + props.offset; left = inlineAlignX(); }
    else if (side === 'left') { top = inlineAlignY(); left = triggerRect.left - panelRect.width - props.offset; }
    else { top = inlineAlignY(); left = triggerRect.right + props.offset; }

    // اگر هنوز افقی تنگ بود، align را برگردانیم
    const stillOverflowLeft = left < 0;
    const stillOverflowRight = left + panelRect.width > vp.width;
    if ((stillOverflowLeft || stillOverflowRight) && align !== 'center') {
      align = align === 'start' ? 'end' : 'start';
      if (side === 'top' || side === 'bottom') left = inlineAlignX();
      else top = inlineAlignY();
    }
  }

  // Clamp
  top = Math.max(4, Math.min(top, vp.height - panelRect.height - 4));
  left = Math.max(4, Math.min(left, vp.width - panelRect.width - 4));

  const style: Record<string,string> = {
    position: props.strategy,
    '--popover-position': props.strategy,
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
    // اگر واقعاً می‌خواهیم هم‌اندازهٔ تریگر باشد، width را ست کنیم
    width: props.matchTriggerWidth ? `${Math.round(triggerRect.width)}px` : '',
  };

  state.panelStyles = style;
  state.placementResolved = (alignRaw ? `${side}-${alignRaw}` : side) as Placement;

  // Arrow
  if (props.arrow && arrowRef.value) {
    const size = props.arrowSize;
    const centerX = triggerRect.left + triggerRect.width / 2;
    const centerY = triggerRect.top + triggerRect.height / 2;

    let ax = 0, ay = 0, rotate = 45;
    if (side === 'top') { ay = panelRect.height - 1; ax = Math.max(size+6, Math.min(centerX - left - size, panelRect.width - size - 6)); }
    if (side === 'bottom') { ay = -size + 1; ax = Math.max(size+6, Math.min(centerX - left - size, panelRect.width - size - 6)); }
    if (side === 'left') { ax = panelRect.width - 1; ay = Math.max(size+6, Math.min(centerY - top - size, panelRect.height - size - 6)); }
    if (side === 'right') { ax = -size + 1; ay = Math.max(size+6, Math.min(centerY - top - size, panelRect.height - size - 6)); }

    state.arrowStyles = {
      width: `${size}px`,
      height: `${size}px`,
      transform: `translate(${Math.round(ax)}px, ${Math.round(ay)}px) rotate(${rotate}deg)`,
    };
  }

  emit('positioned', { top, left, placement: state.placementResolved });
}

async function updatePosition() {
  await nextTick();
  applyPosition();
}

// ---------- Events ----------
let outsideHandler = (e: Event) => {
  if (!props.closeOnOutside || !isOpen.value) return;
  const t = e.target as Node;
  if (panelRef.value?.contains(t) || triggerRef.value?.contains(t)) return;
  close();
  // بازگرداندن فوکوس (به‌جز حالت hover)
  if (props.trigger !== 'hover') triggerRef.value?.focus?.();
};

let keydownHandler = (e: KeyboardEvent) => {
  if (!isOpen.value || !props.closeOnEsc) return;
  if (e.key === 'Escape') {
    e.stopPropagation();
    close();
    triggerRef.value?.focus?.();
  }
};

let reflowHandler = () => { if (isOpen.value) updatePosition(); };

let ro: ResizeObserver | null = null;

onMounted(() => {
  document.addEventListener('pointerdown', outsideHandler, { capture: true });
  window.addEventListener('resize', reflowHandler, { passive: true });
  window.addEventListener('scroll', reflowHandler, { passive: true, capture: true });
  document.addEventListener('keydown', keydownHandler, true);

  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => { if (isOpen.value) updatePosition(); });
    triggerRef.value && ro.observe(triggerRef.value);
    panelRef.value && ro.observe(panelRef.value);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outsideHandler, { capture: true });
  window.removeEventListener('resize', reflowHandler);
  window.removeEventListener('scroll', reflowHandler, true as any);
  document.removeEventListener('keydown', keydownHandler, true);
  ro?.disconnect();
});

// ---------- Watchers ----------
watch(() => isOpen.value, async (v) => {
  if (v) {
    await updatePosition();
    if (props.autoFocus) {
      await nextTick();
      if (props.autoFocus === 'container') panelRef.value?.focus?.();
      else {
        const el = panelRef.value?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        (el ?? panelRef.value)?.focus?.();
      }
    }
  }
});

watch(() => [props.placement, props.offset, props.strategy, props.matchTriggerWidth] as const, () => {
  if (isOpen.value) updatePosition();
});

// ---------- Trigger interactions ----------
let hoverTimer: number | undefined;

function onTriggerClick(e: MouseEvent) {
  if (props.trigger !== 'click' || props.disabled) return;
  e.stopPropagation();
  toggle();
}
function onTriggerMouseEnter() {
  if (props.trigger !== 'hover' || props.disabled) return;
  clearTimeout(hoverTimer);
  hoverTimer = window.setTimeout(() => open(), props.openDelay);
}
function onTriggerMouseLeave() {
  if (props.trigger !== 'hover' || props.disabled) return;
  clearTimeout(hoverTimer);
  hoverTimer = window.setTimeout(() => close(), props.closeDelay);
}
function onPanelMouseEnter() {
  if (props.trigger !== 'hover') return;
  clearTimeout(hoverTimer);
}
function onPanelMouseLeave() {
  if (props.trigger !== 'hover') return;
  clearTimeout(hoverTimer);
  hoverTimer = window.setTimeout(() => close(), props.closeDelay);
}
function onTriggerFocus() {
  if (props.trigger === 'focus' && !props.disabled) open();
}
function onTriggerBlur(e: FocusEvent) {
  if (props.trigger === 'focus' && !props.disabled) {
    const r = e.relatedTarget as Node | null;
    if (!panelRef.value?.contains(r ?? null)) close();
  }
}

const triggerAttrs = computed(() => ({
  id: triggerId.value,
  'aria-haspopup': props.role === 'dialog' ? 'dialog' : (props.role as string),
  'aria-expanded': String(isOpen.value),
  'aria-controls': panelId.value,
  'data-open': isOpen.value ? '' : undefined,
  disabled: props.disabled ? true : undefined,
  tabIndex: props.triggerTag !== 'button' ? 0 : undefined,
  role: props.triggerTag !== 'button' ? 'button' : undefined,
}));

const triggerListeners = {
  click: onTriggerClick,
  mouseenter: onTriggerMouseEnter,
  mouseleave: onTriggerMouseLeave,
  focus: onTriggerFocus,
  blur: onTriggerBlur,
  keydown: (e: KeyboardEvent) => {
    if (props.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (props.trigger !== 'hover') toggle(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!isOpen.value) open(); nextTick(() => panelRef.value?.focus?.()); }
    if (e.key === 'Escape') { if (isOpen.value) { e.stopPropagation(); close(); } }
  },
};

defineExpose({ open, close, toggle, updatePosition });
</script>

<template>
  <div :class="s.root" ref="rootRef">
    <!-- Trigger -->
    <component
      :is="triggerTag"
      v-bind="triggerAttrs"
      v-on="triggerListeners"
      :class="s.trigger"
      ref="triggerRef"
      type="button"
      :data-disabled="disabled ? '' : undefined"
    >
      <slot name="trigger" :open="isOpen" :attrs="triggerAttrs" />
    </component>

    <!-- Panel -->
    <teleport to="body" v-if="portal">
      <Transition name="fade-scale">
        <div
          v-if="isOpen"
          :id="panelId"
          :class="[
            s.panel,
            s[color],
            s[`variant-${variant}`],
            s[`size-${size}`],
            s[`rounded-${rounded}`],
            panelClass
          ]"
          :style="state.panelStyles"
          :role="role"
          :aria-labelledby="triggerId"
          :aria-modal="role==='dialog' ? 'true' : undefined"
          ref="panelRef"
          tabindex="-1"
          data-open
          :data-placement="state.placementResolved"
          :data-strategy="strategy"
          @mouseenter="onPanelMouseEnter"
          @mouseleave="onPanelMouseLeave"
        >
          <div v-if="arrow" :class="s.arrow" :style="state.arrowStyles" ref="arrowRef" />
          <slot name="header" />
          <slot />
          <slot name="footer" />
        </div>
      </Transition>
    </teleport>

    <Transition name="fade-scale" v-else>
      <div
        v-if="isOpen"
        :id="panelId"
        :class="[
          s.panel,
          s[color],
          s[`variant-${variant}`],
          s[`size-${size}`],
          s[`rounded-${rounded}`],
          panelClass
        ]"
        :style="state.panelStyles"
        :role="role"
        :aria-labelledby="triggerId"
        :aria-modal="role==='dialog' ? 'true' : undefined"
        ref="panelRef"
        tabindex="-1"
        data-open
        :data-placement="state.placementResolved"
        :data-strategy="strategy"
        @mouseenter="onPanelMouseEnter"
        @mouseleave="onPanelMouseLeave"
      >
        <div v-if="arrow" :class="s.arrow" :style="state.arrowStyles" ref="arrowRef" />
        <slot name="header" />
        <slot />
        <slot name="footer" />
      </div>
    </Transition>
  </div>
</template>
