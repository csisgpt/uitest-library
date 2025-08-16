<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { segmentInjectionKey, SegmentValue } from './BaseSegment.vue';

interface Props {
  value: SegmentValue;
  lazy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true,
});

const segment = inject(segmentInjectionKey);
if (!segment) throw new Error('BaseSegmentContent must be used within BaseSegment');

const shown = ref(!props.lazy);
const isActive = computed(() => segment.isActive(props.value));

watch(isActive, val => { if (val) shown.value = true; });
</script>

<template>
  <div v-if="shown && isActive">
    <slot />
  </div>
</template>
