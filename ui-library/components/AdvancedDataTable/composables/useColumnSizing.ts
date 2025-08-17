import { reactive } from 'vue';
export function useColumnSizing() { const widths = reactive<Record<string, number>>({}); function setWidth(id: string, w: number) { widths[id] = w; } return { widths, setWidth }; }
