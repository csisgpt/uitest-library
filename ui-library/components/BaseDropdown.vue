<script setup lang="ts">
import {
  ref,
  computed,
  defineEmits,
  onBeforeUnmount,
  onMounted,
  watch,
  withDefaults,
  defineProps,
} from "vue";
import styles from "./BaseDropdown.module.css";

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | any[] | null;
    items?: any[];
    options?: any[];
    url?: string;
    multiple?: boolean;
    clearable?: boolean;
    label?: string;
    placeholder?: string;
    variant?:
      | "primary"
      | "secondary"
      | "outline"
      | "ghost"
      | "error"
      | "success"
      | "warning"
      | "info";
    size?: "sm" | "md" | "lg";
    block?: boolean;
    rounded?: boolean;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    iconLeft?: string;
    iconRight?: string;
    errorMessage?: string;
    successMessage?: string;
    hint?: string;
    itemTitle?: string;
    itemValue?: string;
    name?: string;
    autocomplete?: string;
    id?: string;
    searchPlaceholder?: string;
  }>(),
  {
    items: () => [],
    options: undefined,
    url: undefined,
    multiple: false,
    clearable: false,
    label: "",
    placeholder: "انتخاب کنید.",
    variant: "primary",
    size: "md",
    block: false,
    rounded: false,
    fullWidth: false,
    loading: false,
    disabled: false,
    readonly: false,
    iconLeft: "",
    iconRight: "",
    errorMessage: "",
    successMessage: "",
    hint: "",
    itemTitle: "title",
    itemValue: "value",
    name: "",
    autocomplete: "",
    id: "",
    searchPlaceholder: "جستجو...",
  }
);

const emit = defineEmits(["update:modelValue"]);
const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const search = ref("");
const focusedIndex = ref(-1);
const searchBox = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const fetchedOptions = ref<any[]>([]);

const optionsList = computed(() =>
  props.url ? fetchedOptions.value : props.options ?? props.items
);

function isObject(option: any): option is Record<string, any> {
  return typeof option === "object" && option !== null;
}
function getItemText(option: any): string {
  return isObject(option) ? String(option[props.itemTitle]) : String(option);
}
function getItemValue(option: any): any {
  return isObject(option) ? option[props.itemValue] : option;
}

const hasValue = computed(() =>
  props.multiple
    ? Array.isArray(props.modelValue) && props.modelValue.length > 0
    : props.modelValue !== null && props.modelValue !== undefined
);

const selectedOptions = computed(() => {
  if (props.multiple) {
    const vals = Array.isArray(props.modelValue) ? props.modelValue : [];
    return optionsList.value.filter((opt) => vals.includes(getItemValue(opt)));
  }
  const found = optionsList.value.find(
    (opt) => getItemValue(opt) === props.modelValue
  );
  return found ? [found] : [];
});

const selectedLabel = computed(() => {
  if (!props.multiple && props.modelValue != null) {
    const sel = optionsList.value.find(
      (opt) => getItemValue(opt) === props.modelValue
    );
    return sel ? getItemText(sel) : "";
  }
  return "";
});

const filteredOptions = computed(() => {
  const term = search.value.toLowerCase();
  return optionsList.value.filter((opt) =>
    getItemText(opt).toLowerCase().includes(term)
  );
});

function toggleDropdown() {
  if (!props.disabled && !props.readonly && !props.loading)
    isOpen.value = !isOpen.value;
  if (!isOpen.value) search.value = "";
}
function clearSelection() {
  emit("update:modelValue", props.multiple ? [] : null);
  search.value = "";
}
function selectOption(option: any) {
  const val = getItemValue(option);
  if (props.multiple) {
    const arr = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = arr.indexOf(val);
    index > -1 ? arr.splice(index, 1) : arr.push(val);
    emit("update:modelValue", arr);
  } else {
    emit("update:modelValue", val);
    isOpen.value = false;
    search.value = "";
  }
}
function isSelected(option: any): boolean {
  return props.multiple
    ? Array.isArray(props.modelValue) &&
        props.modelValue.includes(getItemValue(option))
    : getItemValue(option) === props.modelValue;
}
function handleClickOutside(e: MouseEvent) {
  if (rootRef.value && !e.composedPath().includes(rootRef.value)) {
    isOpen.value = false;
    search.value = "";
  }
}
function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (focusedIndex.value < filteredOptions.value.length - 1)
      focusedIndex.value++;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (focusedIndex.value > 0) focusedIndex.value--;
  } else if (e.key === "Enter") {
    e.preventDefault();
    const opt = filteredOptions.value[focusedIndex.value];
    if (opt) selectOption(opt);
  } else if (e.key === "Escape") {
    isOpen.value = false;
    search.value = "";
  }
}
function removeOption(option: any) {
  const val = getItemValue(option);
  const arr = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  const index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
    emit("update:modelValue", arr);
  }
}

watch(isOpen, (v) => {
  if (v) {
    setTimeout(() => {
      searchBox.value?.focus();
      focusedIndex.value = 0;
    }, 1);
  }
});

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      styles.dropdownRoot,
      styles[`size-${size}`],
      block && styles.block,
      rounded && styles.rounded,
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      disabled && styles.disabled,
      readonly && styles.readonly,
    ]"
    v-bind="$attrs"
  >
    <label v-if="label" :class="styles.dropdownLabel">{{ label }}</label>
    <div
      :class="[styles.dropdownTrigger, styles[`variant-${variant}`]]"
      @click="toggleDropdown"
      tabindex="0"
      @keydown="handleKeydown"
    >
      <!-- Optional left icon -->
      <span v-if="iconLeft" :class="styles.iconLeft">
        <i :class="iconLeft"></i>
      </span>
      <!-- Multiple tags -->
      <template v-if="multiple">
        <template v-if="selectedOptions.length">
          <span
            v-for="option in selectedOptions"
            :key="getItemValue(option)"
            :class="styles.dropdownTag"
          >
            {{ getItemText(option) }}
            <button
              :class="styles.dropdownTagRemove"
              @click.stop="removeOption(option)"
            >
              &times;
            </button>
          </span>
        </template>
        <span v-else :class="styles.dropdownPlaceholder">{{
          placeholder
        }}</span>
      </template>
      <!-- Label for single -->
      <template v-else>
        <span :class="styles.dropdownSelectedLabel">
          {{ selectedLabel || placeholder }}
        </span>
      </template>
      <!-- Optional right icon -->
      <span v-if="iconRight" :class="styles.iconRight">
        <i :class="iconRight"></i>
      </span>
      <div :class="styles.dropdownIcons">
        <button
          v-if="clearable && hasValue"
          @click.stop="clearSelection"
          :class="styles.dropdownClear"
        >
          ×
        </button>
        <span :class="styles.dropdownArrow">▼</span>
      </div>
    </div>
    <transition name="fade">
      <div v-show="isOpen" :class="styles.dropdownMenu">
        <div :class="styles.dropdownSearch">
          <input
            @keydown="handleKeydown"
            v-model="search"
            ref="searchBox"
            type="text"
            :placeholder="searchPlaceholder"
            :class="styles.dropdownSearchInput"
            :readonly="readonly"
            :disabled="disabled"
          />
        </div>
        <ul :class="styles.dropdownOptions">
          <li
            v-for="(option, index) in filteredOptions"
            :key="getItemValue(option)"
            @click.stop="selectOption(option)"
            :class="[
              styles.dropdownOption,
              isSelected(option) && styles.dropdownOptionSelected,
              focusedIndex === index && styles.dropdownOptionFocused,
            ]"
          >
            <slot name="option" :option="option">
              <span>{{ getItemText(option) }}</span>
            </slot>
            <span v-if="isSelected(option)" :class="styles.dropdownCheck"
              >✓</span
            >
          </li>
          <li
            v-if="!filteredOptions.length && !loading && !error"
            :class="styles.dropdownNoOptions"
          >
            گزینه‌ای پیدا نشد
          </li>
        </ul>
      </div>
    </transition>
    <!-- Feedback & hint -->
    <div v-if="errorMessage" :class="styles.dropdownErrorMessage">
      {{ errorMessage }}
    </div>
    <div v-else-if="successMessage" :class="styles.dropdownSuccessMessage">
      {{ successMessage }}
    </div>
    <div v-else-if="hint" :class="styles.dropdownHint">{{ hint }}</div>
  </div>
</template>

<style module src="./BaseDropdown.module.css"></style>
