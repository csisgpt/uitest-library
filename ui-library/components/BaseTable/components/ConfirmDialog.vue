<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="modelValue" class="dialog-overlay" @click="handleCancel">
        <div class="dialog-content" @click.stop>
          <div class="dialog-icon" :class="`dialog-icon--${variant}`">
            <component :is="iconComponent" :size="48" />
          </div>
          
          <div class="dialog-body">
            <h3 class="dialog-title">{{ title }}</h3>
            <p class="dialog-message">{{ message }}</p>
          </div>
          
          <div class="dialog-footer">
            <button
              @click="handleConfirm"
              :disabled="loading"
              class="btn"
              :class="`btn--${variant}`"
            >
              <IconLoader v-if="loading" :size="18" class="spinner" />
              <span v-else>{{ confirmText }}</span>
            </button>
            <button
              @click="handleCancel"
              :disabled="loading"
              class="btn btn--default"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  IconAlertTriangle,
  IconInfoCircle,
  IconCheck,
  IconX,
  IconLoader,
  IconTrash,
  IconAlertCircle
} from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
  loading?: boolean
}>(), {
  variant: 'info',
  confirmText: 'تایید',
  cancelText: 'انصراف'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const iconComponent = computed(() => {
  const icons = {
    info: IconInfoCircle,
    success: IconCheck,
    warning: IconAlertTriangle,
    danger: IconTrash
  }
  return icons[props.variant]
})

function handleConfirm() {
  if (props.loading) return
  emit('confirm')
}

function handleCancel() {
  if (props.loading) return
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-index-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.dialog-content {
  background: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  width: 100%;
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.dialog-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.dialog-icon--info {
  background: var(--color-info);
}

.dialog-icon--success {
  background: var(--color-success);
}

.dialog-icon--warning {
  background: var(--color-warning);
}

.dialog-icon--danger {
  background: var(--color-error);
}

.dialog-body {
  text-align: center;
}

.dialog-title {
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.dialog-message {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-muted);
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  gap: var(--space-md);
  width: 100%;
}

.btn {
  flex: 1;
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.btn--info {
  background: var(--color-info);
  color: white;
}

.btn--success {
  background: var(--color-success);
  color: white;
}

.btn--warning {
  background: var(--color-warning);
  color: white;
}

.btn--danger {
  background: var(--color-error);
  color: white;
}

.btn--default {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn--default:hover:not(:disabled) {
  background: var(--color-border);
  filter: none;
}

.btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dialog transition */
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog-content,
.dialog-leave-to .dialog-content {
  transform: scale(0.95);
}

@media (max-width: 480px) {
  .dialog-content {
    max-width: 100%;
  }
}
</style>