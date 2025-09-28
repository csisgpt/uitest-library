import type { ToastOptions, ToastPosition } from '../types';
export interface UseToastReturn {
    toasts: any;
    position: any;
    setPosition: (pos: ToastPosition) => void;
    setMaxToasts: (max: number) => void;
    show: (options: ToastOptions) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
    success: (message: string, options?: Partial<ToastOptions>) => string;
    error: (message: string, options?: Partial<ToastOptions>) => string;
    warning: (message: string, options?: Partial<ToastOptions>) => string;
    info: (message: string, options?: Partial<ToastOptions>) => string;
    processError: (error: any, customMessage?: string) => string;
    promise: <T>(promise: Promise<T>, options?: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: any) => string);
    }) => Promise<T>;
    pause: (id: string) => void;
    resume: (id: string) => void;
}
export declare function useToast(): UseToastReturn;
