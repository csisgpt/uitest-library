<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import BaseSegment, { BaseSegmentProps, SegmentValue } from './BaseSegment.vue';
import BaseSegmentContent from './BaseSegmentContent.vue';

interface ContentItem {
  value: SegmentValue;
  vnode: () => any;
}

interface Props extends BaseSegmentProps {
  contents?: ContentItem[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: SegmentValue | SegmentValue[] | null): void;
  (e: 'change', v: SegmentValue | SegmentValue[] | null): void;
}>();

const model = ref<SegmentValue | SegmentValue[] | null>(props.modelValue ?? (props.multiple ? [] : null));
watch(() => props.modelValue, v => (model.value = v ?? (props.multiple ? [] : null)));
watch(model, v => emit('update:modelValue', v));
function onChange(v: any) { emit('change', v); }

const segmentProps = computed(() => {
  const { contents: _c, ...rest } = props;
  return rest;
});
</script>

<template>
  <div>
    <BaseSegment v-bind="segmentProps" v-model="model" @change="onChange" />
    <div>
      <template v-if="contents && contents.length">
        <BaseSegmentContent v-for="c in contents" :key="c.value" :value="c.value">
          <component :is="c.vnode" />
        </BaseSegmentContent>
      </template>
      <slot v-else />
    </div>
  </div>
</template>
