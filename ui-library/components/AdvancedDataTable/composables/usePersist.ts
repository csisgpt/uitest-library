import { ref } from 'vue';
import { LOCALSTORAGE_PREFIX } from '../config/defaults';
export function usePersist(key: string) {
  const lsKey = LOCALSTORAGE_PREFIX + key;
  function load<T>(fallback: T): T { try { const raw = localStorage.getItem(lsKey); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }
  function save<T>(data: T) { try { localStorage.setItem(lsKey, JSON.stringify(data)); } catch {} }
  return { load, save };
}
