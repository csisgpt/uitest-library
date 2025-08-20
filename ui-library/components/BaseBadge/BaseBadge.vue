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
</style>
