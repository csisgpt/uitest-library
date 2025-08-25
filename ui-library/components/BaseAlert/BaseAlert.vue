<template>
  <Teleport to="body">
    <Transition name="alert-backdrop" appear>
      <div
        v-if="isOpen"
        :class="$style.backdrop"
        @click="handleBackdropClick"
        role="presentation"
      >
        <Transition name="alert-modal" appear>
          <div
            v-if="isOpen"
            :class="[$style.alert, $style[`alert--${variant}`]]"
            role="alertdialog"
            :aria-labelledby="headerId"
            :aria-describedby="messageId"
            @click.stop
          >
            <!-- Variant Icon -->
            <div :class="$style.iconContainer">
              <div :class="[$style.icon, $style[`icon--${variant}`]]">
                <svg
                  v-if="variant === 'success'"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else-if="variant === 'error'"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else-if="variant === 'warning'"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else-if="variant === 'info'"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <!-- Close Button -->
            <button
              v-if="showCloseButton"
              :class="$style.closeButton"
              @click="handleClose"
              type="button"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <!-- Content -->
            <div :class="$style.content">
              <!-- Header -->
              <div v-if="header" :class="$style.header">
                <h2 :id="headerId" :class="$style.title">
                  {{ header }}
                </h2>
              </div>

              <!-- Subheader -->
              <div v-if="subHeader" :class="$style.subHeader">
                {{ subHeader }}
              </div>

              <!-- Message -->
              <div v-if="message" :class="$style.message">
                <p :id="messageId" v-html="message"></p>
              </div>

              <!-- Inputs -->
              <div v-if="inputs && inputs.length" :class="$style.inputs">
                <template v-for="(input, index) in inputs" :key="index">
                  <!-- Text Input -->
                  <div
                    v-if="
                      input.type === 'text' ||
                      input.type === 'email' ||
                      input.type === 'password' ||
                      input.type === 'number' ||
                      input.type === 'tel' ||
                      input.type === 'url'
                    "
                    :class="$style.inputGroup"
                  >
                    <label
                      v-if="input.label"
                      :for="`input-${index}`"
                      :class="$style.inputLabel"
                    >
                      {{ input.label }}
                    </label>
                    <div :class="$style.inputWrapper">
                      <input
                        :id="`input-${index}`"
                        v-model="inputValues[input.name || index]"
                        :type="input.type || 'text'"
                        :placeholder="input.placeholder"
                        :disabled="input.disabled"
                        :class="[
                          $style.input,
                          { [$style['input--disabled']]: input.disabled },
                        ]"
                        :min="input.min"
                        :max="input.max"
                        @input="handleInputChange(input.name || index, $event)"
                        @focus="handleInputFocus"
                        @blur="handleInputBlur"
                      />
                      <div :class="$style.inputFocusRing"></div>
                    </div>
                  </div>

                  <!-- Textarea -->
                  <div
                    v-else-if="input.type === 'textarea'"
                    :class="$style.inputGroup"
                  >
                    <label
                      v-if="input.label"
                      :for="`input-${index}`"
                      :class="$style.inputLabel"
                    >
                      {{ input.label }}
                    </label>
                    <div :class="$style.inputWrapper">
                      <textarea
                        :id="`input-${index}`"
                        v-model="inputValues[input.name || index]"
                        :placeholder="input.placeholder"
                        :disabled="input.disabled"
                        :class="[
                          $style.textarea,
                          { [$style['textarea--disabled']]: input.disabled },
                        ]"
                        :rows="input.rows || 3"
                        @input="handleInputChange(input.name || index, $event)"
                        @focus="handleInputFocus"
                        @blur="handleInputBlur"
                      ></textarea>
                      <div :class="$style.inputFocusRing"></div>
                    </div>
                  </div>

                  <!-- Radio -->
                  <div
                    v-else-if="input.type === 'radio'"
                    :class="$style.radioGroup"
                  >
                    <div v-if="input.label" :class="$style.radioGroupLabel">
                      {{ input.label }}
                    </div>
                    <template
                      v-for="option in input.options"
                      :key="option.value"
                    >
                      <label :class="$style.radioLabel">
                        <input
                          :name="`radio-${index}`"
                          type="radio"
                          :value="option.value"
                          :checked="
                            inputValues[input.name || index] === option.value
                          "
                          :disabled="input.disabled || option.disabled"
                          :class="$style.radioInput"
                          @change="
                            handleInputChange(input.name || index, $event)
                          "
                        />
                        <span :class="$style.radioButton"></span>
                        <span :class="$style.radioText">{{ option.text }}</span>
                      </label>
                    </template>
                  </div>

                  <!-- Checkbox -->
                  <div
                    v-else-if="input.type === 'checkbox'"
                    :class="$style.checkboxGroup"
                  >
                    <div v-if="input.label" :class="$style.checkboxGroupLabel">
                      {{ input.label }}
                    </div>
                    <template
                      v-for="option in input.options"
                      :key="option.value"
                    >
                      <label :class="$style.checkboxLabel">
                        <input
                          type="checkbox"
                          :value="option.value"
                          :checked="
                            Array.isArray(inputValues[input.name || index])
                              ? inputValues[input.name || index].includes(
                                  option.value
                                )
                              : inputValues[input.name || index] ===
                                option.value
                          "
                          :disabled="input.disabled || option.disabled"
                          :class="$style.checkboxInput"
                          @change="
                            handleCheckboxChange(
                              input.name || index,
                              option.value,
                              $event
                            )
                          "
                        />
                        <span :class="$style.checkboxButton">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              stroke-width="3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                        <span :class="$style.checkboxText">{{
                          option.text
                        }}</span>
                      </label>
                    </template>
                  </div>
                </template>
              </div>

              <!-- Buttons -->
              <div :class="$style.buttons">
                <template
                  v-for="(button, index) in computedButtons"
                  :key="index"
                >
                  <button
                    :class="[
                      $style.button,
                      $style[`button--${button.role || 'default'}`],
                      { [$style['button--disabled']]: button.disabled },
                    ]"
                    :disabled="button.disabled"
                    @click="handleButtonClick(button)"
                    type="button"
                  >
                    <span :class="$style.buttonRipple"></span>
                    <span :class="$style.buttonText">{{ button.text }}</span>
                  </button>
                </template>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import style from "./BaseAlert.module.css";
// Types
interface AlertInput {
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "textarea"
    | "radio"
    | "checkbox"
    | "select"
    | "date"
    | "time"
    | "datetime-local";
  name?: string;
  placeholder?: string;
  value?: any;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  rows?: number;
  multiple?: boolean;
  options?: Array<{
    text: string;
    value: any;
    disabled?: boolean;
  }>;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
  attributes?: Record<string, any>;
}

interface AlertButton {
  text: string;
  role?: "cancel" | "destructive" | "confirm" | "default";
  cssClass?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  handler?: (data?: any) => boolean | void | Promise<boolean | void>;
}

interface Props {
  isOpen: boolean;
  header?: string;
  subHeader?: string;
  message?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  backdropDismiss?: boolean;
  showCloseButton?: boolean;
  inputs?: AlertInput[];
  buttons?: AlertButton[];
  keyboardClose?: boolean;
  htmlAttributes?: Record<string, any>;
  animated?: boolean;
  persistent?: boolean;
  size?: "small" | "medium" | "large";
  position?: "center" | "top" | "bottom";
}

interface Emits {
  (e: "update:isOpen", value: boolean): void;
  (e: "didOpen"): void;
  (e: "willClose"): void;
  (e: "didClose"): void;
  (e: "buttonClick", button: AlertButton, data?: any): void;
  (e: "inputChange", name: string, value: any): void;
  (
    e: "inputValidate",
    name: string,
    isValid: boolean,
    errorMessage?: string
  ): void;
  (e: "backdropClick"): void;
}

// Props & Emits
const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  backdropDismiss: true,
  showCloseButton: false,
  keyboardClose: true,
  buttons: () => [],
});

const emit = defineEmits<Emits>();

// Reactive data
const inputValues = ref<Record<string, any>>({});
const headerId = ref(`alert-header-${Math.random().toString(36).substr(2, 9)}`);
const messageId = ref(
  `alert-message-${Math.random().toString(36).substr(2, 9)}`
);

// Computed
const computedButtons = computed(() => {
  if (props.buttons && props.buttons.length > 0) {
    return props.buttons;
  }

  // Default OK button if no buttons provided
  return [
    {
      text: "باشه",
      role: "confirm" as const,
      handler: () => {
        handleClose();
      },
    },
  ];
});

const alertClasses = computed(() => [
  $style.alert,
  $style[`alert--${props.variant}`],
  $style[`alert--${props.size}`],
  $style[`alert--${props.position}`],
  {
    [$style["alert--loading"]]: isLoading.value,
    [$style["alert--persistent"]]: props.persistent,
  },
]);

// Validation functions
const validateInput = (input: AlertInput, value: any): string | null => {
  if (
    input.required &&
    (!value || (typeof value === "string" && !value.trim()))
  ) {
    return "این فیلد اجباری است";
  }

  if (input.validation) {
    const { pattern, minLength, maxLength, custom } = input.validation;

    if (pattern && value && !new RegExp(pattern).test(value)) {
      return "فرمت وارد شده صحیح نیست";
    }

    if (minLength && value && value.length < minLength) {
      return `حداقل ${minLength} کاراکتر وارد کنید`;
    }

    if (maxLength && value && value.length > maxLength) {
      return `حداکثر ${maxLength} کاراکتر مجاز است`;
    }

    if (custom) {
      return custom(value);
    }
  }

  return null;
};

const validateAllInputs = (): boolean => {
  if (!props.inputs) return true;

  let isValid = true;
  const errors: Record<string, string> = {};

  props.inputs.forEach((input, index) => {
    const key = input.name || index;
    const value = inputValues.value[key];
    const error = validateInput(input, value);

    if (error) {
      errors[key] = error;
      isValid = false;
    }
  });

  inputErrors.value = errors;
  return isValid;
};

// Initialize input values
const initializeInputValues = () => {
  if (props.inputs) {
    props.inputs.forEach((input, index) => {
      const key = input.name || index;
      if (input.type === "checkbox" && input.options) {
        inputValues.value[key] = input.value || [];
      } else {
        inputValues.value[key] = input.value || "";
      }
    });
  }
};

// Methods
const handleClose = () => {
  if (props.persistent && isLoading.value) return;
  emit("willClose");
  emit("update:isOpen", false);
};

const handleBackdropClick = () => {
  emit("backdropClick");
  if (props.backdropDismiss && !props.persistent && !isLoading.value) {
    handleClose();
  }
};

const handleButtonClick = async (button: AlertButton, index: number) => {
  if (button.disabled || buttonStates.value[index]?.loading) return;

  // Validate inputs if it's a confirm button
  if (button.role === "confirm" && props.inputs && props.inputs.length > 0) {
    if (!validateAllInputs()) {
      return;
    }
  }

  const data =
    Object.keys(inputValues.value).length > 0
      ? { ...inputValues.value }
      : undefined;

  // Set button loading state
  if (button.loading !== false) {
    buttonStates.value = {
      ...buttonStates.value,
      [index]: { loading: true, disabled: false },
    };
    isLoading.value = true;
  }

  try {
    emit("buttonClick", button, data);

    if (button.handler) {
      const result = await button.handler(data);
      if (result !== false) {
        handleClose();
      }
    } else {
      handleClose();
    }
  } catch (error) {
    console.error("Button handler error:", error);
  } finally {
    // Reset button loading state
    buttonStates.value = {
      ...buttonStates.value,
      [index]: { loading: false, disabled: false },
    };
    isLoading.value = false;
  }
};

const handleInputChange = (name: string, event: Event) => {
  const target = event.target as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;
  let value: any = target.value;

  // Handle different input types
  if (target instanceof HTMLInputElement) {
    if (target.type === "number") {
      value = target.valueAsNumber;
    } else if (target.type === "checkbox") {
      value = target.checked;
    } else if (
      target.type === "date" ||
      target.type === "time" ||
      target.type === "datetime-local"
    ) {
      value = target.value;
    }
  }

  inputValues.value[name] = value;

  // Clear previous error
  if (inputErrors.value[name]) {
    delete inputErrors.value[name];
  }

  // Validate on change
  const input = props.inputs?.find((inp, idx) => (inp.name || idx) === name);
  if (input) {
    const error = validateInput(input, value);
    if (error) {
      inputErrors.value[name] = error;
    }
    emit("inputValidate", name, !error, error || undefined);
  }

  emit("inputChange", name, value);
};

const handleCheckboxChange = (name: string, optionValue: any, event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!Array.isArray(inputValues.value[name])) {
    inputValues.value[name] = [];
  }

  if (target.checked) {
    if (!inputValues.value[name].includes(optionValue)) {
      inputValues.value[name].push(optionValue);
    }
  } else {
    const index = inputValues.value[name].indexOf(optionValue);
    if (index > -1) {
      inputValues.value[name].splice(index, 1);
    }
  }

  emit("inputChange", name, inputValues.value[name]);
};

const handleInputFocus = (event: Event) => {
  const target = event.target as HTMLElement;
  const wrapper = target.closest(".inputWrapper") as HTMLElement;
  if (wrapper) {
    wrapper.classList.add("focused");
  }
};

const handleInputBlur = (event: Event) => {
  const target = event.target as HTMLElement;
  const wrapper = target.closest(".inputWrapper") as HTMLElement;
  if (wrapper) {
    wrapper.classList.remove("focused");
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.keyboardClose && event.key === "Escape" && props.isOpen) {
    handleClose();
  }
};

// Watch for isOpen changes
watch(
  () => props.isOpen,
  async (newVal, oldVal) => {
    if (newVal && !oldVal) {
      await nextTick();
      emit("didOpen");
      initializeInputValues();
    } else if (!newVal && oldVal) {
      emit("didClose");
    }
  }
);

// Lifecycle
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  if (props.isOpen) {
    initializeInputValues();
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});

// Initialize on mount if already open
if (props.isOpen) {
  initializeInputValues();
}
</script>

<style module src="./BaseAlert.module.css"></style>

<style>
.alert-backdrop-enter-active,
.alert-backdrop-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.alert-backdrop-enter-from,
.alert-backdrop-leave-to {
  opacity: 0;
}

.alert-modal-enter-active,
.alert-modal-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.alert-modal-enter-from,
.alert-modal-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-30px);
}
</style>
