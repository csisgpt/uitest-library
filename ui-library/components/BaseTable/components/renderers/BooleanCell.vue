<template>
  <div class="cell-boolean">
    <label class="boolean-label" :class="{ 'boolean-label--disabled': !editing }">
      <input
        type="checkbox"
        v-model="localValue"
        :disabled="!editing"
        @change="handleChange"
        class="boolean-checkbox"
      />
      <span 
        class="boolean-text"
        :style="{ color: localValue ? options?.trueColor : options?.falseColor }"
      >
        {{ localValue ? trueLabel : falseLabel }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Column } from '../../types'

const props = defineProps<{
  value: boolean
  row: any
  column: Column
  editing?: boolean
}>()

const emit = defineEmits<{
  save: [value: boolean]
  cancel: []
}>()

const localValue = ref(props.value || false)
const options = computed(() => props.column.typeOptions)

const trueLabel = computed(() => options.value?.trueLabel || 'بله')
const falseLabel = computed(() => options.value?.falseLabel || 'خیر')

watch(() => props.value, (newValue) => {
  localValue.value = newValue || false
})

function handleChange() {
  if (props.editing) {
    emit('save', localValue.value)
  }
}