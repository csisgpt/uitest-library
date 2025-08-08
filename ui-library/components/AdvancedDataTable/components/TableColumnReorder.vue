<!-- TableColumnReorder.vue - Wrapper th enabling drag and drop reordering -->
<template>
  <th
    draggable="true"
    @dragstart="onDragStart"
    @dragover.prevent
    @drop="onDrop"
  >
    <slot />
  </th>
</template>

<script setup lang="ts">
const props = defineProps<{ index: number }>();
const emit = defineEmits<{ (e: 'reorder', payload: { from: number; to: number }): void }>();

function onDragStart(e: DragEvent) {
  e.dataTransfer?.setData('text/plain', String(props.index));
}

function onDrop(e: DragEvent) {
  const from = parseInt(e.dataTransfer?.getData('text/plain') || '-1', 10);
  const to = props.index;
  if (from >= 0) emit('reorder', { from, to });
}
</script>
