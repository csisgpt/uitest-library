<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="handleCancel">
        <div class="modal-content" @click.stop :style="{ width: modalWidth }">
          <div class="modal-header">
            <h2>{{ title }}</h2>
            <button @click="handleCancel" class="modal-close">
              <IconX :size="20" />
            </button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" class="crud-form">
              <div
                v-for="column in editableColumns"
                :key="column.key"
                class="form-group"
                :class="{ 'form-group--error': errors[column.key] }"
              >
                <label class="form-label">
                  {{ column.label }}
                  <span v-if="column.required" class="required">*</span>
                </label>
                
                <div class="form-control">
                  <component
                    :is="getFieldComponent(column)"
                    v-model="formData[column.key]"
                    :column="column"
                    :disabled="loading"
                    @change="validateField(column)"
                  />
                </div>
                
                <span v-if="errors[column.key]" class="form-error">
                  {{ errors[column.key] }}
                </span>
              </div>
            </form>
          </div>
          
          <div class="modal-footer">
            <button
              @click="handleSubmit"
              :disabled="loading || !isValid"
              class="btn btn--primary"
            >
              <IconLoader v-if="loading" :size="18" class="spinner" />
              <span v-else>{{ mode === 'create' ? 'ایجاد' : 'ذخیره' }}</span>
            </button>
            <button
              @click="handleCancel"
              :disabled="loading"
              class="btn btn--default"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { IconX, IconLoader } from '@tabler/icons-vue'
import type { Column } from '../types'

// Import field components
import StringField from './fields/StringField.vue'
import NumberField from './fields/NumberField.vue'
import SelectField from './fields/SelectField.vue'
import DateField from './fields/DateField.vue'
import CheckboxField from './fields/CheckboxField.vue'
import TagsField from './fields/TagsField.vue'
import FileField from './fields/FileField.vue'

const props = defineProps<{
  modelValue: boolean
  title: string
  data: Record<string, any>
  columns: Column[]
  mode: 'create' | 'update'
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [data: Record<string, any>]
  'cancel': []
}>()

const formData = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string>>({})

const editableColumns = computed(() => 
  props.columns.filter(col => col.editable !== false)
)

const modalWidth = computed(() => {
  const sizes = {
    small: '500px',
    medium: '700px',
    large: '900px'
  }
  return sizes[props.size || 'medium']
})

const isValid = computed(() => {
  // Check required fields
  for (const column of editableColumns.value) {
    if (column.required && !formData[column.key]) {
      return false
    }
    if (errors[column.key]) {
      return false
    }
  }
  return true
})

// Field component mapping
const fieldComponents: Record<string, any> = {
  string: StringField,
  number: NumberField,
  currency: NumberField,
  percent: NumberField,
  enum: SelectField,
  status: SelectField,
  boolean: CheckboxField,
  date: DateField,
  datetime: DateField,
  jalali: DateField,
  tags: TagsField,
  array: TagsField,
  file: FileField,
  image: FileField
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    // Initialize form data
    Object.assign(formData, props.data)
    // Clear errors
    Object.keys(errors).forEach(key => delete errors[key])
  }
})

function getFieldComponent(column: Column) {
  return fieldComponents[column.type || 'string'] || fieldComponents.string
}

async function validateField(column: Column) {
  const value = formData[column.key]
  
  // Required validation
  if (column.required && !value) {
    errors[column.key] = `${column.label} الزامی است`
    return false
  }
  
  // Custom validation rules
  if (column.rules) {
    for (const rule of column.rules) {
      const result = await rule.validator(value, formData)
      if (!result) {
        errors[column.key] = rule.message
        return false
      }
    }
  }
  
  // Clear error if valid
  delete errors[column.key]
  return true
}

async function validateForm() {
  let valid = true
  
  for (const column of editableColumns.value) {
    const fieldValid = await validateField(column)
    if (!fieldValid) valid = false
  }
  
  return valid
}

async function handleSubmit() {
  if (props.loading) return
  
  const valid = await validateForm()
  if (!valid) return
  
  emit('save', { ...formData })
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
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

.modal-content {
  background: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-text);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.modal-close:hover {
  background: var(--color-border);
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: var(--space-lg);
}

.crud-form {
  display: grid;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-group--error .form-control {
  border-color: var(--color-error);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.required {
  color: var(--color-error);
}

.form-control {
  position: relative;
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

.modal-footer {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.btn {
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
  gap: var(--space-sm);
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn--default {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn--default:hover:not(:disabled) {
  background: var(--color-border);
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

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .modal-content {
    width: 100% !important;
  }
}
</style>