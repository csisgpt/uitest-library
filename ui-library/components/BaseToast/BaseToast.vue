<template>
  <Transition :name="transitionName" appear @enter="onEnter" @leave="onLeave">
    <div
      v-if="visible"
      :class="[
        $style.toast,
        $style[toast.type],
        $style[toast.animation],
        toast.customClass,
      ]"
      :role="toast.type === 'error' ? 'alert' : 'status'"
      :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
      :aria-label="`${toast.type} notification`"
      @click="handleClick"
      @mouseenter="pauseTimer"
      @mouseleave="resumeTimer"
    >
      <!-- Icon -->
      <div :class="[$style.icon, $style[toast.type]]">
        <component v-if="iconComponent" :is="iconComponent" class="w-4 h-4" />
        <span v-else>{{ defaultIcon }}</span>
      </div>

      <!-- Content -->
      <div :class="$style.content">
        <h4 v-if="toast.title" :class="$style.title">
          {{ toast.title }}
        </h4>
        <p :class="$style.message">
          {{ toast.message }}
        </p>

        <!-- Actions -->
        <div
          v-if="toast.actions && toast.actions.length"
          :class="$style.actions"
        >
          <button
            v-for="action in toast.actions"
            :key="action.label"
            :class="[$style.actionButton, $style[action.style || 'secondary']]"
            @click.stop="handleAction(action)"
          >
            {{ action.label }}
          </button>
        </div>
      </div>

      <!-- Close Button -->
      <button
        :class="$style.closeButton"
        :aria-label="'بستن اعلان'"
        @click.stop="handleClose"
      >
        <component
          v-if="closeIconComponent"
          :is="closeIconComponent"
          class="w-4 h-4"
        />
        <span v-else>×</span>
      </button>

      <!-- Progress Bar -->
      <div
        v-if="toast.showProgress && !toast.persistent && showProgressBar"
        :class="[$style.progress, $style[toast.type]]"
        :style="{ width: progressWidth + '%' }"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Toast, ToastAction } from "./types";

interface Props {
  toast: Toast;
  onClose?: (id: string) => void;
  onAction?: (action: ToastAction, toast: Toast) => void;
}

const props = defineProps<Props>();

const visible = ref(true);
const progressWidth = ref(100);
const startTime = ref(Date.now());
let progressTimer: NodeJS.Timeout | null = null;
let autoCloseTimer: NodeJS.Timeout | null = null;

// Computed
const transitionName = computed(() => {
  const position = props.toast.position;
  if (position.includes("right")) return "slide-right";
  if (position.includes("left")) return "slide-left";
  if (position.includes("top")) return "slide-top";
  return "slide-bottom";
});

const defaultIcon = computed(() => {
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  return icons[props.toast.type] || "ℹ";
});

const showProgressBar = computed(() => {
  return props.toast.showProgress && props.toast.duration > 0;
});

// You can pass icon components as props or use a global icon registry
const iconComponent = computed(() => {
  // Example: return resolveComponent(${props.toast.type}Icon)
  return null;
});

const closeIconComponent = computed(() => {
  // Example: return resolveComponent('XMarkIcon')
  return null;
});

// Methods
const handleClick = () => {
  props.toast.onClick?.();
};

const handleClose = () => {
  visible.value = false;
};

const handleAction = (action: ToastAction) => {
  action.handler();
  props.onAction?.(action, props.toast);
  if (action.style !== "secondary") {
    handleClose();
  }
};

const pauseTimer = () => {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
};

const resumeTimer = () => {
  if (props.toast.persistent || props.toast.duration <= 0) return;

  const elapsed = Date.now() - startTime.value;
  const remaining = Math.max(0, props.toast.duration - elapsed);

  if (remaining > 0) {
    startProgressTimer(remaining);
    autoCloseTimer = setTimeout(() => {
      handleClose();
    }, remaining);
  }
};

const startProgressTimer = (duration: number) => {
  if (!showProgressBar.value) return;

  const interval = 50; // Update every 50ms
  const totalSteps = duration / interval;
  let currentStep = 0;

  progressTimer = setInterval(() => {
    currentStep++;
    progressWidth.value = Math.max(0, 100 - (currentStep / totalSteps) * 100);

    if (currentStep >= totalSteps) {
      clearInterval(progressTimer!);
      progressTimer = null;
    }
  }, interval);
};

// Transition events
const onEnter = () => {
  if (!props.toast.persistent && props.toast.duration > 0) {
    startProgressTimer(props.toast.duration);
    autoCloseTimer = setTimeout(() => {
      handleClose();
    }, props.toast.duration);
  }
};

const onLeave = () => {
  props.onClose?.(props.toast.id);
};

// Lifecycle
onMounted(() => {
  startTime.value = Date.now();
});

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer);
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
});
</script>

<style module src="./BaseToast.module.css"></style>

<style scoped>
/* Transition styles */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-top-enter-active,
.slide-top-leave-active {
  transition: all 0.3s ease-out;
}

.slide-top-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-top-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: all 0.3s ease-out;
}

.slide-bottom-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-bottom-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
