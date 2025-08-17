import { computed, reactive } from 'vue';
export function useSelection<Key = string | number>() {
  const set = reactive(new Set<Key>());
  const all = computed(() => set.size);
  function toggle(key: Key, on?: boolean) { const v = on ?? !set.has(key); if (v) set.add(key); else set.delete(key); }
  function clear() { set.clear(); }
  function bulk(keys: Key[]) { set.clear(); keys.forEach(k => set.add(k)); }
  function has(key: Key) { return set.has(key); }
  return { set, all, toggle, clear, bulk, has };
}
