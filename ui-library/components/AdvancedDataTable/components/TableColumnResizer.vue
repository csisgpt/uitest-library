<!-- TableColumnResizer.vue - Drag handle for resizing table columns -->
<template>
  <span :class="styles['resize-handle']" @mousedown.prevent="start"></span>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import styles from '../AdvancedDataTable.module.css';

const emit = defineEmits<{ (e: 'resize', width: string): void }>();

let startX = 0;
let startWidth = 0;
let target: HTMLElement | null = null;

function onMove(e: MouseEvent) {
  if (!target) return;
  const newWidth = startWidth + (e.clientX - startX);
  emit('resize', newWidth + 'px');
}

function onUp() {
  window.removeEventListener('mousemove', onMove);
  window.removeEventListener('mouseup', onUp);
  target = null;
}

function start(e: MouseEvent) {
  target = (e.target as HTMLElement).parentElement;
  if (!target) return;
  startX = e.clientX;
  startWidth = target.getBoundingClientRect().width;
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

onBeforeUnmount(() => onUp());
</script>
