<template>
  <div
    :class="rootClasses"
    :style="cssVars"
    :data-readonly="props.readonly || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <!-- Header (اختیاری / غیرخطی) -->
    <div
      v-if="props.headerNavigation && !props.linear"
      :class="$style.stepperHeader"
      role="tablist"
      :aria-label="props.headerLabel"
      aria-orientation="horizontal"
      @keydown="onHeaderKeydown"
    >
      <div
        v-for="(step, index) in props.steps"
        :key="`hdr-${index}`"
        :class="$style.headerItem"
      >
        <button
          :id="hdrId(index)"
          ref="headerButtons"
          :class="getHeaderStepClasses(index)"
          :aria-current="index === activeStep ? 'step' : undefined"
          :aria-selected="index === activeStep"
          :aria-controls="panelId(index)"
          :tabindex="getTabIndex(index)"
          :disabled="!canNavigateToStep(index)"
          role="tab"
          @click="navigateToStep(index)"
        >
          <span :class="$style.headerStepIcon" aria-hidden="true">
            <Icon
              v-if="getStepIcon(index)"
              :name="getStepIcon(index)!"
              :size="props.iconSize"
            />
            <span v-else>{{ index + 1 }}</span>
          </span>
          <span v-if="step.label" :class="$style.headerStepLabel">{{
            step.label
          }}</span>
          <span v-if="step.optional" class="visually-hidden"> (اختیاری)</span>
        </button>

        <!-- Connector بین این Step و بعدی -->
        <span
          v-if="props.headerConnectors && index < props.steps.length - 1"
          :class="getHeaderConnectorClasses(index)"
          aria-hidden="true"
        />
      </div>
    </div>

    <!-- Content -->
    <div :class="$style.stepperContent">
      <div :class="$style.stepsContainer" :style="trackTransform">
        <div
          v-for="(step, index) in props.steps"
          :key="`p-${index}`"
          :id="panelId(index)"
          role="tabpanel"
          :aria-labelledby="hdrId(index)"
          :aria-hidden="index !== activeStep"
          :class="getStepPanelClasses(index)"
        >
          <div :class="$style.stepContent">
            <!-- عنوان درون پنل (اختیاری) -->
            <div v-if="props.showStepHeaders" :class="$style.stepHeader">
              <div :class="$style.stepIndicator">
                <div :class="getStepIconContainerClasses(index)">
                  <Icon
                    v-if="getStepIcon(index)"
                    :name="getStepIcon(index)!"
                    :size="props.iconSize"
                  />
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div
                  v-if="index < props.steps.length - 1"
                  :class="getVerticalConnectorClasses(index)"
                  aria-hidden="true"
                />
              </div>
              <div :class="$style.stepInfo">
                <h3 v-if="step.label" :class="$style.stepTitle">
                  {{ step.label }}
                </h3>
                <p v-if="step.description" :class="$style.stepDescription">
                  {{ step.description }}
                </p>
              </div>
            </div>

            <!-- بدنه مرحله -->
            <div :class="$style.stepBody">
              <slot
                :name="`step-${index}`"
                :step="step"
                :index="index"
                :isActive="index === activeStep"
                :isCompleted="isStepCompleted(index)"
                :isDisabled="isStepDisabled(index)"
              >
                <div :class="$style.defaultStepContent">
                  <h4 v-if="step.label">{{ step.label }}</h4>
                  <p v-if="step.description">{{ step.description }}</p>
                  <p v-else>محتوای مرحله {{ index + 1 }}</p>
                </div>
              </slot>
            </div>
          </div>
        </div>
      </div>

      <!-- کنترل‌ها -->
      <div v-if="props.showControls" :class="$style.stepperControls">
        <button
          :class="$style.controlButton"
          :disabled="!canGoBack"
          @click="goBack"
          :aria-label="props.backLabel"
        >
          <Icon
            name="chevron-right"
            :size="16"
            style="transform: rotate(180deg)"
          />
          {{ props.backLabel }}
        </button>

        <div :class="$style.controlsCenter">
          <div v-if="props.showIndicators" :class="$style.stepIndicators">
            <button
              v-for="(step, index) in props.steps"
              :key="`dot-${index}`"
              :class="getIndicatorClasses(index)"
              :aria-label="`برو به مرحله ${index + 1}: ${step.label || ''}`"
              :aria-current="index === activeStep ? 'step' : undefined"
              @click="navigateToStep(index)"
              :disabled="!canNavigateToStep(index)"
            />
          </div>
        </div>

        <button
          v-if="!isLastStep"
          :class="[$style.controlButton, $style.primaryButton]"
          :disabled="!canGoNext"
          @click="goNext"
          :aria-label="props.nextLabel"
        >
          {{ props.nextLabel }}
          <Icon name="chevron-right" :size="16" />
        </button>

        <button
          v-else
          :class="[$style.controlButton, $style.primaryButton]"
          :disabled="!canFinish"
          @click="finish"
          :aria-label="props.finishLabel"
        >
          {{ props.finishLabel }}
          <Icon name="check" :size="16" />
        </button>
      </div>
    </div>

    <!-- Progress -->
    <div
      v-if="props.showProgressBar"
      :class="$style.progressContainer"
      aria-hidden="true"
    >
      <div
        :class="$style.progressBar"
        :style="{ inlineSize: `${progressPercentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  nextTick,
  defineComponent,
  h,
  onMounted,
} from "vue";
import $style from "./BaseStepper.module.css";

/** Demo Icon component (در کتابخونه خودتون با آیکن واقعی جایگزین کنید) */
interface IconProps {
  name: string;
  size?: number;
}
const Icon = defineComponent({
  props: { name: String, size: { type: Number, default: 24 } },
  setup(props: IconProps) {
    const iconMap: Record<string, string> = {
      check: "✓",
      "chevron-right": "›",
      close: "✕",
      edit: "✎",
      warning: "⚠",
      info: "ℹ",
      user: "👤",
      settings: "⚙",
      home: "🏠",
    };
    return () =>
      h(
        "span",
        { style: { fontSize: `${props.size}px`, display: "inline-block" } },
        iconMap[props.name] || props.name
      );
  },
});

export interface StepItem {
  label?: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  completed?: boolean;
  error?: boolean;
  optional?: boolean;
}
export interface StepperProps {
  steps: StepItem[];
  modelValue?: number;
  linear?: boolean;
  variant?: "horizontal" | "vertical";
  size?: "small" | "medium" | "large";
  showControls?: boolean;
  showIndicators?: boolean;
  showProgressBar?: boolean;
  showStepHeaders?: boolean;
  headerNavigation?: boolean;
  headerLabel?: string;
  headerConnectors?: boolean;
  allowStepValidation?: boolean;
  iconSize?: number;
  nextLabel?: string;
  backLabel?: string;
  finishLabel?: string;
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<StepperProps>(), {
  modelValue: 0,
  linear: true,
  variant: "horizontal",
  size: "medium",
  showControls: true,
  showIndicators: true,
  showProgressBar: false,
  showStepHeaders: true,
  headerNavigation: false,
  headerLabel: "مراحل پیشرفت",
  headerConnectors: false,
  allowStepValidation: true,
  iconSize: 16,
  nextLabel: "بعدی",
  backLabel: "قبلی",
  finishLabel: "تمام",
  readonly: false,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
  "step-change": [payload: { from: number; to: number; step: StepItem }];
  "before-step-change": [payload: { from: number; to: number; step: StepItem }];
  "step-complete": [payload: { index: number; step: StepItem }];
  finish: [payload: { completedSteps: number[] }];
  back: [payload: { from: number; to: number }];
  next: [payload: { from: number; to: number }];
}>();

/* ---------- State ---------- */
const activeStep = ref(props.modelValue);
const completed = ref<Set<number>>(new Set());

/* ---------- Refs (for roving tabindex) ---------- */
const headerButtons = ref<HTMLButtonElement[] | null>(null);

/* ---------- Computed ---------- */
const rootClasses = computed(() => [
  $style.stepper,
  $style[`stepper--${props.variant}`],
  $style[`stepper--${props.size}`],
  {
    [$style["stepper--linear"]]: props.linear,
    [$style["stepper--readonly"]]: props.readonly,
    [$style["stepper--disabled"]]: props.disabled,
    [$style["stepper--with-header"]]: props.headerNavigation,
    [$style["stepper--header-connected"]]: props.headerConnectors,
  },
]);

const cssVars = computed(() => ({
  "--stepper-icon-size": `${props.iconSize}px`,
}));

const isLastStep = computed(() => activeStep.value === props.steps.length - 1);
const isFirstStep = computed(() => activeStep.value === 0);

const progressPercentage = computed(() => {
  if (props.steps.length <= 1) return 100;
  return Math.round((activeStep.value / (props.steps.length - 1)) * 100);
});

const canGoBack = computed(
  () => !props.readonly && !props.disabled && !isFirstStep.value
);

const canGoNext = computed(() => {
  if (props.readonly || props.disabled || isLastStep.value) return false;
  if (props.allowStepValidation && !isStepCompleted(activeStep.value))
    return false;
  return true;
});
const canFinish = computed(() => {
  if (props.readonly || props.disabled) return false;
  if (props.linear) {
    return props.steps.every((_, i) =>
      i <= activeStep.value ? isStepCompleted(i) : true
    );
  }
  return true;
});

const trackTransform = computed(() =>
  props.variant === "vertical"
    ? { transform: `translateY(-${activeStep.value * 100}%)` }
    : { transform: `translateX(-${activeStep.value * 100}%)` }
);

/* ---------- Helpers ---------- */
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

const isStepCompleted = (i: number) =>
  !!props.steps[i]?.completed || completed.value.has(i);
const isStepDisabled = (i: number) =>
  !!props.steps[i]?.disabled ||
  props.disabled ||
  (props.linear && i > activeStep.value + 1);

const canNavigateToStep = (i: number) => {
  if (props.readonly || isStepDisabled(i)) return false;
  if (!props.linear) return true;
  return (
    i <= activeStep.value ||
    (i === activeStep.value + 1 &&
      (isStepCompleted(activeStep.value) || !props.allowStepValidation))
  );
};

const getStepIcon = (i: number) =>
  props.steps[i]?.error
    ? "warning"
    : isStepCompleted(i)
    ? "check"
    : props.steps[i]?.icon;

const hdrId = (i: number) => `step-hdr-${i}`;
const panelId = (i: number) => `step-panel-${i}`;

const getTabIndex = (i: number) => (i === activeStep.value ? 0 : -1);

/* کلاس‌های Header Connector بین i و i+1 */
const getHeaderConnectorClasses = (i: number) => [
  $style.headerConnector,
  {
    [$style["headerConnector--active"]]: i < activeStep.value,
    [$style["headerConnector--completed"]]:
      isStepCompleted(i) && isStepCompleted(i + 1),
    [$style["headerConnector--past"]]:
      i < activeStep.value && !isStepCompleted(i + 1),
    [$style["headerConnector--error"]]: !!(
      props.steps[i]?.error || props.steps[i + 1]?.error
    ),
    [$style["headerConnector--disabled"]]: isStepDisabled(i + 1),
  },
];

const getHeaderStepClasses = (i: number) => [
  $style.headerStep,
  {
    [$style["headerStep--active"]]: i === activeStep.value,
    [$style["headerStep--completed"]]: isStepCompleted(i),
    [$style["headerStep--past"]]: i < activeStep.value && !isStepCompleted(i), // 👈 past جدا از completed
    [$style["headerStep--disabled"]]: isStepDisabled(i),
    [$style["headerStep--error"]]: props.steps[i]?.error,
    [$style["headerStep--optional"]]: props.steps[i]?.optional,
  },
];

const getStepPanelClasses = (i: number) => [
  $style.stepPanel,
  {
    [$style["stepPanel--active"]]: i === activeStep.value,
    [$style["stepPanel--completed"]]: isStepCompleted(i),
    [$style["stepPanel--error"]]: props.steps[i]?.error,
  },
];

const getStepIconContainerClasses = (i: number) => [
  $style.stepIconContainer,
  {
    [$style["stepIconContainer--active"]]: i === activeStep.value,
    [$style["stepIconContainer--completed"]]: isStepCompleted(i),
    [$style["stepIconContainer--past"]]:
      i < activeStep.value && !isStepCompleted(i),
    [$style["stepIconContainer--disabled"]]: isStepDisabled(i),
    [$style["stepIconContainer--error"]]: props.steps[i]?.error,
    [$style["stepIconContainer--optional"]]: props.steps[i]?.optional,
  },
];

const getVerticalConnectorClasses = (i: number) => [
  $style.stepConnector,
  {
    [$style["stepConnector--completed"]]: isStepCompleted(i),
    [$style["stepConnector--active"]]: i < activeStep.value,
    [$style["stepConnector--past"]]:
      i < activeStep.value && !isStepCompleted(i),
  },
];

const getIndicatorClasses = (i: number) => [
  $style.stepIndicatorDot,
  {
    [$style["stepIndicatorDot--active"]]: i === activeStep.value,
    [$style["stepIndicatorDot--completed"]]: isStepCompleted(i),
    [$style["stepIndicatorDot--past"]]:
      i < activeStep.value && !isStepCompleted(i),
    [$style["stepIndicatorDot--disabled"]]: isStepDisabled(i),
  },
];

/* ---------- Navigation ---------- */
const navigateToStep = async (i: number) => {
  if (!canNavigateToStep(i) || i === activeStep.value) return;
  const from = activeStep.value,
    to = i,
    stepData = props.steps[i];
  emit("before-step-change", { from, to, step: stepData });
  await nextTick();
  activeStep.value = i;
  emit("update:modelValue", i);
  emit("step-change", { from, to, step: stepData });
};

const goNext = async () => {
  if (!canGoNext.value) return;
  const from = activeStep.value,
    to = activeStep.value + 1;
  if (props.allowStepValidation) {
    completed.value.add(activeStep.value);
    emit("step-complete", {
      index: activeStep.value,
      step: props.steps[activeStep.value],
    });
  }
  await navigateToStep(to);
  emit("next", { from, to });
};

const goBack = async () => {
  if (!canGoBack.value) return;
  const from = activeStep.value,
    to = activeStep.value - 1;
  await navigateToStep(to);
  emit("back", { from, to });
};

const finish = () => {
  if (!canFinish.value) return;
  props.steps.forEach((_, i) => completed.value.add(i));
  emit("finish", { completedSteps: Array.from(completed.value) });
};

/* ---------- Keyboard (Header Roving Tabindex) ---------- */
const onHeaderKeydown = (e: KeyboardEvent) => {
  const dir = (document?.dir || "rtl").toLowerCase();
  const isRTL = dir === "rtl";
  const count = props.steps.length;
  const key = e.key;
  let next = activeStep.value;

  if (key === "ArrowRight")
    next = isRTL
      ? clamp(activeStep.value - 1, 0, count - 1)
      : clamp(activeStep.value + 1, 0, count - 1);
  else if (key === "ArrowLeft")
    next = isRTL
      ? clamp(activeStep.value + 1, 0, count - 1)
      : clamp(activeStep.value - 1, 0, count - 1);
  else if (key === "Home") next = 0;
  else if (key === "End") next = count - 1;
  else if (key === "Enter" || key === " ") {
    navigateToStep(activeStep.value);
    e.preventDefault();
    return;
  } else return;

  e.preventDefault();
  if (canNavigateToStep(next)) {
    activeStep.value = next;
    emit("update:modelValue", next);
    (document.getElementById(hdrId(next)) as HTMLButtonElement | null)?.focus();
  }
};

/* ---------- Watchers ---------- */
watch(
  () => props.modelValue,
  (v) => {
    const max = Math.max(0, props.steps.length - 1);
    const nv = clamp(v ?? 0, 0, max);
    if (nv !== activeStep.value) activeStep.value = nv;
  }
);
watch(
  () => props.steps,
  (ns) => {
    ns.forEach((s, i) => {
      if (s.completed) completed.value.add(i);
    });
  },
  { immediate: true }
);

/* ---------- Expose ---------- */
defineExpose({
  goNext,
  goBack,
  navigateToStep,
  finish,
  markStepCompleted: (i: number) => completed.value.add(i),
  markStepIncomplete: (i: number) => completed.value.delete(i),
  resetStepper: () => {
    activeStep.value = 0;
    completed.value.clear();
    emit("update:modelValue", 0);
  },
});

/* SSR-safe: فوکوس بعد از mount */
onMounted(() => {
  if (props.headerNavigation && !props.linear) {
    (
      document.getElementById(
        hdrId(activeStep.value)
      ) as HTMLButtonElement | null
    )?.setAttribute("tabindex", "0");
  }
});
</script>

<style module src="./BaseStepper.module.css"></style>
