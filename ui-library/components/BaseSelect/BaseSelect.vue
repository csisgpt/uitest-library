<template>
  <div
    :class="[
      'base-select',
      `base-select--${variant}`,
      {
        'base-select--disabled': disabled,
        'base-select--invalid': invalid,
        'base-select--loading': loading,
        'base-select--open': isOpen,
        'base-select--clearable': clearable && hasValue,
        'base-select--filterable': filterable,
        'base-select--multiple': multiple,
        [`base-select--${size}`]: size,
      },
    ]"
    ref="selectRef"
  >
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="[
        'base-select__label',
        { 'base-select__label--required': required },
      ]"
    >
      {{ label }}
    </label>
    <!-- Select Container -->
    <div class="base-select__container">
      <!-- Input/Display Area -->
      <div
        class="base-select__control"
        @click="handleControlClick"
        @keydown="handleKeydown"
        :tabindex="disabled ? -1 : 0"
        :aria-expanded="isOpen"
        :aria-haspopup="'listbox'"
        :aria-describedby="helpTextId"
        :aria-invalid="invalid"
        role="combobox"
        :id="inputId"
      >
        <!-- Multiple Selection Display -->
        <div v-if="multiple" class="base-select__multi-container">
          <div
            v-for="(item, index) in selectedItems"
            :key="getOptionValue(item)"
            class="base-select__multi-item"
          >
            <span class="base-select__multi-item-label">
              {{ getOptionLabel(item) }}
            </span>
            <button
              v-if="!disabled"
              @click.stop="removeItem(index)"
              class="base-select__multi-item-remove"
              type="button"
              :aria-label="`Remove ${getOptionLabel(item)}`"
            >
              ×
            </button>
          </div>

          <!-- Filter Input for Multiple -->
          <input
            v-if="filterable"
            v-model="filterValue"
            @input="handleFilterInput"
            @keydown.stop="handleFilterKeydown"
            class="base-select__filter-input"
            :placeholder="selectedItems.length === 0 ? placeholder : ''"
            :disabled="disabled"
            ref="filterInputRef"
          />

          <!-- Placeholder for Multiple -->
          <span
            v-if="!filterable && selectedItems.length === 0"
            class="base-select__placeholder"
          >
            {{ placeholder }}
          </span>
        </div>

        <!-- Single Selection Display -->
        <div v-else class="base-select__single-container">
          <!-- Filter Input for Single -->
          <input
            v-if="filterable"
            v-model="displayValue"
            @input="handleFilterInput"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            class="base-select__filter-input base-select__filter-input--single"
            :placeholder="placeholder"
            :disabled="disabled"
            ref="filterInputRef"
          />

          <!-- Display Value for Single (non-filterable) -->
          <span v-else-if="hasValue" class="base-select__single-value">
            {{ selectedLabel }}
          </span>

          <!-- Placeholder for Single -->
          <span v-else class="base-select__placeholder">
            {{ placeholder }}
          </span>
        </div>

        <!-- Action Icons -->
        <div class="base-select__actions">
          <!-- Loading -->
          <div v-if="loading" class="base-select__loading">
            <svg class="base-select__spinner" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                opacity="0.3"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
            </svg>
          </div>

          <!-- Clear Button -->
          <button
            v-else-if="clearable && hasValue && !disabled"
            @click.stop="clearSelection"
            class="base-select__clear"
            type="button"
            :aria-label="clearLabel"
          >
            ×
          </button>

          <!-- Dropdown Arrow -->
          <div
            v-if="!loading"
            class="base-select__arrow"
            :class="{ 'base-select__arrow--open': isOpen }"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Dropdown -->
      <Teleport to="body">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="base-select__dropdown"
          :style="dropdownStyle"
        >
          <!-- Options List -->
          <div
            class="base-select__listbox"
            role="listbox"
            :aria-multiselectable="multiple"
          >
            <!-- Empty State -->
            <div v-if="filteredOptions.length === 0" class="base-select__empty">
              {{ emptyMessage }}
            </div>

            <!-- Options -->
            <div
              v-for="(option, index) in filteredOptions"
              :key="getOptionValue(option)"
              :class="[
                'base-select__option',
                {
                  'base-select__option--selected': isSelected(option),
                  'base-select__option--highlighted':
                    highlightedIndex === index,
                  'base-select__option--disabled': isOptionDisabled(option),
                },
              ]"
              @click="selectOption(option)"
              @mouseenter="highlightedIndex = index"
              role="option"
              :aria-selected="isSelected(option)"
              :aria-disabled="isOptionDisabled(option)"
            >
              <!-- Custom Option Slot -->
              <slot name="option" :option="option" :index="index">
                <span class="base-select__option-label">
                  {{ getOptionLabel(option) }}
                </span>
              </slot>

              <!-- Selection Indicator -->
              <div v-if="isSelected(option)" class="base-select__option-check">
                ✓
              </div>
            </div>
          </div>

          <!-- Footer Slot -->
          <div v-if="$slots.footer" class="base-select__footer">
            <slot name="footer" />
          </div>
        </div>
      </Teleport>
    </div>

    <!-- Help Text -->
    <div
      v-if="helpText || invalid"
      :id="helpTextId"
      :class="['base-select__help', { 'base-select__help--error': invalid }]"
    >
      {{ invalid ? errorMessage : helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import type { Ref } from "vue";

// Types
interface Option {
  [key: string]: any;
}

interface BaseSelectProps {
  // Core Props
  modelValue?: any;
  options?: Option[];
  optionLabel?: string | ((option: Option) => string);
  optionValue?: string | ((option: Option) => any);
  optionDisabled?: string | ((option: Option) => boolean);

  // Behavior
  multiple?: boolean;
  filterable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  invalid?: boolean;

  // Display
  label?: string;
  placeholder?: string;
  helpText?: string;
  errorMessage?: string;
  emptyMessage?: string;
  clearLabel?: string;

  // Styling
  variant?: "default" | "filled" | "outlined";
  size?: "small" | "medium" | "large";

  // Advanced
  filter?:
    | "contains"
    | "startsWith"
    | "endsWith"
    | ((value: string, option: Option) => boolean);
  filterPlaceholder?: string;
  maxSelectedLabels?: number;
  virtualScroll?: boolean;
  scrollHeight?: string;
}

// Props with defaults
const props = withDefaults(defineProps<BaseSelectProps>(), {
  options: () => [],
  optionLabel: "label",
  optionValue: "value",
  optionDisabled: "disabled",
  multiple: false,
  filterable: false,
  clearable: false,
  disabled: false,
  loading: false,
  required: false,
  invalid: false,
  placeholder: "انتخاب کنید...",
  emptyMessage: "نتیجه‌ای یافت نشد",
  clearLabel: "پاک کردن",
  variant: "default",
  size: "medium",
  filter: "contains",
  filterPlaceholder: "جستجو...",
  maxSelectedLabels: 3,
  scrollHeight: "200px",
});

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: any];
  change: [value: any];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  filter: [value: string];
  show: [];
  hide: [];
  clear: [];
}>();

// Refs
const selectRef: Ref<HTMLElement | null> = ref(null);
const dropdownRef: Ref<HTMLElement | null> = ref(null);
const filterInputRef: Ref<HTMLInputElement | null> = ref(null);

// State
const isOpen = ref(false);
const filterValue = ref("");
const highlightedIndex = ref(-1);
const dropdownStyle = ref({});

// Computed
const inputId = computed(
  () => `base-select-${Math.random().toString(36).substr(2, 9)}`
);
const helpTextId = computed(() => `${inputId.value}-help`);

const selectedItems = computed(() => {
  if (!props.multiple) return [];
  if (!props.modelValue) return [];
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
      .map(
        (val) => props.options.find((opt) => getOptionValue(opt) === val) || val
      )
      .filter(Boolean);
  }
  return [];
});

const hasValue = computed(() => {
  if (props.multiple) {
    return selectedItems.value.length > 0;
  }
  return (
    props.modelValue !== null &&
    props.modelValue !== undefined &&
    props.modelValue !== ""
  );
});

const selectedLabel = computed(() => {
  if (!hasValue.value) return "";
  if (props.multiple) return "";

  const selectedOption = props.options.find(
    (opt) => getOptionValue(opt) === props.modelValue
  );
  return selectedOption
    ? getOptionLabel(selectedOption)
    : String(props.modelValue);
});

const displayValue = computed({
  get() {
    if (props.filterable && isOpen.value) {
      return filterValue.value;
    }
    return selectedLabel.value;
  },
  set(value: string) {
    filterValue.value = value;
  },
});

const filteredOptions = computed(() => {
  if (!props.filterable || !filterValue.value) {
    return props.options;
  }

  const searchTerm = filterValue.value.toLowerCase();

  return props.options.filter((option) => {
    if (typeof props.filter === "function") {
      return props.filter(searchTerm, option);
    }

    const label = getOptionLabel(option).toLowerCase();

    switch (props.filter) {
      case "startsWith":
        return label.startsWith(searchTerm);
      case "endsWith":
        return label.endsWith(searchTerm);
      case "contains":
      default:
        return label.includes(searchTerm);
    }
  });
});

// Methods
const getOptionLabel = (option: Option): string => {
  if (typeof props.optionLabel === "function") {
    return props.optionLabel(option);
  }
  return option[props.optionLabel] || String(option);
};

const getOptionValue = (option: Option): any => {
  if (typeof props.optionValue === "function") {
    return props.optionValue(option);
  }
  return option[props.optionValue] !== undefined
    ? option[props.optionValue]
    : option;
};

const isOptionDisabled = (option: Option): boolean => {
  if (typeof props.optionDisabled === "function") {
    return props.optionDisabled(option);
  }
  return Boolean(option[props.optionDisabled]);
};

const isSelected = (option: Option): boolean => {
  const optionValue = getOptionValue(option);

  if (props.multiple) {
    if (!props.modelValue || !Array.isArray(props.modelValue)) return false;
    return props.modelValue.includes(optionValue);
  }

  return props.modelValue === optionValue;
};

const selectOption = (option: Option) => {
  if (isOptionDisabled(option)) return;

  const optionValue = getOptionValue(option);

  if (props.multiple) {
    const currentValue = Array.isArray(props.modelValue)
      ? [...props.modelValue]
      : [];
    const index = currentValue.indexOf(optionValue);

    if (index > -1) {
      currentValue.splice(index, 1);
    } else {
      currentValue.push(optionValue);
    }

    emit("update:modelValue", currentValue);
    emit("change", currentValue);
  } else {
    emit("update:modelValue", optionValue);
    emit("change", optionValue);
    closeDropdown();
  }
};

const removeItem = (index: number) => {
  if (!props.multiple || !Array.isArray(props.modelValue)) return;

  const newValue = [...props.modelValue];
  newValue.splice(index, 1);

  emit("update:modelValue", newValue);
  emit("change", newValue);
};

const clearSelection = () => {
  const newValue = props.multiple ? [] : null;
  emit("update:modelValue", newValue);
  emit("change", newValue);
  emit("clear");

  if (props.filterable) {
    filterValue.value = "";
  }
};

const openDropdown = () => {
  if (props.disabled || isOpen.value) return;

  isOpen.value = true;
  highlightedIndex.value = -1;

  if (props.filterable) {
    nextTick(() => {
      filterInputRef.value?.focus();
    });
  }

  nextTick(() => {
    updateDropdownPosition();
  });

  emit("show");
};

const closeDropdown = () => {
  if (!isOpen.value) return;

  isOpen.value = false;
  highlightedIndex.value = -1;

  if (props.filterable && !props.multiple) {
    filterValue.value = "";
  }

  emit("hide");
};

const handleControlClick = () => {
  if (props.disabled) return;

  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

const handleFilterInput = () => {
  if (!isOpen.value) {
    openDropdown();
  }
  emit("filter", filterValue.value);
};

const handleInputFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleInputBlur = (event: FocusEvent) => {
  emit("blur", event);
};

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (isOpen.value) {
        highlightNext();
      } else {
        openDropdown();
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (isOpen.value) {
        highlightPrevious();
      }
      break;

    case "Enter":
      event.preventDefault();
      if (isOpen.value && highlightedIndex.value >= 0) {
        selectOption(filteredOptions.value[highlightedIndex.value]);
        filterValue.value = "";
        displayValue.value = "";
      } else {
        openDropdown();
      }
      break;

    case "Escape":
      event.preventDefault();
      closeDropdown();
      break;

    case " ":
      if (!props.filterable) {
        event.preventDefault();
        if (isOpen.value) {
          if (highlightedIndex.value >= 0) {
            selectOption(filteredOptions.value[highlightedIndex.value]);
          }
        } else {
          openDropdown();
        }
      }
      break;
  }
};

const handleFilterKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      highlightNext();
      break;

    case "ArrowUp":
      event.preventDefault();
      highlightPrevious();
      break;

    case "Enter":
      event.preventDefault();
      if (highlightedIndex.value >= 0) {
        selectOption(filteredOptions.value[highlightedIndex.value]);
        filterValue.value = "";
        displayValue.value = "";
      }
      break;

    case "Escape":
      event.preventDefault();
      closeDropdown();
      break;
  }
};

const highlightNext = () => {
  if (filteredOptions.value.length === 0) return;

  highlightedIndex.value =
    highlightedIndex.value < filteredOptions.value.length - 1
      ? highlightedIndex.value + 1
      : 0;
};

const highlightPrevious = () => {
  if (filteredOptions.value.length === 0) return;

  highlightedIndex.value =
    highlightedIndex.value > 0
      ? highlightedIndex.value - 1
      : filteredOptions.value.length - 1;
};

const updateDropdownPosition = () => {
  if (!selectRef.value || !dropdownRef.value) return;

  const selectRect = selectRef.value.getBoundingClientRect();
  const dropdownRect = dropdownRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const spaceBelow = viewportHeight - selectRect.bottom;
  const spaceAbove = selectRect.top;

  let top = selectRect.bottom + window.scrollY;

  // If not enough space below and more space above, show above
  if (spaceBelow < dropdownRect.height && spaceAbove > spaceBelow) {
    top = selectRect.top + window.scrollY - dropdownRect.height;
  }

  dropdownStyle.value = {
    position: "absolute",
    top: `${top}px`,
    left: `${selectRect.left - 10}px`,
    width: `${selectRect.width}px`,
    maxHeight: props.scrollHeight,
    zIndex: "var(--z-index-dropdown)",
  };
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value &&
    selectRef.value &&
    !selectRef.value.contains(event.target as Node) &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    closeDropdown();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", updateDropdownPosition);
  window.addEventListener("scroll", updateDropdownPosition);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", updateDropdownPosition);
  window.removeEventListener("scroll", updateDropdownPosition);
});

// Watchers
watch(isOpen, (newValue) => {
  if (newValue) {
    nextTick(updateDropdownPosition);
  }
});

watch(
  () => props.options,
  () => {
    highlightedIndex.value = -1;
  }
);
</script>

<style>
@import "./BaseSelect.module.css";
</style>
