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
            :class="alertClasses"
            role="alertdialog"
            :aria-labelledby="headerId"
            :aria-describedby="messageId"
            @click.stop
          >
            <!-- Icon (اختیاری/ساده) -->
            <div v-if="variant !== 'default'" :class="$style.iconRow">
              <div
                :class="[$style.icon, $style[`icon--${variant}`]]"
                aria-hidden="true"
              >
                <svg
                  v-if="variant === 'success'"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else-if="variant === 'error'"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 8v5m0 3.5h.01"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
                <svg
                  v-else-if="variant === 'warning'"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 9v4m0 3h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.72 3h16.92A2 2 0 0 0 22.18 18L13.71 3.86a2 2 0 0 0-3.42 0z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else-if="variant === 'info'"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <!-- Close -->
            <button
              v-if="showCloseButton"
              :class="$style.closeButton"
              @click="handleClose"
              type="button"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6 6 18M6 6l12 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <!-- Content -->
            <div :class="$style.content">
              <div v-if="header" :class="$style.header">
                <h2 :id="headerId" :class="[$style.title , $style[`title--${variant}`]]">{{ header }}</h2>
                <div v-if="subHeader" :class="$style.subHeader">
                  {{ subHeader }}
                </div>
              </div>

              <div v-if="message" :class="$style.message">
                <p :id="messageId" v-html="message"></p>
              </div>

              <!-- Inputs -->
              <div v-if="inputs?.length" :class="$style.inputs">
                <template v-for="(input, index) in inputs" :key="index">
                  <!-- Text-like -->
                  <div
                    v-if="
                      [
                        'text',
                        'email',
                        'password',
                        'number',
                        'tel',
                        'url',
                      ].includes(input.type)
                    "
                    :class="$style.inputGroup"
                  >
                    <label
                      v-if="input.label"
                      :for="`input-${index}`"
                      :class="$style.inputLabel"
                      >{{ input.label }}</label
                    >
                    <div :class="$style.inputWrapper">
                      <input
                        :id="`input-${index}`"
                        v-model="inputValues[input.name || index]"
                        :type="input.type"
                        :placeholder="input.placeholder"
                        :disabled="input.disabled"
                        :min="input.min"
                        :max="input.max"
                        :step="input.step"
                        :class="$style.input"
                        @input="handleInputChange(input.name || index, $event)"
                      />
                      <div
                        v-if="inputErrors[input.name || index]"
                        :class="$style.inputError"
                      >
                        {{ inputErrors[input.name || index] }}
                      </div>
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
                      >{{ input.label }}</label
                    >
                    <div :class="$style.inputWrapper">
                      <textarea
                        :id="`input-${index}`"
                        v-model="inputValues[input.name || index]"
                        :placeholder="input.placeholder"
                        :disabled="input.disabled"
                        :rows="input.rows || 3"
                        :class="$style.textarea"
                        @input="handleInputChange(input.name || index, $event)"
                      />
                      <div
                        v-if="inputErrors[input.name || index]"
                        :class="$style.inputError"
                      >
                        {{ inputErrors[input.name || index] }}
                      </div>
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
                    <label
                      v-for="option in input.options"
                      :key="option.value"
                      :class="$style.radioLabel"
                    >
                      <input
                        :name="`radio-${index}`"
                        type="radio"
                        :value="option.value"
                        :checked="
                          inputValues[input.name || index] === option.value
                        "
                        :disabled="input.disabled || option.disabled"
                        :class="$style.radioInput"
                        @change="handleInputChange(input.name || index, $event)"
                      />
                      <span
                        :class="$style.radioButton"
                        aria-hidden="true"
                      ></span>
                      <span :class="$style.radioText">{{ option.text }}</span>
                    </label>
                  </div>

                  <!-- Checkbox -->
                  <div
                    v-else-if="input.type === 'checkbox'"
                    :class="$style.checkboxGroup"
                  >
                    <div v-if="input.label" :class="$style.checkboxGroupLabel">
                      {{ input.label }}
                    </div>
                    <label
                      v-for="option in input.options"
                      :key="option.value"
                      :class="$style.checkboxLabel"
                    >
                      <input
                        type="checkbox"
                        :value="option.value"
                        :checked="
                          Array.isArray(inputValues[input.name || index])
                            ? inputValues[input.name || index].includes(
                                option.value
                              )
                            : inputValues[input.name || index] === option.value
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
                      <span
                        :class="$style.checkboxButton"
                        aria-hidden="true"
                      ></span>
                      <span :class="$style.checkboxText">{{
                        option.text
                      }}</span>
                    </label>
                  </div>
                </template>
              </div>

              <!-- Buttons -->
              <div :class="$style.buttons">
                <button
                  v-for="(button, index) in computedButtons"
                  :key="index"
                  :class="[
                    $style.button,
                    $style[`button--${button.role || 'default'}`],
                  ]"
                  :disabled="button.disabled || buttonStates[index]?.loading"
                  type="button"
                  @click="handleButtonClick(button, index)"
                >
                  <span
                    v-if="buttonStates[index]?.loading"
                    :class="$style.spinner"
                    aria-hidden="true"
                  ></span>
                  <span :class="$style.buttonText">{{ button.text }}</span>
                </button>
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
import $style from "./BaseAlert.module.css";

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
  options?: Array<{ text: string; value: any; disabled?: boolean }>;
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

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  backdropDismiss: true,
  showCloseButton: false,
  keyboardClose: true,
  buttons: () => [],
  size: "medium",
  position: "center",
});

const emit = defineEmits<Emits>();

// State
const inputValues = ref<Record<string, any>>({});
const inputErrors = ref<Record<string, string>>({});
const buttonStates = ref<Record<number, { loading: boolean }>>({});
const isLoading = ref(false);

const headerId = ref(`alert-header-${Math.random().toString(36).slice(2, 9)}`);
const messageId = ref(
  `alert-message-${Math.random().toString(36).slice(2, 9)}`
);

// Computed
const computedButtons = computed(() => {
  if (props.buttons?.length) return props.buttons;
  return [
    { text: "باشه", role: "confirm" as const, handler: () => handleClose() },
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

// Validation
const validateInput = (input: AlertInput, value: any): string | null => {
  if (
    input.required &&
    (!value || (typeof value === "string" && !value.trim()))
  )
    return "این فیلد اجباری است";
  if (input.validation) {
    const { pattern, minLength, maxLength, custom } = input.validation;
    if (pattern && value && !new RegExp(pattern).test(value))
      return "فرمت وارد شده صحیح نیست";
    if (minLength && value && value.length < minLength)
      return `حداقل ${minLength} کاراکتر وارد کنید`;
    if (maxLength && value && value.length > maxLength)
      return `حداکثر ${maxLength} کاراکتر مجاز است`;
    if (custom) return custom(value);
  }
  return null;
};

const validateAllInputs = (): boolean => {
  if (!props.inputs) return true;
  let ok = true;
  const errors: Record<string, string> = {};
  props.inputs.forEach((input, index) => {
    const key = input.name || index.toString();
    const err = validateInput(input, inputValues.value[key]);
    if (err) {
      errors[key] = err;
      ok = false;
    }
  });
  inputErrors.value = errors;
  return ok;
};

const initializeInputValues = () => {
  if (!props.inputs) return;
  props.inputs.forEach((input, index) => {
    const key = input.name || index.toString();
    inputValues.value[key] =
      input.type === "checkbox" && input.options
        ? input.value || []
        : input.value ?? "";
  });
};

// Actions
const handleClose = () => {
  if (props.persistent && isLoading.value) return;
  emit("willClose");
  emit("update:isOpen", false);
};

const handleBackdropClick = () => {
  emit("backdropClick");
  if (props.backdropDismiss && !props.persistent && !isLoading.value)
    handleClose();
};

const handleButtonClick = async (button: AlertButton, index: number) => {
  if (button.disabled || buttonStates.value[index]?.loading) return;
  if (button.role === "confirm" && props.inputs?.length && !validateAllInputs())
    return;

  const data = Object.keys(inputValues.value).length
    ? { ...inputValues.value }
    : undefined;

  if (button.loading !== false) {
    buttonStates.value = { ...buttonStates.value, [index]: { loading: true } };
    isLoading.value = true;
  }
  try {
    emit("buttonClick", button, data);
    if (button.handler) {
      const res = await button.handler(data);
      if (res !== false) handleClose();
    } else {
      handleClose();
    }
  } catch (e) {
    console.error("Button handler error:", e);
  } finally {
    buttonStates.value = { ...buttonStates.value, [index]: { loading: false } };
    isLoading.value = false;
  }
};

const handleInputChange = (name: string, event: Event) => {
  const target = event.target as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;
  let value: any = target.value;
  if (target instanceof HTMLInputElement && target.type === "number")
    value = target.valueAsNumber;
  inputValues.value[name] = value;

  // live validate
  const input = props.inputs?.find(
    (inp, idx) => (inp.name || idx.toString()) === name
  );
  if (input) {
    const err = validateInput(input, value);
    if (err) inputErrors.value[name] = err;
    else delete inputErrors.value[name];
    emit("inputValidate", name, !err, err || undefined);
  }
  emit("inputChange", name, value);
};

const handleCheckboxChange = (name: string, optionValue: any, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!Array.isArray(inputValues.value[name])) inputValues.value[name] = [];
  if (target.checked) {
    if (!inputValues.value[name].includes(optionValue))
      inputValues.value[name].push(optionValue);
  } else {
    inputValues.value[name] = inputValues.value[name].filter(
      (v: any) => v !== optionValue
    );
  }
  emit("inputChange", name, inputValues.value[name]);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.keyboardClose && event.key === "Escape" && props.isOpen)
    handleClose();
};

// Watchers & lifecycle
watch(
  () => props.isOpen,
  async (n, o) => {
    if (n && !o) {
      await nextTick();
      emit("didOpen");
      initializeInputValues();
    } else if (!n && o) emit("didClose");
  }
);

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  if (props.isOpen) initializeInputValues();
});

onUnmounted(() => document.removeEventListener("keydown", handleKeydown));
</script>

<style module src="./BaseAlert.module.css"></style>

<style>
.alert-backdrop-enter-active,
.alert-backdrop-leave-active {
  transition: opacity 0.18s ease;
}
.alert-backdrop-enter-from,
.alert-backdrop-leave-to {
  opacity: 0;
}

.alert-modal-enter-active,
.alert-modal-leave-active {
  transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s ease;
}
.alert-modal-enter-from,
.alert-modal-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
</style>
