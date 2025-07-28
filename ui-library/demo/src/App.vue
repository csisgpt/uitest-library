<template>
  <div>
    <BaseButton @click="toggle">Toggle Theme</BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const current = ref<'light' | 'dark'>('light');

function toggle() {
  current.value = current.value === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', current.value);
}
</script>
