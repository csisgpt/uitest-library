<template>
  <div :class="containerClass" @keydown="onKeyDown" ref="container">
    <!-- Main Button -->
    <button
      ref="button"
      type="button"
      :class="buttonClass"
      :disabled="disabled"
      :aria-haspopup="true"
      :aria-expanded="overlayVisible"
      :aria-controls="overlayId"
      @click="onDefaultButtonClick"
      @focus="onButtonFocus"
      @blur="onButtonBlur"
      @keydown="onButtonKeyDown"
    >
      <slot name="icon" v-if="$slots.icon" />
      <i v-else-if="icon" :class="icon" />
      <span v-if="label" class="base-button-label">{{ label }}</span>
    </button>

    <!-- Dropdown Button -->
    <button
      ref="menuButton"
      type="button"
      :class="menuButtonClass"
      :disabled="disabled"
      :aria-haspopup="true"
      :aria-expanded="overlayVisible"
      :aria-controls="overlayId"
      @click="onDropdownButtonClick"
      @focus="onDropdownButtonFocus"
      @blur="onDropdownButtonBlur"
      @keydown="onDropdownButtonKeyDown"
    >
    {{ dropdownIcon }}
      <i v-if="dropdownIcon" :class="dropdownIcon" />
      <svg
        v-else
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="p-icon p-button-icon p-c"
        data-pc-section="icon"
      >
        <path
          d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
          fill="currentColor"
        ></path>
      </svg>
    </button>

    <!-- Overlay/Menu -->
    <transition
      name="overlay"
      @enter="onOverlayEnter"
      @leave="onOverlayLeave"
      @after-leave="onOverlayAfterLeave"
    >
      <div
        v-if="overlayVisible"
        ref="overlay"
        :class="overlayClass"
        :id="overlayId"
        @click="onOverlayClick"
        @keydown="onOverlayKeyDown"
      >
        <ul
          ref="list"
          :class="listClass"
          role="menu"
          @focus="onListFocus"
          @blur="onListBlur"
        >
          <li
            v-for="(item, index) in model"
            :key="getItemKey(item, index)"
            :class="getItemClass(item, index)"
            role="menuitem"
            :aria-disabled="isItemDisabled(item)"
            @click="onItemClick($event, item, index)"
            @keydown="onItemKeyDown($event, item, index)"
            @mouseenter="onItemMouseEnter($event, index)"
            @mouseleave="onItemMouseLeave"
          >
            <slot name="item" :item="item" :index="index">
              <i v-if="item.icon" :class="item.icon" />
              <span v-if="item.label" class="base-menuitem-text">{{
                item.label
              }}</span>
            </slot>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  type PropType,
  useSlots,
} from "vue";

// Types
interface MenuItem {
  label?: string;
  icon?: string;
  command?: (event: { originalEvent: Event; item: MenuItem }) => void;
  url?: string;
  target?: string;
  disabled?: boolean;
  visible?: boolean;
  separator?: boolean;
  style?: any;
  class?: any;
  [key: string]: any;
}

// Props
const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  model: {
    type: Array as PropType<MenuItem[]>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  tabindex: {
    type: String,
    default: "0",
  },
  autoZIndex: {
    type: Boolean,
    default: true,
  },
  baseZIndex: {
    type: Number,
    default: 0,
  },
  appendTo: {
    type: String,
    default: "body",
  },
  dropdownIcon: {
    type: String,
    default:
      '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingIcon: {
    type: String,
    default: "pi pi-spinner pi-spin",
  },
  severity: {
    type: String as PropType<
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "help"
      | "danger"
    >,
    default: "primary",
    validator: (value: string) =>
      [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "help",
        "danger",
      ].includes(value),
  },
  raised: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  text: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<"small" | "large">,
    default: null,
    validator: (value: string) => ["small", "large"].includes(value),
  },
  plain: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits<{
  click: [event: Event];
  "dropdown-click": [event: Event];
}>();

// Slots
const slots = useSlots()

// Refs
const container = ref<HTMLElement>();
const button = ref<HTMLElement>();
const menuButton = ref<HTMLElement>();
const overlay = ref<HTMLElement>();
const list = ref<HTMLElement>();

// State
const overlayVisible = ref(false);
const focusedOptionIndex = ref(-1);
const overlayId = ref(
  `base-splitbutton-${Math.random().toString(36).substr(2, 9)}`
);

// Computed
const containerClass = computed(() => [
  "base-splitbutton",
  {
    "base-splitbutton-raised": props.raised,
    "base-splitbutton-rounded": props.rounded,
    "base-splitbutton-text": props.text,
    "base-splitbutton-outlined": props.outlined,
    "base-splitbutton-sm": props.size === "small",
    "base-splitbutton-lg": props.size === "large",
    "base-splitbutton-plain": props.plain,
    "base-splitbutton-loading": props.loading,
    [`base-splitbutton-${props.severity}`]: props.severity,
  },
]);

const buttonClass = computed(() => [
  "base-splitbutton-defaultbutton",
  "base-button",
  {
    "base-button-icon-only": !props.label && (props.icon || slots.icon),
    "base-button-vertical": false,
    "base-button-loading": props.loading,
    "base-button-loading-label-only":
      props.loading && props.label && !props.icon && !slots.icon,
  },
]);

const menuButtonClass = computed(() => [
  "base-splitbutton-menubutton",
  "base-button",
]);

const overlayClass = computed(() => [
  "base-splitbutton-overlay",
  "base-component",
]);

const listClass = computed(() => ["base-splitbutton-list"]);

// Methods
const toggle = (event?: Event) => {
  if (overlayVisible.value) {
    hide();
  } else {
    show(event);
  }
};

const show = (event?: Event) => {
  overlayVisible.value = true;
  focusedOptionIndex.value = -1;

  nextTick(() => {
    alignOverlay();
    bindOutsideClickListener();
    bindScrollListener();
    bindResizeListener();

    if (props.autoZIndex && overlay.value) {
      overlay.value.style.zIndex = String(props.baseZIndex + 1000);
    }
  });
};

const hide = () => {
  overlayVisible.value = false;
  focusedOptionIndex.value = -1;
  unbindOutsideClickListener();
  unbindScrollListener();
  unbindResizeListener();
};

const alignOverlay = () => {
  if (!overlay.value || !container.value) return;

  const cRect = container.value.getBoundingClientRect();
  const oRect = overlay.value.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // پیش‌فرض: زیرِ دکمه، چپ‌چین نسبت به کانتینر
  let top = container.value.offsetHeight;
  let left = 0;

  // اگر از راست بیرون می‌زند: به لبهٔ راست کانتینر بچسبان
  if (cRect.left + oRect.width > vw) {
    left = cRect.width - oRect.width;
  }

  // اگر پایین جا نشد: بالا نمایش بده
  if (cRect.bottom + oRect.height > vh) {
    top = -oRect.height;
  }

  overlay.value.style.top = `${top}px`;
  overlay.value.style.left = `${left}px`;
};

const onDefaultButtonClick = (event: Event) => {
  emit("click", event);
};

const onDropdownButtonClick = (event: Event) => {
  toggle(event);
  emit("dropdown-click", event);
};

const onItemClick = (event: Event, item: MenuItem, index: number) => {
  if (isItemDisabled(item)) {
    return;
  }

  if (item.command) {
    item.command({
      originalEvent: event,
      item: item,
    });
  }

  if (item.url) {
    if (item.target) {
      window.open(item.url, item.target);
    } else {
      window.location.href = item.url;
    }
  }

  hide();
};

const onButtonFocus = () => {
  // Focus handling
};

const onButtonBlur = () => {
  // Blur handling
};

const onDropdownButtonFocus = () => {
  // Focus handling
};

const onDropdownButtonBlur = () => {
  // Blur handling
};

const onListFocus = () => {
  if (focusedOptionIndex.value === -1) {
    focusedOptionIndex.value = findFirstFocusedOptionIndex();
  }
};

const onListBlur = () => {
  focusedOptionIndex.value = -1;
};

const onOverlayClick = (event: Event) => {
  // Prevent hiding when clicking inside overlay
  event.stopPropagation();
};

const onKeyDown = (event: KeyboardEvent) => {
  switch (event.code) {
    case "ArrowDown":
      if (!overlayVisible.value) {
        show();
      } else {
        changeFocusedOptionIndex(1);
      }
      event.preventDefault();
      break;

    case "ArrowUp":
      if (overlayVisible.value) {
        changeFocusedOptionIndex(-1);
      }
      event.preventDefault();
      break;

    case "Escape":
      if (overlayVisible.value) {
        hide();
        button.value?.focus();
      }
      break;

    case "Enter":
    case "Space":
      if (overlayVisible.value && focusedOptionIndex.value >= 0) {
        const item = props.model[focusedOptionIndex.value];
        onItemClick(event, item, focusedOptionIndex.value);
      }
      event.preventDefault();
      break;
  }
};

const onButtonKeyDown = (event: KeyboardEvent) => {
  switch (event.code) {
    case "ArrowDown":
      show();
      event.preventDefault();
      break;
  }
};

const onDropdownButtonKeyDown = (event: KeyboardEvent) => {
  switch (event.code) {
    case "ArrowDown":
      show();
      event.preventDefault();
      break;
  }
};

const onOverlayKeyDown = (event: KeyboardEvent) => {
  onKeyDown(event);
};

const onItemKeyDown = (event: KeyboardEvent, item: MenuItem, index: number) => {
  switch (event.code) {
    case "Enter":
    case "Space":
      onItemClick(event, item, index);
      event.preventDefault();
      break;
  }
};

const onItemMouseEnter = (event: Event, index: number) => {
  focusedOptionIndex.value = index;
};

const onItemMouseLeave = () => {
  focusedOptionIndex.value = -1;
};

const onOverlayEnter = () => {
  alignOverlay();
};

const onOverlayLeave = () => {
  // Cleanup
};

const onOverlayAfterLeave = () => {
  // Cleanup after transition
};

const isItemDisabled = (item: MenuItem) => {
  return item.disabled === true;
};

const isItemVisible = (item: MenuItem) => {
  return item.visible !== false;
};

const getItemKey = (item: MenuItem, index: number) => {
  return item.key || item.label || index;
};

const getItemClass = (item: MenuItem, index: number) => {
  return [
    "base-menuitem",
    {
      "base-menuitem-focused": focusedOptionIndex.value === index,
      "base-menuitem-disabled": isItemDisabled(item),
      "base-menuitem-separator": item.separator,
    },
    item.class,
  ];
};

const findFirstFocusedOptionIndex = () => {
  for (let i = 0; i < props.model.length; i++) {
    if (!isItemDisabled(props.model[i]) && isItemVisible(props.model[i])) {
      return i;
    }
  }
  return -1;
};

const findLastFocusedOptionIndex = () => {
  for (let i = props.model.length - 1; i >= 0; i--) {
    if (!isItemDisabled(props.model[i]) && isItemVisible(props.model[i])) {
      return i;
    }
  }
  return -1;
};

const changeFocusedOptionIndex = (delta: number) => {
  const items = props.model.filter(
    (item) => isItemVisible(item) && !isItemDisabled(item)
  );

  if (items.length === 0) return;

  let newIndex = focusedOptionIndex.value + delta;

  if (newIndex < 0) {
    newIndex = findLastFocusedOptionIndex();
  } else if (newIndex >= items.length) {
    newIndex = findFirstFocusedOptionIndex();
  } else {
    // Find the actual index in the full model
    let actualIndex = 0;
    let visibleIndex = 0;

    for (let i = 0; i < props.model.length; i++) {
      if (isItemVisible(props.model[i]) && !isItemDisabled(props.model[i])) {
        if (visibleIndex === newIndex) {
          actualIndex = i;
          break;
        }
        visibleIndex++;
      }
    }
    newIndex = actualIndex;
  }

  focusedOptionIndex.value = newIndex;
};

// Event Listeners
let outsideClickListener: ((event: Event) => void) | null = null;
let scrollHandler: (() => void) | null = null;
let resizeListener: (() => void) | null = null;

const bindOutsideClickListener = () => {
  if (!outsideClickListener) {
    outsideClickListener = (event: Event) => {
      if (
        overlayVisible.value &&
        !container.value?.contains(event.target as Node)
      ) {
        hide();
      }
    };
    document.addEventListener("click", outsideClickListener);
  }
};

const unbindOutsideClickListener = () => {
  if (outsideClickListener) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener = null;
  }
};

const bindScrollListener = () => {
  if (!scrollHandler) {
    scrollHandler = () => {
      if (overlayVisible.value) {
        hide();
      }
    };
    window.addEventListener("scroll", scrollHandler, true);
  }
};

const unbindScrollListener = () => {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler, true);
    scrollHandler = null;
  }
};

const bindResizeListener = () => {
  if (!resizeListener) {
    resizeListener = () => {
      if (overlayVisible.value) {
        hide();
      }
    };
    window.addEventListener("resize", resizeListener);
  }
};

const unbindResizeListener = () => {
  if (resizeListener) {
    window.removeEventListener("resize", resizeListener);
    resizeListener = null;
  }
};

// Lifecycle
onMounted(() => {
  // Component mounted
});

onUnmounted(() => {
  unbindOutsideClickListener();
  unbindScrollListener();
  unbindResizeListener();
});

// Expose methods
defineExpose({
  show,
  hide,
  toggle,
});
</script>

<style>
@import "./BaseSplitButton.module.css";
</style>
