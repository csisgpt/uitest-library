
<template>
  <div style="display:inline-flex; gap: var(--space-sm)">
    <BaseButton size="sm" @click="emit('create')">افزودن</BaseButton>
    <BaseButton size="sm" variant="ghost" :disabled="!hasSelection" @click="emit('deleteSelected')">حذف انتخاب‌شده‌ها</BaseButton>
  </div>
</template>
<script setup lang="ts">
import { BaseButton } from '../../index';
defineProps<{ hasSelection: boolean }>();
const emit = defineEmits<{ (e:'create'):void; (e:'deleteSelected'):void }>();
</script>
