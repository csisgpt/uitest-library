<template>
  <div class="action-sheet-wrapper">
    <!-- Trigger Element -->
    <div
      v-if="!trigger || trigger !== 'manual'"
      ref="triggerRef"
      :class="triggerClass"
      @click="handleTriggerClick"
      :tabindex="triggerTabindex"
      role="button"
      :aria-describedby="isOpen ? actionSheetId : undefined"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <slot name="trigger" :isOpen="isOpen" :open="open">
        <button type="button" :class="$style.defaultTrigger">
          {{ triggerText || "Open Action Sheet" }}
        </button>
      </slot>
    </div>

    <!-- Action Sheet -->
    <Teleport to="body" :disabled="!shouldTeleport">
      <Transition
        :name="transitionName"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
      >
        <div
          v-if="isOpen"
          :class="$style.actionSheetOverlay"
          @click="handleOverlayClick"
        >
          <div
            ref="actionSheetRef"
            :id="actionSheetId"
            :class="actionSheetClass"
            role="dialog"
            :aria-labelledby="titleId"
            :aria-modal="true"
            @click.stop
          >
            <!-- Header -->
            <div v-if="$slots.header || title || subtitle" :class="headerClass">
              <slot name="header" :close="close">
                <div :class="$style.actionSheetHeaderContent">
                  <h3
                    v-if="title"
                    :id="titleId"
                    :class="$style.actionSheetTitle"
                  >
                    {{ title }}
                  </h3>
                  <p v-if="subtitle" :class="$style.actionSheetSubtitle">
                    {{ subtitle }}
                  </p>
                </div>
                <button
                  v-if="showCloseButton"
                  type="button"
                  :class="$style.actionSheetClose"
                  @click="close"
                  aria-label="Close action sheet"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </slot>
            </div>

            <!-- Actions List -->
            <div :class="$style.actionSheetActions">
              <slot :close="close" :isOpen="isOpen">
                <template v-if="actions && actions.length">
                  <button
                    v-for="(action, index) in actions"
                    :key="action.id || index"
                    type="button"
                    :class="getActionClass(action)"
                    :disabled="action.disabled"
                    @click="handleActionClick(action)"
                  >
                    <span v-if="action.icon" :class="$style.actionIcon">
                      <component
                        :is="action.icon"
                        v-if="typeof action.icon === 'object'"
                      />
                      <span v-else v-html="action.icon"></span>
                    </span>
                    <span :class="$style.actionContent">
                      <span :class="$style.actionText">{{ action.text }}</span>
                      <span
                        v-if="action.description"
                        :class="$style.actionDescription"
                      >
                        {{ action.description }}
                      </span>
                    </span>
                    <span v-if="action.badge" :class="$style.actionBadge">
                      {{ action.badge }}
                    </span>
                  </button>
                </template>
              </slot>
            </div>
            <!-- Cancel Button -->
            <div v-if="showCancel" :class="$style.actionSheetCancel">
              <button type="button" :class="$style.cancelButton" @click="close">
                {{ cancelText }}
              </button>
            </div>
          </div>
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
  type Component,
} from "vue";

import $style from "./BaseActionSheet.module.css";
// Types
type Trigger = "click" | "manual";

type ActionRole = "default" | "destructive" | "cancel";

export interface ActionSheetAction {
  id?: string | number;
  text: string;
  description?: string;
  icon?: string | Component;
  badge?: string;
  role?: ActionRole;
  disabled?: boolean;
  handler?: () => void | Promise<void>;
  preventClose?: boolean;
}

// Props
interface Props {
  // Basic props
  modelValue?: boolean;
  trigger?: Trigger;
  disabled?: boolean;

  // Content props
  title?: string;
  subtitle?: string;
  triggerText?: string;
  actions?: ActionSheetAction[];

  // Behavior props
  showCloseButton?: boolean;
  showCancel?: boolean;
  cancelText?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  shouldTeleport?: boolean;

  // Animation props
  transition?: string;

  // Custom classes
  triggerClass?: string;
  actionSheetClass?: string;
  headerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  trigger: "click",
  disabled: false,
  showCloseButton: false,
  showCancel: true,
  cancelText: "لغو",
  closeOnOverlayClick: true,
  closeOnEscape: true,
  shouldTeleport: true,
  transition: "action-sheet",
  actions: () => [],
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
  "action-click": [action: ActionSheetAction];
}

const emit = defineEmits<Emits>();

// Refs
const triggerRef = ref<HTMLElement>();
const actionSheetRef = ref<HTMLElement>();
const previousOverflow = ref<string>("");

// State
const isOpen = ref(props.modelValue);

// Computed
const actionSheetId = computed(
  () => `action-sheet-${Math.random().toString(36).substr(2, 9)}`
);
const titleId = computed(() => `action-sheet-title-${actionSheetId.value}`);

const transitionName = computed(() => props.transition);

const triggerTabindex = computed(() => (props.disabled ? -1 : 0));

// Computed classes using CSS modules
const actionSheetClass = computed(() =>
  [$style.actionSheetContainer, props.actionSheetClass]
    .filter(Boolean)
    .join(" ")
);

const headerClass = computed(() =>
  [$style.actionSheetHeader, props.headerClass].filter(Boolean).join(" ")
);

const getActionClass = (action: ActionSheetAction) =>
  [
    $style.actionSheetAction,
    action.role === "destructive" && $style.actionDestructive,
    action.role === "cancel" && $style.actionCancel,
    action.disabled && $style.actionDisabled,
  ]
    .filter(Boolean)
    .join(" ");

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== isOpen.value) {
      if (newValue) {
        open();
      } else {
        close();
      }
    }
  }
);

watch(isOpen, (newValue) => {
  emit("update:modelValue", newValue);
});

// Methods
const open = () => {
  if (props.disabled || isOpen.value) return;

  emit("before-open");
  isOpen.value = true;

  nextTick(() => {
    // Focus management
    if (actionSheetRef.value) {
      const firstAction = actionSheetRef.value.querySelector(
        "button:not(:disabled)"
      );
      if (firstAction) {
        (firstAction as HTMLElement).focus();
      }
    }
  });
};

const close = () => {
  if (!isOpen.value) return;

  emit("before-close");
  isOpen.value = false;
};

// Event handlers
const handleTriggerClick = () => {
  if (props.trigger === "click") {
    open();
  }
};

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    close();
  }
};
const handleActionClick = async (action: ActionSheetAction) => {
  if (action.disabled) return;

  emit("action-click", action);

  if (action.handler) {
    try {
      await action.handler();
    } catch (error) {
      console.error("Action handler error:", error);
    }
  }

  // Close action sheet unless it's explicitly prevented
  if (action.role !== "cancel") {
    close();
  } else {
    close();
  }
};

const getFocusable = () => {
  if (!actionSheetRef.value) return [] as HTMLElement[];
  return Array.from(
    actionSheetRef.value.querySelectorAll<HTMLElement>(
      'button,a,input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )
  ).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  );
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return;

  if (event.key === "Escape" && props.closeOnEscape) {
    close();
    return;
  }

  if (event.key === "Tab") {
    const nodes = getFocusable();
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const actions = actionSheetRef.value?.querySelectorAll(
      "button:not(:disabled)"
    );
    if (!actions?.length) return;
    const currentIndex = Array.from(actions).indexOf(
      document.activeElement as HTMLElement
    );
    const nextIndex =
      event.key === "ArrowDown"
        ? currentIndex < actions.length - 1
          ? currentIndex + 1
          : 0
        : currentIndex > 0
        ? currentIndex - 1
        : actions.length - 1;
    (actions[nextIndex] as HTMLElement).focus();
  }
};

// Transition events
const onBeforeEnter = () => {
  emit("before-open");
  previousOverflow.value = document.body.style.overflow;
  document.body.style.overflow = "hidden";
};
const onEnter = () => {
  // Animation logic if needed
};

const onAfterEnter = () => {
  emit("after-open");
  emit("open");
};

const onAfterLeave = () => {
  emit("after-close");
  emit("close");
  document.body.style.overflow = previousOverflow.value;
};

const onBeforeLeave = () => {
  emit('before-close')
}

const onLeave = () => {
  // Animation logic if needed
};

// Lifecycle
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  // Ensure body scroll is restored
  document.body.style.overflow = "";
});

// Expose methods
defineExpose({
  open,
  close,
  isOpen: computed(() => isOpen.value),
});
</script>

<style module src="./BaseActionSheet.module.css"></style>
