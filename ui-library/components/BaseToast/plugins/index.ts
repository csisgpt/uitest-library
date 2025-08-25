import type { App } from "vue";
import { toastManager } from "../utils/toast-manager";
import type { ToastOptions } from "../types";

// Augment Vue app instance
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
  position?:
    | "top-right"
    | "top-left"
    | "top-center"
    | "bottom-right"
    | "bottom-left"
    | "bottom-center";
  maxToasts?: number;
  duration?: number;
}

export const createToastPlugin = (options: ToastPluginOptions = {}) => {
  return {
    install(app: App) {
      // Apply default options
      if (options.position) {
        toastManager.setPosition(options.position);
      }
      if (options.maxToasts) {
        toastManager.setMaxToasts(options.maxToasts);
      }

      const toast = {
        show: toastManager.add.bind(toastManager),
        success: toastManager.success.bind(toastManager),
        error: toastManager.error.bind(toastManager),
        warning: toastManager.warning.bind(toastManager),
        info: toastManager.info.bind(toastManager),
        dismiss: toastManager.remove.bind(toastManager),
        dismissAll: toastManager.clear.bind(toastManager),
        processError: toastManager.processError.bind(toastManager),
      };

      // Global property
      app.config.globalProperties.$toast = toast;

      // Provide/inject
      app.provide("toast", toast);
    },
  };
};

// Default plugin export
export default createToastPlugin();
