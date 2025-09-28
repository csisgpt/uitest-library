import { Ref } from 'vue';
export declare function useLoading(initial?: boolean, delay?: number): {
    loading: Ref<boolean>;
    start: () => void;
    stop: () => void;
    withLoading: <T = void>(fn: () => Promise<T>) => Promise<T>;
};
export default useLoading;
