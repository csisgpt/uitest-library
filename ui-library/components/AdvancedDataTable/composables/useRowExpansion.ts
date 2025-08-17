import { reactive } from 'vue';
export function useRowExpansion<Key = string | number>() { const open = reactive(new Set<Key>()); function toggle(key: Key) { if (open.has(key)) open.delete(key); else open.add(key); } function isOpen(key: Key) { return open.has(key); } return { open, toggle, isOpen }; }
