import { ref, Ref } from 'vue';

export function useLoading(
  initial = false,
  delay = 0,
): {
  loading: Ref<boolean>;
  start: () => void;
  stop: () => void;
  withLoading: <T = void>(fn: () => Promise<T>) => Promise<T>;
} {
  const loading = ref(initial);
  let timer: ReturnType<typeof setTimeout> | null = null;

  function start() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (delay > 0) {
      timer = setTimeout(() => {
        loading.value = true;
        timer = null;
      }, delay);
    } else {
      loading.value = true;
    }
  }

  function stop() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    loading.value = false;
  }

  async function withLoading<T = void>(fn: () => Promise<T>): Promise<T> {
    start();
    try {
      return await fn();
    } finally {
      stop();
    }
  }

  return {
    loading,
    start,
    stop,
    withLoading,
  };
}

export default useLoading;
