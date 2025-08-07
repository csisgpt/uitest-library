<template>
  <div :class="$style.splitButton" ref="root" @keydown="onKeydown">
    <slot
      name="button"
      :onClick="onMainClick"
      :disabled="disabled"
      :loading="loading"
    >
      <BaseButton
        :variant="color"
        :size="size"
        :disabled="disabled"
        :loading="loading"
        :class="$style.main"
        @click="onMainClick"
      >
        <i v-if="icon" :class="[$style.icon, icon]"></i>
        {{ label }}
      </BaseButton>
    </slot>
    <BaseButton
      ref="toggleBtn"
      :variant="color"
      :size="size"
      :disabled="disabled"
      :class="$style.toggle"
      icon
      @click="toggle"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
    >
      <span :class="$style.caret">▼</span>
    </BaseButton>
    <transition name="fade">
      <ul v-show="isOpen" ref="menu" :class="$style.menu">
        <li
          v-for="(item, index) in model"
          :key="index"
          :ref="el => setItemRef(el, index)"
          :class="[$style.menuItem, focusedIndex === index && $style.focused, item.disabled && $style.disabled]"
          @click="() => onItemSelect(item)"
          @mouseenter="focus(index)"
          tabindex="-1"
        >
          <slot name="item" :item="item">
            <i v-if="item.icon" :class="[$style.itemIcon, item.icon]"></i>
            <span>{{ item.label }}</span>
          </slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, defineProps, defineEmits, onMounted, onBeforeUnmount, nextTick, watchEffect } from 'vue';
import BaseButton from '../BaseButton/BaseButton.vue';

interface MenuItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  command?: () => void;
}

const props = withDefaults(defineProps<{
  label: string;
  icon?: string;
  model?: MenuItem[];
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'outline' | 'ghost';
}>(), {
  model: () => [],
  disabled: false,
  loading: false,
  size: 'md',
  color: 'primary'
});

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void;
}>();

const isOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const toggleBtn = ref<HTMLElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const focusedIndex = ref(-1);
const itemRefs = ref<HTMLElement[]>([]);

function onMainClick(e: MouseEvent) {
  if (props.disabled || props.loading) return;
  emit('click', e);
}

function toggle() {
  if (props.disabled || props.loading) return;
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
  focusedIndex.value = -1;
}

function onItemSelect(item: MenuItem) {
  if (item.disabled) return;
  item.command?.();
  close();
}

function setItemRef(el: HTMLElement | null, index: number) {
  if (el) itemRefs.value[index] = el;
}

function focus(index: number) {
  if (props.model[index]?.disabled) return;
  focusedIndex.value = index;
  itemRefs.value[index]?.focus();
}

function focusNext() {
  if (!props.model.length) return;
  let i = focusedIndex.value;
  do {
    i = (i + 1) % props.model.length;
  } while (props.model[i]?.disabled && i !== focusedIndex.value);
  focus(i);
}

function focusPrev() {
  if (!props.model.length) return;
  let i = focusedIndex.value;
  do {
    i = (i - 1 + props.model.length) % props.model.length;
  } while (props.model[i]?.disabled && i !== focusedIndex.value);
  focus(i);
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return;
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      focusNext();
      break;
    case 'ArrowUp':
      e.preventDefault();
      focusPrev();
      break;
    case 'Enter':
      e.preventDefault();
      if (focusedIndex.value >= 0) {
        const item = props.model[focusedIndex.value];
        if (item) onItemSelect(item);
      }
      break;
    case 'Escape':
      e.preventDefault();
      close();
      toggleBtn.value?.focus();
      break;
  }
}

function handleClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

watchEffect(() => {
  if (isOpen.value) {
    nextTick(() => {
      focusNext();
    });
  }
});
</script>

<style module src="./BaseSplitButton.module.css"></style>
