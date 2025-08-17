import { ref, computed } from 'vue';
import { DEFAULT_ROW_HEIGHT, DEFAULT_VIRTUAL_HEIGHT } from '../config/defaults';
export function useVirtualScroll(total: () => number, rowHeight = DEFAULT_ROW_HEIGHT, containerHeight = DEFAULT_VIRTUAL_HEIGHT) {
  const start = ref(0); const end = ref(0);
  const top = computed(() => start.value * rowHeight);
  const bottom = computed(() => Math.max(0, (total() - end.value) * rowHeight));
  function onScroll(el: HTMLElement) {
    const st = el.scrollTop;
    const visibleCount = Math.ceil(containerHeight / rowHeight) + 4;
    const s = Math.max(0, Math.floor(st / rowHeight) - 2);
    start.value = s; end.value = Math.min(total(), s + visibleCount);
  }
  return { start, end, top, bottom, onScroll };
}
