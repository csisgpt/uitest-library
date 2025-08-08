<!-- TableVirtualScroller.vue - Simple virtual scrolling container -->
<template>
  <div
    ref="container"
    :class="styles['virtual-scroll-container']"
    @scroll="onScroll"
    :style="{ maxHeight: height + 'px', overflowY: 'auto', position: 'relative' }"
  >
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div :style="{ position: 'absolute', top: start * rowHeight + 'px', left: 0, right: 0 }">
        <slot :rows="visibleRows" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import styles from '../AdvancedDataTable.module.css';

const props = defineProps<{ rows: any[]; rowHeight: number; height: number }>();
const emit = defineEmits<{ (e: 'range', value: { start: number; end: number }): void }>();

const container = ref<HTMLElement>();
const start = ref(0);

const visibleCount = computed(() => Math.ceil(props.height / props.rowHeight) + 1);
const totalHeight = computed(() => props.rows.length * props.rowHeight);
const visibleRows = computed(() =>
  props.rows.slice(start.value, start.value + visibleCount.value)
);

function onScroll() {
  if (!container.value) return;
  start.value = Math.floor(container.value.scrollTop / props.rowHeight);
  emit('range', { start: start.value, end: start.value + visibleCount.value });
}
</script>
