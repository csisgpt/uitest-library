<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :class="[
      $style.button,
      $style[variant],
      $style[size],
      {
        [$style.block]: block,
        [$style.rounded]: rounded,
        [$style.fullWidth]: fullWidth,
        [$style.text]: text,
        [$style.icon]: icon,
        [$style.loading]: loading,
        [$style.disabled]: disabled,
      }
    ]"
    :disabled="disabled || loading"
    v-bind="attrs"
  >
    <slot name="prepend" />
    <span v-if="loading" :class="$style.loader"></span>
    <slot v-else />
    <slot name="append" />
  </component>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error' | 'success' | 'warning' | 'info';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    block?: boolean;
    rounded?: boolean;
    text?: boolean;
    fullWidth?: boolean;
    icon?: boolean;
    loading?: boolean;
    disabled?: boolean;
    as?: string;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    block: false,
    rounded: false,
    text: false,
    fullWidth: false,
    icon: false,
    loading: false,
    disabled: false,
    as: 'button'
  }
);

const attrs = useAttrs();
</script>

<style module src="./BaseButton.module.css"></style>
