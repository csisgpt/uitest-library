<template>
  <div class="table-pagination" :class="{ 'pagination--background': background }">
    <div class="pagination-info">
      <span>
        نمایش {{ start }} تا {{ end }} از {{ total }} مورد
      </span>
      
      <select
        v-if="pageSizes && pageSizes.length > 1"
        v-model="localPageSize"
        @change="handleSizeChange"
        class="page-size-select"
      >
        <option v-for="size in pageSizes" :key="size" :value="size">
          {{ size }} مورد
        </option>
      </select>
    </div>
    
    <div class="pagination-controls">
      <button
        @click="goToFirst"
        :disabled="current === 1"
        class="pagination-btn"
        title="صفحه اول"
      >
        <IconChevronsRight :size="18" />
      </button>
      
      <button
        @click="goToPrev"
        :disabled="current === 1"
        class="pagination-btn"
        title="صفحه قبل"
      >
        <IconChevronRight :size="18" />
      </button>
      
      <div class="pagination-pages">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['pagination-page', { 'pagination-page--active': page === current }]"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        @click="goToNext"
        :disabled="current === totalPages"
        class="pagination-btn"
        title="صفحه بعد"
      >
        <IconChevronLeft :size="18" />
      </button>
      
      <button
        @click="goToLast"
        :disabled="current === totalPages"
        class="pagination-btn"
        title="صفحه آخر"
      >
        <IconChevronsLeft :size="18" />
      </button>
    </div>
    
    <div class="pagination-jumper" v-if="showJumper">
      <span>برو به صفحه:</span>
      <input
        v-model.number="jumpPage"
        type="number"
        :min="1"
        :max="totalPages"
        @keyup.enter="handleJump"
        class="jump-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  IconChevronLeft, 
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight 
} from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  current: number
  pageSize: number
  total: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
  small?: boolean
  hideOnSinglePage?: boolean
}>(), {
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => [10, 20, 50, 100],
  background: true,
  small: false,
  hideOnSinglePage: false
})

const emit = defineEmits<{
  'change': [page: number]
  'size-change': [size: number]
}>()

const localPageSize = ref(props.pageSize)
const jumpPage = ref(props.current)

const totalPages = computed(() => 
  Math.ceil(props.total / props.pageSize)
)

const start = computed(() => 
  Math.min((props.current - 1) * props.pageSize + 1, props.total)
)

const end = computed(() => 
  Math.min(props.current * props.pageSize, props.total)
)

const showJumper = computed(() => 
  props.layout?.includes('jumper') ?? false
)

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = props.current
  
  if (total <= 7) {
    // Show all pages
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show first, last, and pages around current
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

watch(() => props.pageSize, (newSize) => {
  localPageSize.value = newSize
})

watch(() => props.current, (newPage) => {
  jumpPage.value = newPage
})

function goToPage(page: number | string) {
  if (typeof page === 'number') {
    emit('change', page)
  }
}

function goToFirst() {
  emit('change', 1)
}

function goToLast() {
  emit('change', totalPages.value)
}

function goToPrev() {
  if (props.current > 1) {
    emit('change', props.current - 1)
  }
}

function goToNext() {
  if (props.current < totalPages.value) {
    emit('change', props.current + 1)
  }
}

function handleSizeChange() {
  emit('size-change', localPageSize.value)
  emit('change', 1) // Reset to first page
}

function handleJump() {
  if (jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
    emit('change', jumpPage.value)
  }
}
</script>

<style scoped>
.table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.pagination--background {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-sm);
  color: var(--color-muted);
}

.page-size-select {
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  outline: none;
}

.page-size-select:focus {
  border-color: var(--color-primary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.pagination-btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.pagination-page {
  min-width: 32px;
  height: 32px;
  padding: 0 var(--space-sm);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-page:hover:not(:disabled):not(.pagination-page--active) {
  background: var(--color-surface);
}

.pagination-page--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.pagination-page:disabled {
  cursor: default;
  border: none;
  background: none;
}

.pagination-jumper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
}

.jump-input {
  width: 60px;
  padding: var(--space-xs);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-text);
  text-align: center;
  outline: none;
}

.jump-input:focus {
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .table-pagination {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pagination-info,
  .pagination-controls,
  .pagination-jumper {
    justify-content: center;
  }
}
</style>