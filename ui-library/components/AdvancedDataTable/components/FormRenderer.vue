<template>
  <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--space-md)">
    <template v-for="field in schema.fields" :key="field.id">
      <div :style="{ gridColumn: 'span 12' }">
        <BaseFormField :label="field.label">
          <component :is="resolve(field)" v-model="model[field.id]" v-bind="componentProps(field)" />
        </BaseFormField>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { BaseInput, BaseSelect, BaseCheckbox, BaseFormField } from '../../index';
import type { FormSchema, FieldSchema } from '../types';
const props = defineProps<{ schema: FormSchema; model: Record<string, any>; }>();
function resolve(field: FieldSchema) { switch (field.type) { case 'text': case 'email': case 'number': case 'date': case 'textarea': return BaseInput; case 'select': return BaseSelect; case 'checkbox': return BaseCheckbox; default: return BaseInput; } }
function componentProps(field: FieldSchema) { const common = { placeholder: field.placeholder }; if (field.type === 'textarea') return { ...common, type: 'textarea' }; if (field.type === 'number') return { ...common, type: 'number' }; if (field.type === 'email') return { ...common, type: 'email' }; if (field.type === 'date') return { ...common, type: 'date' }; if (field.type === 'select') return { ...common, items: field.options || [], labelField: 'label', valueField: 'value' }; if (field.type === 'checkbox') return { ...common }; return common; }
</script>
