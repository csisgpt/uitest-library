<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import BaseButton from '../BaseButton/BaseButton.vue'
import styles from './BaseSplitButton.module.css'

// از API دکمه شما استفاده می‌کنیم:
type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link' | 'text'
type ButtonTone = 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'neutral'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface SplitItem {
  label?: string
  icon?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  command?: (payload: { originalEvent: MouseEvent | KeyboardEvent, item: SplitItem, index: number }) => void
  // هر فیلد دیگری که بخواهید...
}

const props = withDefaults(defineProps<{
  label?: string
  icon?: string
  items?: SplitItem[]
  disabled?: boolean
  loading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
  tone?: ButtonTone
  placement?: 'auto' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  matchTriggerWidth?: boolean
  menuAriaLabel?: string
}>(), {
  items: () => [],
  disabled: false,
  loading: false,
  size: 'md',
  variant: 'solid',
  tone: 'primary',
  placement: 'auto',
  matchTriggerWidth: true,
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'select', payload: { item: SplitItem, index: number, originalEvent: MouseEvent | KeyboardEvent }): void
}>()

const root = ref<HTMLElement | null>(null)
const toggleBtn = ref<InstanceType<typeof BaseButton> | null>(null)
const menuEl = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const focusedIndex = ref(-1)
const itemEls = ref<HTMLElement[]>([])
const menuId = `sb-menu-${Math.random().toString(36).slice(2)}`

const computedLabel = computed(() => props.label ?? 'Action')
const canOpen = computed(() => !props.disabled && !props.loading)

function onMainClick(e: MouseEvent) {
  if (!canOpen.value) return
  emit('click', e)
}

function open() {
  if (!canOpen.value) return
  isOpen.value = true
  emit('open')
  nextTick(() => {
    positionMenu()
    focusNext()
  })
}
function close() {
  if (!isOpen.value) return
  isOpen.value = false
  focusedIndex.value = -1
  emit('close')
  // بازگرداندن فوکوس به دکمه toggle
  ;(root.value?.querySelector('[data-part="toggle"]') as HTMLElement | null)?.focus()
}
function toggle() {
  isOpen.value ? close() : open()
}

function onItemSelect(item: SplitItem, index: number, originalEvent: MouseEvent | KeyboardEvent) {
  if (item.disabled || item.divider) return
  emit('select', { item, index, originalEvent })
  item.command?.({ originalEvent, item, index })
  close()
}

function setItemRef(el: HTMLElement | null, index: number) {
  if (el) itemEls.value[index] = el
}

function focus(index: number) {
  const items = props.items
  if (!items.length) return
  if (items[index]?.disabled || items[index]?.divider) return
  focusedIndex.value = index
  itemEls.value[index]?.focus()
}
function focusNext() {
  if (!props.items.length) return
  let i = focusedIndex.value
  do {
    i = (i + 1) % props.items.length
  } while ((props.items[i]?.disabled || props.items[i]?.divider) && i !== focusedIndex.value)
  focus(i)
}
function focusPrev() {
  if (!props.items.length) return
  let i = focusedIndex.value
  do {
    i = (i - 1 + props.items.length) % props.items.length
  } while ((props.items[i]?.disabled || props.items[i]?.divider) && i !== focusedIndex.value)
  focus(i)
}

function onKeydownRoot(e: KeyboardEvent) {
  // فقط زمانی که منو باز است
  if (!isOpen.value) return
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusNext()
      break
    case 'ArrowUp':
      e.preventDefault()
      focusPrev()
      break
    case 'Home':
      e.preventDefault()
      focus(0)
      break
    case 'End':
      e.preventDefault()
      focus(props.items.length - 1)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (focusedIndex.value >= 0) {
        const item = props.items[focusedIndex.value]
        if (item) onItemSelect(item, focusedIndex.value, e)
      }
      break
    case 'Escape':
      e.preventDefault()
      close()
      break
    case 'Tab':
      // خروج از منو
      close()
      break
  }
}

function onKeydownToggle(e: KeyboardEvent) {
  if (props.disabled || props.loading) return
  // کلیدهای استاندارد MenuButton
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    open()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    open()
    nextTick(() => focus(props.items.length - 1))
  }
}

function handleOutsidePointer(e: Event) {
  const t = e.target as Node
  if (isOpen.value && root.value && !root.value.contains(t)) {
    close()
  }
}

function handleScrollOrResize() {
  if (isOpen.value) positionMenu()
}

onMounted(() => {
  document.addEventListener('pointerdown', handleOutsidePointer)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsidePointer)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
})

// ——— Placement ساده بدون وابستگی خارجی:
function positionMenu() {
  const rootEl = root.value
  const menu = menuEl.value
  if (!rootEl || !menu) return

  // ریست اولیه برای اندازه‌گیری
  menu.style.minWidth = ''
  menu.style.left = '0px'
  menu.style.right = ''
  menu.style.top = '0px'
  menu.style.bottom = ''
  menu.style.transformOrigin = ''

  const rect = rootEl.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const spaceBelow = vh - rect.bottom
  const spaceAbove = rect.top

  let place: Exclude<typeof props.placement, 'auto'> = 'bottom-end'
  if (props.placement === 'auto') {
    place = spaceBelow >= 200 || spaceBelow > spaceAbove ? 'bottom-end' : 'top-end'
  } else {
    place = props.placement
  }

  // عرض منو
  if (props.matchTriggerWidth) {
    menu.style.minWidth = `${Math.round(rect.width)}px`
  }

  // محاسبه موقعیت نسبی به container (position: relative روی root)
  // در CSS ما position:absolute داریم.
  // پایین/بالا + start/end (برای RTL هم خوب جواب می‌دهد چون end را از راست ست می‌کنیم)
  if (place.startsWith('bottom')) {
    menu.style.top = `${Math.round(rootEl.offsetHeight)}px`
    menu.style.bottom = ''
  } else {
    menu.style.top = ''
    menu.style.bottom = `${Math.round(rootEl.offsetHeight)}px`
  }

  if (place.endsWith('start')) {
    // شروع: چپ
    menu.style.left = '0px'
    menu.style.right = ''
  } else {
    // پایان: راست
    menu.style.left = ''
    menu.style.right = '0px'
  }

  menu.style.transformOrigin = place.startsWith('bottom') ? 'top right' : 'bottom right'
}
</script>

<template>
  <div
    :class="styles.splitButton"
    ref="root"
    role="group"
    @keydown="onKeydownRoot"
  >
    <!-- دکمه اصلی -->
    <slot
      name="button"
      :onClick="onMainClick"
      :disabled="disabled"
      :loading="loading"
    >
      <BaseButton
        :variant="variant"
        :tone="tone"
        :size="size"
        :disabled="disabled"
        :loading="loading"
        :class="styles.main"
        @click="onMainClick"
      >
        <i v-if="icon" :class="[styles.icon, icon]" aria-hidden="true"></i>
        <span class="sb-label">{{ computedLabel }}</span>
      </BaseButton>
    </slot>

    <!-- دکمه کَرِت -->
    <BaseButton
      data-part="toggle"
      :variant="variant"
      :tone="tone"
      :size="size"
      :disabled="disabled"
      :class="styles.toggle"
      iconOnly
      aria-haspopup="menu"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="menuId"
      @click="toggle"
      @keydown="onKeydownToggle"
    >
      <span :class="styles.caret" aria-hidden="true">▼</span>
    </BaseButton>

    <!-- منو -->
    <transition :name="styles.fade" appear>
      <ul
        v-show="isOpen"
        :id="menuId"
        ref="menuEl"
        :class="styles.menu"
        role="menu"
        :aria-label="menuAriaLabel || computedLabel"
      >
        <template v-for="(item, index) in items" :key="index">
          <li
            v-if="!item.divider"
            :ref="el => setItemRef(el, index)"
            :class="[
              styles.menuItem,
              item.disabled && styles.disabled,
              item.danger && styles.danger
            ]"
            role="menuitem"
            :tabindex="-1"
            :aria-disabled="item.disabled ? 'true' : undefined"
            @click="(e) => onItemSelect(item, index, e)"
            @mouseenter="() => !item.disabled && (focusedIndex = index)"
          >
            <slot name="item" :item="item" :index="index">
              <i v-if="item.icon" :class="[styles.itemIcon, item.icon]" aria-hidden="true"></i>
              <span class="sb-item-label">{{ item.label }}</span>
            </slot>
          </li>

          <li v-else :class="styles.divider" role="separator" aria-hidden="true" />
        </template>
      </ul>
    </transition>
  </div>
</template>
