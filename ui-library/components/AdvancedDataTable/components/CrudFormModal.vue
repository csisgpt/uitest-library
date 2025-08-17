
<template>
  <BaseModal :open="open" @close="emit('close')">
    <template #header>
      <slot name="title">
        {{ mode === 'create' ? 'افزودن' : mode === 'edit' ? 'ویرایش' : 'حذف' }}
      </slot>
    </template>

    <div v-if="mode !== 'delete'">
      <slot :name="mode === 'create' ? 'form-create' : 'form-edit'" :row="row" :submit="() => emit('submit')" />
    </div>
    <div v-else style="padding: var(--space-md)">
      <slot name="confirm-delete" :row="row">
        آیا از حذف این ردیف مطمئن هستید؟
      </slot>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="emit('close')">انصراف</BaseButton>
      <BaseButton :disabled="loading" @click="emit('submit')">
        {{ mode === 'delete' ? 'حذف' : 'ثبت' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { BaseButton, BaseModal } from '../../index';
defineProps<{ open: boolean; loading: boolean; mode: 'create' | 'edit' | 'delete' | null; row: any | null }>();
const emit = defineEmits<{ (e:'close'):void; (e:'submit'):void }>();
</script>
