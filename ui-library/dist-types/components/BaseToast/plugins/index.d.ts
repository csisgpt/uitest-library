import type { App } from "vue";
import type { ToastOptions } from "../types";
declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $toast: {
            show: (options: ToastOptions) => string;
            success: (message: string, options?: Partial<ToastOptions>) => string;
            error: (message: string, options?: Partial<ToastOptions>) => string;
            warning: (message: string, options?: Partial<ToastOptions>) => string;
            info: (message: string, options?: Partial<ToastOptions>) => string;
            dismiss: (id: string) => void;
            dismissAll: () => void;
            processError: (error: any, customMessage?: string) => string;
        };
    }
}
export interface ToastPluginOptions {
    position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
    maxToasts?: number;
    duration?: number;
}
export declare const createToastPlugin: (options?: ToastPluginOptions) => {
    install(app: App): void;
};
declare const _default: {
    install(app: App): void;
};
export default _default;
