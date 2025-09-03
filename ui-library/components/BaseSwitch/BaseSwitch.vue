<template>
  <div
    :class="[
      $style.switch,
      $style[`switch--${size}`],
      $style[`switch--${variant}`],
      {
        [$style['switch--checked']]: checked,
        [$style['switch--disabled']]: disabled,
        [$style['switch--loading']]: loading,
        [$style['switch--invalid']]: invalid,
        [$style['switch--readonly']]: readonly,
      },
    ]"
    :data-testid="dataTestId"
  >
    <!-- Label (before switch) -->
    <label v-if="$slots.label || label" :for="inputId" :class="$style.label">
      <slot name="label">{{ label }}</slot>
    </label>

    <!-- Switch Container -->
    <div
      :class="$style.container"
      @click="handleClick"
      @keydown="handleKeydown"
      :tabindex="disabled ? -1 : 0"
      :role="'switch'"
      :aria-checked="checked"
      :aria-disabled="disabled"
      :aria-readonly="readonly"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-invalid="invalid"
      ref="containerRef"
    >
      <!-- Hidden Input -->
      <input
        :id="inputId"
        ref="inputRef"
        type="checkbox"
        :class="$style.input"
        :checked="checked"
        :disabled="disabled || loading"
        :readonly="readonly"
        :required="required"
        :name="name"
        :value="value"
        :aria-label="ariaLabel"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Track -->
      <div :class="$style.track">
        <!-- Track Icons -->
        <div v-if="showTrackIcons" :class="$style.trackIcons">
          <span :class="$style.trackIconChecked">
            <slot name="icon-checked">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </slot>
          </span>
          <span :class="$style.trackIconUnchecked">
            <slot name="icon-unchecked">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </slot>
          </span>
        </div>

        <!-- Thumb -->
        <div :class="$style.thumb">
          <!-- Loading Spinner -->
          <div v-if="loading" :class="$style.spinner">
            <svg
              :class="$style.spinnerIcon"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                opacity="0.25"
              />
              <path
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          </div>

          <!-- Thumb Icon -->
          <div
            v-else-if="$slots.thumbIcon || thumbIcon"
            :class="$style.thumbIcon"
          >
            <slot name="thumb-icon">
              <component :is="thumbIcon" />
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Helper Text -->
    <div v-if="$slots.helper || helperText" :class="$style.helper">
      <slot name="helper">{{ helperText }}</slot>
    </div>

    <!-- Error Message -->
    <div v-if="invalid && (errorMessage || $slots.error)" :class="$style.error">
      <slot name="error">{{ errorMessage }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import style from './BaseSwitch.module.css'
export interface BaseSwitchProps {
  /** Current checked state */
  modelValue?: boolean;
  /** Switch label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  errorMessage?: string;
  /** Switch size */
  size?: "sm" | "md" | "lg";
  /** Switch variant */
  variant?: "default" | "success" | "warning" | "danger";
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Invalid/error state */
  invalid?: boolean;
  /** Readonly state */
  readonly?: boolean;
  /** Required field */
  required?: boolean;
  /** Input name attribute */
  name?: string;
  /** Input value attribute */
  value?: string | number;
  /** Input id */
  id?: string;
  /** Aria label */
  ariaLabel?: string;
  /** Aria labelledby */
  labelledBy?: string;
  /** Aria describedby */
  describedBy?: string;
  /** Show icons in track */
  showTrackIcons?: boolean;
  /** Thumb icon component */
  thumbIcon?: any;
  /** Auto focus */
  autofocus?: boolean;
  /** Data test id */
  dataTestId?: string;
}

export interface BaseSwitchEmits {
  /** Update model value */
  "update:modelValue": [value: boolean];
  /** Change event */
  change: [event: Event, value: boolean];
  /** Focus event */
  focus: [event: FocusEvent];
  /** Blur event */
  blur: [event: FocusEvent];
  /** Click event */
  click: [event: MouseEvent];
}

const props = withDefaults(defineProps<BaseSwitchProps>(), {
  modelValue: false,
  size: "md",
  variant: "default",
  disabled: false,
  loading: false,
  invalid: false,
  readonly: false,
  required: false,
  showTrackIcons: false,
  autofocus: false,
});

const emit = defineEmits<BaseSwitchEmits>();

// Refs
const containerRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLInputElement>();

// Computed
const checked = computed(() => props.modelValue);

const inputId = computed(() => {
  return props.id || `switch-${Math.random().toString(36).substr(2, 9)}`;
});

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading || props.readonly) return;

  emit("click", event);
  toggle();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.loading || props.readonly) return;

  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    toggle();
  }
};

const handleChange = (event: Event) => {
  if (props.disabled || props.loading || props.readonly) return;

  const target = event.target as HTMLInputElement;
  const newValue = target.checked;

  emit("update:modelValue", newValue);
  emit("change", event, newValue);
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};

const toggle = () => {
  if (props.disabled || props.loading || props.readonly) return;

  emit("update:modelValue", !checked.value);
};

const focus = () => {
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const blur = () => {
  inputRef.value?.blur();
};

// Auto focus
watch(
  () => props.autofocus,
  (newValue) => {
    if (newValue) {
      focus();
    }
  },
  { immediate: true }
);

// Expose methods
defineExpose({
  focus,
  blur,
  toggle,
});
</script>


<style lang="css" module src="./BaseSwitch.module.css" ></style>