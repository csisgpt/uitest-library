<template>
  <div style="display: inline-flex; gap: var(--space-xs); align-items: center">
    <BaseButton size="sm" variant="ghost" @click="emit('edit')"><BaseIcon name="pencil" /></BaseButton>
    <BaseButton size="sm" variant="ghost" @click="emit('delete')"><BaseIcon name="trash" /></BaseButton>
  </div>
</template>
<script setup lang="ts">
import { BaseButton, BaseIcon } from '../../index';
const emit = defineEmits<{ (e:'edit'): void; (e:'delete'): void }>();
</script>
