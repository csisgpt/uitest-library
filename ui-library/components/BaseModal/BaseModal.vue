<template>
  <Teleport to="body">
    <transition name="overlay">
      <div v-if="modelValue && !hideOverlay" :class="styles.overlay"></div>
    </transition>
    <div
      v-if="modelValue"
      :class="[styles.wrapper, fullscreen && styles.wrapperFullscreen]"
      @click.self="onOverlayClick"
    >
      <transition name="modal">
        <div
          v-if="modelValue"
          ref="modalRef"
          :class="[styles.box, fullscreen && styles.fullscreen]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="computedLabelledby"
          :aria-describedby="ariaDescribedby"
          :style="modalStyles"
          tabindex="-1"
          @keydown.stop
        >
          <header v-if="title || closable" :class="styles.header">
            <h2 v-if="title" :id="computedLabelledby" :class="styles.title">{{ title }}</h2>
            <button
              v-if="closable"
              type="button"
              :class="styles.close"
              aria-label="Close"
              @click="close"
            >
              ×
            </button>
          </header>
          <div :class="styles.body">
            <slot />
          </div>
          <footer v-if="$slots.footer" :class="styles.footer">
            <slot name="footer" />
          </footer>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick, computed } from 'vue'
import styles from './BaseModal.module.css'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    width?: string
    fullscreen?: boolean
    closable?: boolean
    persistent?: boolean
    hideOverlay?: boolean
    ariaLabelledby?: string
    ariaDescribedby?: string
  }>(),
  {
    width: '600px',
    fullscreen: false,
    closable: true,
    persistent: false,
    hideOverlay: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const previouslyFocused = ref<HTMLElement | null>(null)
const id = `modal-${Math.random().toString(36).slice(2, 9)}`

const computedLabelledby = computed(() => props.ariaLabelledby ?? (props.title ? id : undefined))

const modalStyles = computed(() => ({
  '--modal-width': props.width,
  '--modal-fullscreen-width': '100vw',
  '--modal-fullscreen-height': '100vh',
  '--modal-fullscreen-radius': '0'
}))

const focusableSelector =
  'a[href],area[href],input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[tabindex]:not([tabindex="-1"]),[contenteditable]'

function trap(e: KeyboardEvent) {
  if (e.key === 'Escape' && !props.persistent) {
    close()
    return
  }
  if (e.key !== 'Tab') return
  const focusables = modalRef.value?.querySelectorAll<HTMLElement>(focusableSelector)
  if (!focusables || focusables.length === 0) {
    e.preventDefault()
    return
  }
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = document.activeElement as HTMLElement
  if (e.shiftKey) {
    if (active === first || !modalRef.value?.contains(active)) {
      e.preventDefault()
      last.focus()
    }
  } else if (active === last) {
    e.preventDefault()
    first.focus()
  }
}

function open() {
  previouslyFocused.value = document.activeElement as HTMLElement | null
  document.addEventListener('keydown', trap)
  nextTick(() => {
    const focusables = modalRef.value?.querySelectorAll<HTMLElement>(focusableSelector)
    ;(focusables && focusables[0] ? focusables[0] : modalRef.value)?.focus()
  })
}

function cleanup() {
  document.removeEventListener('keydown', trap)
  previouslyFocused.value?.focus()
}

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onOverlayClick() {
  if (props.persistent || !props.closable) return
  close()
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) open()
    else cleanup()
  },
  { immediate: true }
)

onBeforeUnmount(() => cleanup())
</script>

<style module src="./BaseModal.module.css"></style>
