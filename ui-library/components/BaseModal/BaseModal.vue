<template>
  <Teleport to="body">
    <Transition name="fade-base">
      <div
        v-if="visible"
        :class="$style.overlay"
        @click="onOverlayClick"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="headerId"
        :aria-describedby="contentId"
      >
        <div
          :class="[
            $style.modal,
            $style[size],
            { [$style.maximized]: maximized },
          ]"
          @click.stop
        >
          <!-- Header -->
          <header v-if="showHeader" :class="$style.header" :id="headerId">
            <slot name="header" :close="close">
              <h2 :class="$style.title">{{ header }}</h2>
            </slot>

            <button
              v-if="closable"
              :class="$style.closeButton"
              @click="close"
              type="button"
              :aria-label="closeLabel"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </header>

          <!-- Content -->
          <main :class="$style.content" :id="contentId">
            <slot :close="close" />
          </main>

          <!-- Footer -->
          <footer v-if="showFooter" :class="$style.footer">
            <slot name="footer" :close="close">
              <div :class="$style.footerActions">
                <button
                  v-if="showCancelButton"
                  :class="[$style.button, $style.secondary]"
                  @click="cancel"
                  type="button"
                >
                  {{ cancelLabel }}
                </button>
                <button
                  v-if="showConfirmButton"
                  :class="[$style.button, $style.primary]"
                  @click="confirm"
                  type="button"
                >
                  {{ confirmLabel }}
                </button>
              </div>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import style from "./BaseModal.module.css";
interface Props {
  visible?: boolean;
  header?: string;
  size?: "sm" | "md" | "lg" | "xl";
  maximized?: boolean;
  closable?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlay?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  closeLabel?: string;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "show"): void;
  (e: "hide"): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  header: "",
  size: "md",
  maximized: false,
  closable: true,
  closeOnEscape: true,
  closeOnOverlay: true,
  showHeader: true,
  showFooter: false,
  showCancelButton: false,
  showConfirmButton: false,
  cancelLabel: "انصراف",
  confirmLabel: "تأیید",
  closeLabel: "بستن",
});

const emit = defineEmits<Emits>();

// Generate unique IDs for accessibility
const headerId = computed(
  () => `modal-header-${Math.random().toString(36).substr(2, 9)}`
);
const contentId = computed(
  () => `modal-content-${Math.random().toString(36).substr(2, 9)}`
);

// Body scroll lock
const originalBodyOverflow = ref<string>("");

const lockBodyScroll = () => {
  originalBodyOverflow.value = document.body.style.overflow;
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  document.body.style.overflow = originalBodyOverflow.value;
};

// Event handlers
const close = () => {
  emit("update:visible", false);
  emit("hide");
};

const confirm = () => {
  emit("confirm");
};

const cancel = () => {
  emit("cancel");
  close();
};

const onOverlayClick = () => {
  if (props.closeOnOverlay) {
    close();
  }
};

const onEscapeKey = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.closeOnEscape && props.visible) {
    close();
  }
};

// Watchers
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      lockBodyScroll();
      emit("show");
      nextTick(() => {
        // Focus management could be added here
      });
    } else {
      unlockBodyScroll();
    }
  },
  { immediate: true }
);

// Lifecycle
onMounted(() => {
  document.addEventListener("keydown", onEscapeKey);
  if (props.visible) {
    lockBodyScroll();
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", onEscapeKey);
  unlockBodyScroll();
});
</script>

<style module src="./BaseModal.module.css">
</style>
