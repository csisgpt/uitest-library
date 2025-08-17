import { ref } from 'vue';
export function useColumnOrder() {
  const order = ref<string[]>([]);
  let dragId: string | null = null;
  function start(id: string) { dragId = id; }
  function drop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const ids = [...order.value];
    const from = ids.indexOf(dragId); const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ...ids.splice(from, 1)); order.value = ids; dragId = null;
  }
  return { order, start, drop };
}
