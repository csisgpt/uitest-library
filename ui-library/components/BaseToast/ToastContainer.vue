<template>
  <Teleport to="body">
    <div
      v-if="visibleToasts.length > 0"
      :class="[
        $style.container,
        $style[positionClass]
      ]"
      :aria-label="'منطقه اعلانات'"
      role="region"
      aria-live="polite"
    >
      <TransitionGroup
        :name="transitionName"
        tag="div"
        :class="$style.stack"
      >
        <BaseToast
          v-for="toast in visibleToasts"
          :key="toast.id"
          :toast="toast"
          :on-close="handleToastClose"
          :on-action="handleToastAction"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from './composables/useToast'
import BaseToast from './BaseToast.vue'
import type { ToastAction, Toast } from './types'

const { toasts, position, dismiss } = useToast()

// Computed
const visibleToasts = computed(() => {
  return toasts.value.filter(toast => toast.position === position.value)
})

const positionClass = computed(() => {
  return position.value.replace('-', '')
})

const transitionName = computed(() => {
  if (position.value.includes('right')) return 'toast-slide-right'
  if (position.value.includes('left')) return 'toast-slide-left'
  if (position.value.includes('top')) return 'toast-slide-top'
  return 'toast-slide-bottom'
})

// Methods
const handleToastClose = (id: string) => {
  dismiss(id)
}

const handleToastAction = (action: ToastAction, toast: Toast) => {
  // You can add global action handling logic here
  console.log('Toast action triggered:', action.label, toast.id)
}
</script>

<style module src="./ToastContainer.module.css"></style>

<style scoped>
/* Toast transition styles */
.toast-slide-right-enter-active,
.toast-slide-right-leave-active,
.toast-slide-right-move {
  transition: all 0.3s ease-out;
}

.toast-slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-slide-left-enter-active,
.toast-slide-left-leave-active,
.toast-slide-left-move {
  transition: all 0.3s ease-out;
}

.toast-slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.toast-slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.toast-slide-top-enter-active,
.toast-slide-top-leave-active,
.toast-slide-top-move {
  transition: all 0.3s ease-out;
}

.toast-slide-top-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.toast-slide-top-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.toast-slide-bottom-enter-active,
.toast-slide-bottom-leave-active,
.toast-slide-bottom-move {
  transition: all 0.3s ease-out;
}

.toast-slide-bottom-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.toast-slide-bottom-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>