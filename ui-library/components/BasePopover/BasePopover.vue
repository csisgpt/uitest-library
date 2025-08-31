<template>
  <div ref="wrapperRef" :class="$style.wrapper">
    <!-- Trigger -->
    <div
      ref="triggerRef"
      :class="[$style.trigger, triggerClass]"
      :tabindex="disabled ? -1 : 0"
      role="button"
      :aria-expanded="isOpen"
      :aria-describedby="isOpen ? popoverId : undefined"
      @click="handleTriggerClick"
      @mouseenter="handleTriggerMouseEnter"
      @mouseleave="handleTriggerMouseLeave"
      @focus="handleTriggerFocus"
      @blur="handleTriggerBlur"
      @keydown="handleTriggerKeydown"
    >
      <slot
        name="trigger"
        :isOpen="isOpen"
        :toggle="toggle"
        :open="open"
        :close="close"
      >
        <button
          type="button"
          :class="$style.defaultTrigger"
          :disabled="disabled"
        >
          {{ triggerText || "Open Popover" }}
        </button>
      </slot>
    </div>

    <!-- Popover -->
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <Transition
        :name="transitionName"
        @before-enter="onBeforeEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @after-leave="onAfterLeave"
      >
        <div
          v-if="isOpen"
          ref="popoverRef"
          :id="popoverId"
          :class="popoverClasses"
          :style="popoverStyle"
          role="dialog"
          :aria-labelledby="title ? titleId : undefined"
          :aria-modal="modal"
          @click.stop
          @keydown="handlePopoverKeydown"
        >
          <!-- Backdrop -->
          <div
            v-if="showBackdrop"
            :class="$style.backdrop"
            @click="handleBackdropClick"
          />

          <!-- Arrow -->
          <div
            v-if="showArrow"
            ref="arrowRef"
            :class="$style.arrow"
            :style="arrowStyle"
            :data-placement="currentPlacement"
          />

          <!-- Header -->
          <header
            v-if="$slots.header || title || showClose"
            :class="$style.header"
          >
            <slot name="header" :close="close" :title="title">
              <h3 v-if="title" :id="titleId" :class="$style.title">
                {{ title }}
              </h3>

              <button
                v-if="showClose"
                type="button"
                :class="$style.closeButton"
                :aria-label="closeLabel"
                @click="close"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="m18 6-12 12M6 6l12 12" />
                </svg>
              </button>
            </slot>
          </header>

          <!-- Content -->
          <div :class="$style.content">
            <slot :close="close" :isOpen="isOpen">
              <p v-if="content" :class="$style.text">
                {{ content }}
              </p>
            </slot>
          </div>

          <!-- Actions -->
          <footer
            v-if="$slots.actions || actions?.length"
            :class="$style.actions"
          >
            <slot name="actions" :close="close" :actions="actions">
              <button
                v-for="action in actions"
                :key="action.id || action.text"
                type="button"
                :class="getActionButtonClass(action)"
                :disabled="action.disabled"
                @click="handleActionClick(action)"
              >
                <component
                  v-if="action.icon"
                  :is="action.icon"
                  :class="$style.actionIcon"
                />
                <span>{{ action.text }}</span>
              </button>
            </slot>
          </footer>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  type CSSProperties,
  type Component,
  useCssModule,
} from "vue";

import style from "./BasePopover.module.css";

import {
  createPopper,
  type Instance as PopperInstance,
  type Placement,
  type BasePlacement, // ➜ اضافه شود
} from "@popperjs/core";

// Types
export interface PopoverAction {
  id?: string | number;
  text: string;
  icon?: Component | string;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  disabled?: boolean;
  handler?: () => void | Promise<void>;
}

type TriggerType = "click" | "hover" | "focus" | "manual";
type Size = "sm" | "md" | "lg";

// Props
interface Props {
  // Core
  modelValue?: boolean;
  trigger?: TriggerType;
  placement?: Placement;
  disabled?: boolean;

  // Content
  title?: string;
  content?: string;
  triggerText?: string;
  actions?: PopoverAction[];

  // Behavior
  size?: Size;
  showArrow?: boolean;
  showClose?: boolean;
  showBackdrop?: boolean;
  modal?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  shouldTeleport?: boolean;
  teleportTo?: string;

  // Delays
  openDelay?: number;
  closeDelay?: number;

  // Styling
  triggerClass?: string;
  popoverClass?: string;

  // Accessibility
  closeLabel?: string;

  // Animation
  transitionName?: string;

  // Positioning
  offset?: number;
  boundary?: string | Element;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  trigger: "click",
  placement: "bottom",
  disabled: false,
  size: "md",
  showArrow: true,
  showClose: false,
  showBackdrop: false,
  modal: false,
  closeOnClickOutside: true,
  closeOnEscape: true,
  shouldTeleport: true,
  teleportTo: "body",
  openDelay: 0,
  closeDelay: 0,
  closeLabel: "Close",
  transitionName: "popover",
  offset: 8,
  boundary: "clippingParents",
});

// Emits
interface Emits {
  "update:modelValue": [value: boolean];
  open: [];
  close: [];
  "before-open": [];
  "after-open": [];
  "before-close": [];
  "after-close": [];
  "action-click": [action: PopoverAction];
}

const emit = defineEmits<Emits>();
const $style = useCssModule();

// Refs
const wrapperRef = ref<HTMLElement>();
const triggerRef = ref<HTMLElement>();
const popoverRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();

// State
const isOpen = ref(props.modelValue);
const popperInstance = ref<PopperInstance | null>(null);
const currentPlacement = ref<Placement>(props.placement ?? "bottom"); // یا: props.placement as Placement

// Computed
const popoverId = computed(
  () => `popover-${Math.random().toString(36).substring(2, 11)}`
);

const titleId = computed(() => `${popoverId.value}-title`);

const popoverClasses = computed(() =>
  [$style.popover, $style[`popover--${props.size}`], props.popoverClass].filter(
    Boolean
  )
);

const popoverStyle = ref<CSSProperties>({});
const arrowStyle = ref<CSSProperties>({});

// Timers
let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

// Watchers
watch(
  () => props.modelValue,
  (value) => {
    if (value !== isOpen.value) {
      value ? open() : close();
    }
  }
);

watch(isOpen, (value) => {
  emit("update:modelValue", value);
});

// Methods
const clearTimers = () => {
  if (openTimer) {
    clearTimeout(openTimer);
    openTimer = null;
  }
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const open = () => {
  if (props.disabled || isOpen.value) return;

  clearTimers();

  const doOpen = () => {
    emit("before-open");
    isOpen.value = true;
    nextTick(createPopperHell);
  };

  if (props.openDelay > 0) {
    openTimer = setTimeout(doOpen, props.openDelay);
  } else {
    doOpen();
  }
};

const close = () => {
  if (!isOpen.value) return;

  clearTimers();

  const doClose = () => {
    emit("before-close");
    isOpen.value = false;
    destroyPopper();
  };

  if (props.closeDelay > 0) {
    closeTimer = setTimeout(doClose, props.closeDelay);
  } else {
    doClose();
  }
};

const toggle = () => {
  isOpen.value ? close() : open();
};

// Popper.js integration
const createPopperHell = async () => {
  await nextTick();

  if (!triggerRef.value || !popoverRef.value) return;

  destroyPopper();

  popperInstance.value = createPopper(triggerRef.value, popoverRef.value, {
    placement: props.placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, props.offset],
        },
      },
      {
        name: "arrow",
        enabled: props.showArrow,
        options: {
          element: arrowRef.value,
        },
      },
      {
        name: "preventOverflow",
        options: {
          boundary: props.boundary,
          padding: 8,
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["top", "right", "bottom", "left"],
        },
      },
    ],
    onFirstUpdate(state) {
      currentPlacement.value = state.placement;
      updateArrow(state);
    },
  });
};

const updateArrow = (state: { placement: Placement }) => {
  if (!arrowRef.value || !props.showArrow) return;

  const base = state.placement.split("-")[0] as BasePlacement;

  const sideMap: Record<BasePlacement, "top" | "right" | "bottom" | "left"> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  };

  const staticSide = sideMap[base];
  arrowStyle.value = { [staticSide]: "-4px" };
};

const destroyPopper = () => {
  if (popperInstance.value) {
    popperInstance.value.destroy();
    popperInstance.value = null;
  }
};

// Action button classes
const getActionButtonClass = (action: PopoverAction) =>
  [
    $style.actionButton,
    action.variant && $style[`actionButton--${action.variant}`],
  ].filter(Boolean);

// Event handlers
const handleTriggerClick = () => {
  if (props.trigger === "click") toggle();
};

const handleTriggerMouseEnter = () => {
  if (props.trigger === "hover") open();
};

const handleTriggerMouseLeave = () => {
  if (props.trigger === "hover") close();
};

const handleTriggerFocus = () => {
  if (props.trigger === "focus") open();
};

const handleTriggerBlur = () => {
  if (props.trigger === "focus") close();
};

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (props.trigger === "click") toggle();
  }
};

const handlePopoverKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.closeOnEscape) {
    close();
  }

  // Tab navigation within popover
  if (event.key === "Tab") {
    const focusableElements = popoverRef.value?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
};

const handleBackdropClick = () => {
  if (props.closeOnClickOutside) close();
};

const handleActionClick = async (action: PopoverAction) => {
  if (action.disabled) return;

  emit("action-click", action);

  if (action.handler) {
    try {
      await action.handler();
    } catch (error) {
      console.error("Action handler error:", error);
    }
  }

  close();
};

const handleClickOutside = (event: Event) => {
  if (!props.closeOnClickOutside || !isOpen.value) return;

  const target = event.target as Node;
  if (wrapperRef.value?.contains(target) || popoverRef.value?.contains(target))
    return;

  close();
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value) return;

  if (event.key === "Escape" && props.closeOnEscape) {
    close();
  }
};

// Transition events
const onBeforeEnter = () => {
  emit("before-open");
};

const onAfterEnter = () => {
  emit("after-open");

  // Focus management for modal
  if (props.modal && popoverRef.value) {
    const focusable = popoverRef.value.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    focusable?.focus();
  }
};

const onBeforeLeave = () => {
  emit("before-close");
};

const onAfterLeave = () => {
  emit("after-close");
};

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleKeyDown);
  destroyPopper();
  clearTimers();
});

// Public API
defineExpose({
  open,
  close,
  toggle,
  isOpen: computed(() => isOpen.value),
});
</script>

<style lang="css" module src="./BasePopover.module.css"></style>
