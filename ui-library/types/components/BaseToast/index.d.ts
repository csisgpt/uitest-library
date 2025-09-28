export { default as BaseToast } from './BaseToast.vue';
export { default as ToastContainer } from './ToastContainer.vue';
export { useToast } from './composables/useToast';
export type { UseToastReturn } from './composables/useToast';
export { toastManager, ToastManager } from './utils/toast-manager';
export { default as toastPlugin, createToastPlugin } from './plugins/index';
export type { ToastPluginOptions } from './plugins/index';
export type { Toast, ToastOptions, ToastAction, ToastType, ToastPosition, ToastAnimation, ToastState, ToastManagerInterface } from './types/index';
export declare const DEFAULT_TOAST_CONFIG: {
    position: "top-right";
    duration: number;
    maxToasts: number;
    showProgress: boolean;
    animation: "slide";
};
