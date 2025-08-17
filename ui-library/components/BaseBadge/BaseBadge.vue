<template>
  <span
    :class="[
      $style.badge,
      $style[color],
      $style[variant],
      $style[size],
      $style[`rounded-${rounded}`],
      {
        [$style.dot]: dot,
        [$style.positioned]: positioned,
        [$style['aspect-square']]: aspectSquare,
      },
    ]"

    style="padding: 4px;"
  >
    <slot v-if="!dot">{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string | number;
    color?: "primary" | "success" | "error" | "warning" | "info" | "neutral";
    variant?: "solid" | "soft" | "outline";
    size?: "sm" | "md" | "lg";
    rounded?: "sm" | "md" | "full";
    dot?: boolean;
    positioned?: boolean;
    aspectSquare?: boolean; // 👈 اضافه شد
  }>(),
  {
    text: "",
    color: "primary",
    variant: "solid",
    size: "md",
    rounded: "md",
    dot: false,
    positioned: false,
    aspectSquare: false, // 👈 پیش‌فرض false
  }
);
</script>

<style module src="./BaseBadge.module.css">
/* Standardized states */
:focus-visible{outline:none;box-shadow:0 0 0 var(--focus-ring-offset) var(--color-background),0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);}
*{transition:background var(--transition-base),color var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base);}</style>
