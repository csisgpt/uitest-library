<template>
  <span
    v-if="iconSvg"
    :class="[$style.icon, typeof size === 'string' ? $style[size] : null]"
    :style="styleVars"
    v-bind="a11yAttrs"
    v-html="iconSvg"
  />
  <span
    v-else
    :class="[$style.icon, typeof size === 'string' ? $style[size] : null]"
    :style="styleVars"
    v-bind="a11yAttrs"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  name?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
  ariaLabel?: string;
}>(), {
  size: 'md',
  color: 'currentColor'
});

const icons = import.meta.glob('./icons/*.svg', { as: 'raw', eager: true }) as Record<string, string>;

const iconSvg = computed(() => {
  if (!props.name) return '';
  const key = `./icons/${props.name}.svg`;
  return icons[key] || '';
});

const styleVars = computed(() => ({
  '--icon-color': props.color,
  ...(typeof props.size === 'number' ? { '--icon-size': `${props.size}px` } : {}),
}));

const a11yAttrs = computed(() =>
  props.ariaLabel
    ? { role: 'img', 'aria-label': props.ariaLabel }
    : { 'aria-hidden': 'true' }
);
</script>

<style module src="./BaseIcon.module.css">
/* Standardized states */
:focus-visible{outline:none;box-shadow:0 0 0 var(--focus-ring-offset) var(--color-background),0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);}
*{transition:background var(--transition-base),color var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base);}</style>
