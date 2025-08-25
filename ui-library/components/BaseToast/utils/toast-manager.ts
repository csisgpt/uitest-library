import { reactive } from "vue";
import type {
  Toast,
  ToastOptions,
  ToastState,
  ToastPosition,
  ToastManagerInterface,
} from "../types";

class ToastManager implements ToastManagerInterface {
  private state = reactive<ToastState>({
    toasts: [],
    position: "top-right",
    maxToasts: 5,
  });

  private timers = new Map<string, NodeJS.Timeout>();

  get toasts() {
    return this.state.toasts;
  }

  get position() {
    return this.state.position;
  }

  setPosition(position: ToastPosition) {
    this.state.position = position;
  }

  setMaxToasts(max: number) {
    this.state.maxToasts = max;
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createToast(options: ToastOptions): Toast {
    return {
      id: options.id || this.generateId(),
      type: options.type || "info",
      title: options.title || "",
      message: options.message,
      duration: options.duration ?? 5000,
      persistent: options.persistent ?? false,
      position: options.position || this.state.position,
      animation: options.animation || "slide",
      showProgress: options.showProgress ?? true,
      icon: options.icon || "",
      customClass: options.customClass || "",
      createdAt: Date.now(),
      actions: options.actions,
      onClose: options.onClose,
      onClick: options.onClick,
    };
  }

  private manageQueue() {
    if (this.state.toasts.length > this.state.maxToasts) {
      const toRemove = this.state.toasts.slice(
        0,
        this.state.toasts.length - this.state.maxToasts
      );
      toRemove.forEach((toast) => this.remove(toast.id));
    }
  }

  private setAutoRemove(toast: Toast) {
    if (!toast.persistent && toast.duration > 0) {
      const timer = setTimeout(() => {
        this.remove(toast.id);
      }, toast.duration);

      this.timers.set(toast.id, timer);
    }
  }

  add(options: ToastOptions): string {
    const toast = this.createToast(options);

    // Check for duplicate
    const existingIndex = this.state.toasts.findIndex(
      (t) => t.message === toast.message && t.type === toast.type
    );

    if (existingIndex !== -1) {
      // Update existing toast instead of creating duplicate
      this.state.toasts[existingIndex] = toast;
      this.clearTimer(this.state.toasts[existingIndex].id);
      this.setAutoRemove(toast);
      return toast.id;
    }

    this.state.toasts.push(toast);
    this.manageQueue();
    this.setAutoRemove(toast);

    return toast.id;
  }

  remove(id: string) {
    const index = this.state.toasts.findIndex((toast) => toast.id === id);
    if (index > -1) {
      const toast = this.state.toasts[index];
      this.clearTimer(id);
      this.state.toasts.splice(index, 1);
      toast.onClose?.();
    }
  }

  clear() {
    this.state.toasts.forEach((toast) => {
      this.clearTimer(toast.id);
      toast.onClose?.();
    });
    this.state.toasts.length = 0;
  }

  private clearTimer(id: string) {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  pauseTimer(id: string) {
    this.clearTimer(id);
  }

  resumeTimer(id: string) {
    const toast = this.state.toasts.find((t) => t.id === id);
    if (toast) {
      this.setAutoRemove(toast);
    }
  }

  // Convenience methods
  success(message: string, options?: Partial<ToastOptions>): string {
    return this.add({ ...options, message, type: "success" });
  }

  error(message: string, options?: Partial<ToastOptions>): string {
    return this.add({ ...options, message, type: "error" });
  }

  warning(message: string, options?: Partial<ToastOptions>): string {
    return this.add({ ...options, message, type: "warning" });
  }

  info(message: string, options?: Partial<ToastOptions>): string {
    return this.add({ ...options, message, type: "info" });
  }

  // Error processor for API calls
  processError(error: any, customMessage?: string): string {
    let message = customMessage || "خطایی رخ داده است";

    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }

    return this.error(message, {
      persistent: true,
      actions: [
        {
          label: "تلاش مجدد",
          handler: () => window.location.reload(),
          style: "primary",
        },
      ],
    });
  }
}

// Singleton instance
export const toastManager = new ToastManager();
export { ToastManager };
