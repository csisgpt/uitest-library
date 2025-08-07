<template>
  <div :class="[styles.collapseWrapper, isOpen && styles.isOpen, disabled && styles.isDisabled]">
    <div
      :class="styles.collapseHeader"
      role="button"
      :aria-expanded="isOpen"
      :aria-controls="contentId"
      tabindex="0"
      @click="onHeaderClick"
      @keydown="onKeydown"
    >
      <slot name="header">
        <span v-if="icon" :class="styles.collapseIcon">
          <i v-if="isIconString" :class="iconString" />
          <component v-else :is="iconVNode" />
        </span>
        <span>{{ title }}</span>
      </slot>
      <span v-if="showArrow" :class="styles.collapseIcon" :data-open="isOpen">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </span>
    </div>
    <Transition
      :name="transitionName"
      :css="transitionName !== ''"
      v-on="collapseTransition"
    >
      <div
        v-if="hasRendered"
        v-show="isOpen"
        :id="contentId"
        :class="styles.collapseContent"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  withDefaults,
  defineProps,
  defineEmits,
  VNode,
  PropType,
  defineComponent,
  h,
  getCurrentInstance,
} from 'vue';
import styles from './BaseCollapse.module.css';

type TransitionType = 'collapse' | 'fade' | 'slide-down' | 'none';

const props = withDefaults(
  defineProps<{
    title?: string | VNode;
    modelValue?: boolean;
    disabled?: boolean;
    transition?: TransitionType;
    icon?: string | VNode;
    showArrow?: boolean;
    lazy?: boolean;
    toggleOnHeaderClick?: boolean;
  }>(),
  {
    modelValue: false,
    disabled: false,
    transition: 'collapse',
    icon: undefined,
    showArrow: true,
    lazy: false,
    toggleOnHeaderClick: true,
  }
);

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const isOpen = ref<boolean>(props.modelValue);
watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) isOpen.value = val;
  }
);
watch(isOpen, (val) => emit('update:modelValue', val));

const hasRendered = ref(!props.lazy || isOpen.value);
watch(isOpen, (val) => {
  if (val) hasRendered.value = true;
});

const contentId = `collapse-content-${Math.random().toString(36).slice(2, 9)}`;

const transitionName = computed(() => {
  switch (props.transition) {
    case 'fade':
      return 'fade';
    case 'slide-down':
      return 'slide-bottom';
    case 'none':
      return '';
    default:
      return 'collapse';
  }
});

function onHeaderClick() {
  if (props.disabled || !props.toggleOnHeaderClick) return;
  isOpen.value = !isOpen.value;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (!props.disabled) isOpen.value = !isOpen.value;
  }
}

const isIconString = computed(() => typeof props.icon === 'string');
const iconString = computed(() =>
  isIconString.value ? (props.icon as string) : ''
);
const iconVNode = computed(() =>
  isIconString.value || !props.icon ? null : (props.icon as VNode)
);

const isCollapse = computed(() => transitionName.value === 'collapse');

function setMaxHeight(el: HTMLElement) {
  el.style.setProperty('--collapse-max-height', `${el.scrollHeight}px`);
}

const collapseTransition = {
  onBeforeEnter: (el: Element) => {
    if (isCollapse.value) setMaxHeight(el as HTMLElement);
  },
  onBeforeLeave: (el: Element) => {
    if (isCollapse.value) setMaxHeight(el as HTMLElement);
  },
  onAfterEnter: (el: Element) => {
    if (isCollapse.value) (el as HTMLElement).style.removeProperty('--collapse-max-height');
  },
  onAfterLeave: (el: Element) => {
    if (isCollapse.value) (el as HTMLElement).style.removeProperty('--collapse-max-height');
  },
};

// Group component
const self = getCurrentInstance();
const BaseCollapseComponent = self!.type as any;

export const BaseCollapseGroup = defineComponent({
  name: 'BaseCollapseGroup',
  props: {
    modelValue: {
      type: Array as PropType<string[]>,
      default: undefined,
    },
    accordion: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array as PropType<Array<{
        key: string;
        title: string | VNode;
        content?: VNode | string;
        disabled?: boolean;
        icon?: string | VNode;
      }>>,
      default: () => [],
    },
    transition: {
      type: String as PropType<TransitionType>,
      default: 'collapse',
    },
  },
  emits: ['update:modelValue'],
  setup(groupProps, { emit, slots }) {
    const openKeys = ref<string[]>(groupProps.modelValue ? [...groupProps.modelValue] : []);

    watch(
      () => groupProps.modelValue,
      (val) => {
        openKeys.value = val ? [...val] : [];
      }
    );

    function update(keys: string[]) {
      openKeys.value = keys;
      emit('update:modelValue', keys);
    }

    function toggle(key: string, val: boolean) {
      let keys = [...openKeys.value];
      if (groupProps.accordion) {
        keys = val ? [key] : [];
      } else {
        const idx = keys.indexOf(key);
        if (val) {
          if (idx === -1) keys.push(key);
        } else if (idx !== -1) {
          keys.splice(idx, 1);
        }
      }
      update(keys);
    }

    return () =>
      h('div', {},
        groupProps.items.map((item) => {
          const contentSlot = slots[`item-${item.key}`];
          const iconSlot = slots[`icon-${item.key}`];
          const iconVNode = iconSlot ? iconSlot()[0] : item.icon;
          return h(
            BaseCollapseComponent,
            {
              key: item.key,
              title: item.title,
              icon: iconVNode as any,
              modelValue: openKeys.value.includes(item.key),
              transition: groupProps.transition,
              disabled: item.disabled,
              onUpdate:modelValue: (val: boolean) => toggle(item.key, val),
            },
            contentSlot
              ? { default: () => contentSlot() }
              : item.content
              ? { default: () => item.content as any }
              : undefined
          );
        })
      );
  },
});
</script>

<style module src="./BaseCollapse.module.css"></style>
