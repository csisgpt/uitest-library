<template>
  <component
    :is="resolvedTag"
    :class="flexClasses"
    :style="[flexStyles, responsiveVars, passthroughAttrs.style]"
    v-bind="passthroughAttrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from "vue";
import styles from "./BaseFlex.module.css";

export interface BaseFlexProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | string;
  rowGap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  columnGap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  grow?: boolean;
  shrink?: boolean;
  basis?: "auto" | "full" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4" | string;
  inline?: boolean;
  as?: string;
  customGap?: string;
  responsive?: Record<string, any>; // Responsive behaviors
}

const props = withDefaults(defineProps<BaseFlexProps>(), {
  direction: "row",
  wrap: "nowrap",
  align: "stretch",
  justify: "start",
  gap: "none",
  rowGap: undefined,
  columnGap: undefined,
  grow: false,
  shrink: true,
  basis: "auto",
  inline: false,
  as: "div",
  customGap: undefined,
  responsive: undefined,
});

const attrs = useAttrs();

const resolvedTag = computed(() => props.as || "div");

/** Classes for flex container */
const flexClasses = computed(() => {
  const classes = [styles.flex];

  if (props.inline) classes.push(styles["flex--inline"]);
  if (props.direction !== "row")
    classes.push(styles[`flex--${props.direction}`]);
  if (props.wrap !== "nowrap") classes.push(styles[`flex--${props.wrap}`]);
  if (props.align !== "stretch")
    classes.push(styles[`flex--align-${props.align}`]);
  if (props.justify !== "start")
    classes.push(styles[`flex--justify-${props.justify}`]);
  if (props.gap && props.gap !== "none")
    classes.push(styles[`flex--gap-${props.gap}`]);
  if (props.rowGap && props.rowGap !== "none")
    classes.push(styles[`flex--row-gap-${props.rowGap}`]);
  if (props.columnGap && props.columnGap !== "none")
    classes.push(styles[`flex--column-gap-${props.columnGap}`]);
  if (props.grow) classes.push(styles["flex--grow"]);
  if (!props.shrink) classes.push(styles["flex--no-shrink"]);
  if (props.basis && props.basis !== "auto")
    classes.push(styles[`flex--basis-${props.basis.replace("/", "-")}`]);

  return classes;
});

/** Inline styles based on custom gap/basis properties */
const flexStyles = computed((): CSSProperties => {
  const styles: Record<string, string> = {};

  if (props.customGap) styles["--flex-gap-custom"] = props.customGap;
  if (
    props.basis &&
    !["auto", "full", "1/2", "1/3", "2/3", "1/4", "3/4"].includes(props.basis)
  ) {
    styles["--flex-basis-custom"] = props.basis;
  }

  return Object.keys(styles).length > 0 ? styles : undefined;
});

/** Passthrough attributes (for responsiveness) */
const passthroughAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs as any;
  return rest;
});

/** Handling responsive breakpoints */
const responsiveVars = computed((): CSSProperties => {
  const styles: CSSProperties = {};
  if (props.responsive) {
    for (const [breakpoint, value] of Object.entries(props.responsive)) {
      styles[`--flex-${breakpoint}-cols`] = value;
    }
  }
  return styles;
});
</script>
