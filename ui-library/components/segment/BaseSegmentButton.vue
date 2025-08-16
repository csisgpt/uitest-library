<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount, ref, watch, useSlots } from 'vue';
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import styles from './BaseSegmentButton.module.css';
import { segmentInjectionKey, SegmentValue } from './BaseSegment.vue';

interface Props {
  value: SegmentValue;
  label?: string;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  icon: undefined,
  disabled: false,
});

const segment = inject(segmentInjectionKey);
if (!segment) throw new Error('BaseSegmentButton must be used within BaseSegment');

const slots = useSlots();
const el = ref<HTMLElement>();

onMounted(() => {
  if (el.value) segment.register(props.value, el.value, props.disabled);
});

onBeforeUnmount(() => segment.unregister(props.value));

watch(() => props.disabled, v => segment.setDisabled(props.value, v));

const isActive = computed(() => segment.isActive(props.value));
const tabIndex = computed(() => segment.getTabIndex(props.value, props.disabled));

function onClick() {
  if (props.disabled || segment.disabled.value) return;
  segment.select(props.value);
}

const iconOnly = computed(() => !props.label && !slots.default);
const ariaLabel = computed(() => (iconOnly.value ? String(props.value) : undefined));

const cls = computed(() => [
  styles.item,
  styles[segment.size],
  styles[`mode_${segment.mode}`],
  styles[`variant_${segment.variant}`],
  isActive.value && styles.active,
  (segment.disabled.value || props.disabled) && styles.disabled,
  segment.readonly.value && styles.readonly,
  iconOnly.value && styles.iconOnly,
]);
</script>

<template>
  <button
    ref="el"
    :class="cls"
    :role="segment.multiple ? 'button' : 'radio'"
    :aria-pressed="segment.multiple ? String(isActive) : undefined"
    :aria-checked="!segment.multiple ? String(isActive) : undefined"
    :aria-disabled="(segment.disabled.value || props.disabled) ? 'true' : undefined"
    :aria-label="ariaLabel"
    :tabindex="tabIndex"
    @click="onClick"
  >
    <span v-if="icon" :class="styles.iconWrap">
      <BaseIcon :name="icon" size="sm" />
    </span>
    <span v-if="label" :class="styles.label">{{ label }}</span>
    <slot />
  </button>
</template>

<style module src="./BaseSegmentButton.module.css"></style>
