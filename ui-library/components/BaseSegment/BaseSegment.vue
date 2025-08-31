<template>
  <div
    :class="[
      $style.segment,
      $style[`segment--${color}`],
      $style[`segment--${size}`],
      {
        [$style['segment--scrollable']]: scrollable,
        [$style['segment--disabled']]: disabled,
        [$style['segment--swipe-gesture']]: swipeGesture
      }
    ]"
    :style="{ '--segment-value': segmentValue }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div ref="segmentContainer" :class="$style.segmentContainer">
      <div
        v-if="!scrollable"
        ref="segmentIndicator"
        :class="$style.segmentIndicator"
        :style="indicatorStyle"
      />
      <template v-for="(item, index) in normalizedItems" :key="item.value || index">
        <button
          ref="segmentButtons"
          :class="[
            $style.segmentButton,
            {
              [$style['segmentButton--selected']]: isSelected(item.value || item),
              [$style['segmentButton--disabled']]: item.disabled || disabled
            }
          ]"
          :disabled="item.disabled || disabled"
          :aria-pressed="isSelected(item.value || item)"
          :aria-label="item.label || item"
          @click="selectSegment(item.value || item, index)"
        >
          <ion-icon
            v-if="item.icon"
            :name="item.icon"
            :class="$style.segmentButtonIcon"
          />
          <span v-if="item.label || (typeof item === 'string')" :class="$style.segmentButtonText">
            {{ item.label || item }}
          </span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import style from './BaseSegment.module.css'
export interface SegmentItem {
  value: string | number
  label?: string
  icon?: string
  disabled?: boolean
}

export interface Props {
  modelValue?: string | number
  items?: (string | number | SegmentItem)[]
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'dark' | 'light'
  size?: 'small' | 'default' | 'large'
  disabled?: boolean
  scrollable?: boolean
  swipeGesture?: boolean
  selectOnFocus?: boolean
  value?: string | number // برای سازگاری با ionic
}

export interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', event: { value: string | number; index: number }): void
  (e: 'select', event: { value: string | number; index: number }): void
  (e: 'focus', event: { value: string | number; index: number }): void
  (e: 'blur', event: { value: string | number; index: number }): void
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  color: 'primary',
  size: 'default',
  disabled: false,
  scrollable: false,
  swipeGesture: false,
  selectOnFocus: false
})

const emit = defineEmits<Emits>()

// Refs
const segmentContainer = ref<HTMLDivElement>()
const segmentIndicator = ref<HTMLDivElement>()
const segmentButtons = ref<HTMLButtonElement[]>([])

// State
const currentValue = ref(props.modelValue || props.value)
const indicatorStyle = ref({})
const touchStartX = ref(0)
const touchStartY = ref(0)
const isSwiping = ref(false)

// Computed
const normalizedItems = computed(() => {
  return props.items.map(item => {
    if (typeof item === 'string' || typeof item === 'number') {
      return { value: item, label: String(item) }
    }
    return item
  })
})

const segmentValue = computed(() => {
  const index = normalizedItems.value.findIndex(item => 
    isSelected(item.value)
  )
  return index !== -1 ? index : 0
})

// Methods
const isSelected = (value: string | number) => {
  return currentValue.value === value
}

const selectSegment = (value: string | number, index: number) => {
  if (props.disabled) return
  
  const item = normalizedItems.value[index]
  if (item.disabled) return

  currentValue.value = value
  emit('update:modelValue', value)
  emit('change', { value, index })
  emit('select', { value, index })
  
  updateIndicator()
}

const updateIndicator = async () => {
  if (props.scrollable || !segmentIndicator.value || !segmentButtons.value) return
  
  await nextTick()
  
  const selectedIndex = normalizedItems.value.findIndex(item => 
    isSelected(item.value)
  )
  
  if (selectedIndex === -1) return
  
  const button = segmentButtons.value[selectedIndex]
  if (!button) return
  
  const containerRect = segmentContainer.value?.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()
  
  if (!containerRect) return
  
  const left = buttonRect.left - containerRect.left
  const width = buttonRect.width
  
  indicatorStyle.value = {
    transform: `translateX(${left}px)`,
    width: `${width}px`
  }
}

// Touch/Swipe handlers
const handleTouchStart = (e: TouchEvent) => {
  if (!props.swipeGesture || props.disabled) return
  
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSwiping.value = false
}

const handleTouchMove = (e: TouchEvent) => {
  if (!props.swipeGesture || props.disabled) return
  
  const deltaX = Math.abs(e.touches[0].clientX - touchStartX.value)
  const deltaY = Math.abs(e.touches[0].clientY - touchStartY.value)
  
  if (deltaX > deltaY && deltaX > 10) {
    isSwiping.value = true
    e.preventDefault()
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!props.swipeGesture || props.disabled || !isSwiping.value) return
  
  const deltaX = e.changedTouches[0].clientX - touchStartX.value
  const currentIndex = normalizedItems.value.findIndex(item => 
    isSelected(item.value)
  )
  
  if (Math.abs(deltaX) > 50) {
    let newIndex = currentIndex
    
    if (deltaX > 0 && currentIndex > 0) {
      // Swipe right - previous
      newIndex = currentIndex - 1
    } else if (deltaX < 0 && currentIndex < normalizedItems.value.length - 1) {
      // Swipe left - next
      newIndex = currentIndex + 1
    }
    
    if (newIndex !== currentIndex && !normalizedItems.value[newIndex].disabled) {
      const item = normalizedItems.value[newIndex]
      selectSegment(item.value, newIndex)
    }
  }
  
  isSwiping.value = false
}

// Focus handlers
const handleFocus = (value: string | number, index: number) => {
  emit('focus', { value, index })
  
  if (props.selectOnFocus && !props.disabled) {
    selectSegment(value, index)
  }
}

const handleBlur = (value: string | number, index: number) => {
  emit('blur', { value, index })
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    currentValue.value = newValue
    updateIndicator()
  }
})

watch(() => props.value, (newValue) => {
  if (newValue !== undefined) {
    currentValue.value = newValue
    updateIndicator()
  }
})

watch(normalizedItems, () => {
  nextTick(updateIndicator)
}, { deep: true })

// Lifecycle
onMounted(() => {
  // اگر مقدار اولیه تنظیم نشده، اولین آیتم را انتخاب کن
  if (currentValue.value === undefined && normalizedItems.value.length > 0) {
    const firstEnabled = normalizedItems.value.find(item => !item.disabled)
    if (firstEnabled) {
      currentValue.value = firstEnabled.value
      emit('update:modelValue', firstEnabled.value)
    }
  }
  
  updateIndicator()
  
  // Resize observer for responsive updates
  const resizeObserver = new ResizeObserver(() => {
    updateIndicator()
  })
  
  if (segmentContainer.value) {
    resizeObserver.observe(segmentContainer.value)
  }
  
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})

// Expose methods
defineExpose({
  selectSegment,
  updateIndicator
})
</script>


<style lang="css" module src="./BaseSegment.module.css" ></style>