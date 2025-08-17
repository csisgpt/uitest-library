<template>
  <div
    :class="[
      $style.container,
      $style[position],
      $style[direction],
      $style[type],
      { [$style.open]: isOpen, [$style.noTransition]: !transition }
    ]"
  >
    <button
      type="button"
      :class="$style.button"
      @click="onMainClick"
      :aria-expanded="isOpen"
    >
      <slot name="icon">
        {{ icon }}
      </slot>
    </button>
    <ul :class="$style.list" role="menu">
      <li
        v-for="(item, index) in model"
        :key="index"
        :class="$style.item"
        :style="{ '--_transform': isOpen ? getTransform(index) : undefined }"
      >
        <slot name="item" :item="item">
          <button
            type="button"
            :class="$style.action"
            @click="onItemClick(item, $event)"
            :tabindex="isOpen ? 0 : -1"
            role="menuitem"
          >
            {{ item.icon }}
          </button>
        </slot>
        <span
          v-if="tooltip && item.tooltip"
          :class="$style.tooltip"
        >
          {{ item.tooltip }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, defineProps, defineEmits } from 'vue';

interface SpeedDialItem {
  icon: string;
  command?: () => void;
  tooltip?: string;
}

const props = withDefaults(
  defineProps<{
    model: SpeedDialItem[];
    direction?: 'up' | 'down' | 'left' | 'right';
    type?: 'linear' | 'circle';
    icon?: string;
    transition?: boolean;
    position?: string;
    tooltip?: boolean;
  }>(),
  {
    model: () => [],
    direction: 'up',
    type: 'circle',
    icon: '+',
    transition: true,
    position: 'bottom-right',
    tooltip: false,
  }
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

const isOpen = ref(false);

function onMainClick(e: MouseEvent) {
  emit('click', e);
  isOpen.value = !isOpen.value;
  emit(isOpen.value ? 'open' : 'close');
}

function onItemClick(item: SpeedDialItem, e: MouseEvent) {
  item.command?.();
  isOpen.value = false;
  emit('close');
}

function getTransform(index: number) {
  if (props.type === 'circle') {
    const angle = (360 / props.model.length) * index;
    return `rotate(${angle}deg) translate(var(--sd-circle-radius)) rotate(-${angle}deg)`;
  }
  const distance = `calc(var(--sd-spacing) * ${index + 1})`;
  switch (props.direction) {
    case 'down':
      return `translate3d(0, ${distance}, 0)`;
    case 'left':
      return `translate3d(calc(-1 * ${distance}), 0, 0)`;
    case 'right':
      return `translate3d(${distance}, 0, 0)`;
    default:
      return `translate3d(0, calc(-1 * ${distance}), 0)`;
  }
}
</script>

<style module src="./BaseSpeedDial.module.css">
/* Standardized states */
:focus-visible{outline:none;box-shadow:0 0 0 var(--focus-ring-offset) var(--color-background),0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);}
*{transition:background var(--transition-base),color var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base);}</style>
