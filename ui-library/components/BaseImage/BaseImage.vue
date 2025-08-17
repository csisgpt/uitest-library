<template>
  <div :class="[$style.wrapper, $style[radiusClass]]" :style="wrapperStyle">
    <slot v-if="$slots.default" />
    <template v-else>
      <div v-if="!isLoaded && !isError" :class="$style.placeholder">
        <slot name="placeholder">
          <img v-if="placeholder" :src="placeholder" :alt="alt" />
        </slot>
        <span v-if="loadingIndicator" :class="$style.loader" />
      </div>

      <img
        v-show="!isError"
        :src="currentSrc"
        :alt="alt"
        :loading="lazy ? 'lazy' : 'eager'"
        :style="imgStyle"
        :class="[
          $style.image,
          transition && $style.transition,
          transition && isLoaded && $style.loaded,
        ]"
        @load="onLoad"
        @error="onError"
        role="img"
      />

      <div v-if="isError" :class="$style.error">
        <slot name="error">
          <img v-if="fallback" :src="fallback" :alt="alt" />
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    width?: string | number;
    maxWidth?: string | number;
    height?: string | number;
    fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    radius?: "none" | "sm" | "md" | "lg" | "full";
    lazy?: boolean;
    placeholder?: string;
    fallback?: string;
    loadingIndicator?: boolean;
    transition?: boolean;
    aspectRatio?: string;
    objectPosition?: string;
  }>(),
  {
    alt: "",
    fit: "cover",
    radius: "none",
    width: "100%",
    maxWidth: "300px",
    lazy: false,
    placeholder: "",
    fallback: "",
    loadingIndicator: false,
    transition: false,
    aspectRatio: "",
    objectPosition: "center",
  }
);

const emit = defineEmits<{
  (e: "load", event: Event): void;
  (e: "error", event: Event): void;
}>();

const isLoaded = ref(false);
const isError = ref(false);
const currentSrc = ref(props.src);

watch(
  () => props.src,
  (val) => {
    currentSrc.value = val;
    isLoaded.value = false;
    isError.value = false;
  }
);

const addUnit = (val?: string | number) => {
  if (val === undefined || val === null) return undefined;
  return typeof val === "number" ? `${val}px` : val;
};

const wrapperStyle = computed(() => ({
  width: addUnit(props.width),
  height: addUnit(props.height),
  maxWidth: addUnit(props.maxWidth),
  aspectRatio: props.aspectRatio || undefined,
}));

const imgStyle = computed(() => ({
  objectFit: props.fit,
  objectPosition: props.objectPosition,
}));

const radiusClass = computed(
  () => `radius${props.radius.charAt(0).toUpperCase() + props.radius.slice(1)}`
);

function onLoad(e: Event) {
  isLoaded.value = true;
  emit("load", e);
}

function onError(e: Event) {
  if (props.fallback && currentSrc.value !== props.fallback) {
    currentSrc.value = props.fallback;
    return;
  }
  isError.value = true;
  emit("error", e);
}
</script>

<style module src="./BaseImage.module.css">
/* Standardized states */
:focus-visible{outline:none;box-shadow:0 0 0 var(--focus-ring-offset) var(--color-background),0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);}
*{transition:background var(--transition-base),color var(--transition-base),box-shadow var(--transition-base),border-color var(--transition-base);}</style>
