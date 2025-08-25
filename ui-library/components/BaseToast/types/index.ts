export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export type ToastAnimation = "slide" | "fade" | "scale" | "bounce";

export interface ToastAction {
  label: string;
  handler: () => void;
  style?: "primary" | "secondary" | "danger";
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  position?: ToastPosition;
  animation?: ToastAnimation;
  showProgress?: boolean;
  actions?: ToastAction[];
  icon?: string;
  customClass?: string;
  onClose?: () => void;
  onClick?: () => void;
}

export interface Toast
  extends Required<Omit<ToastOptions, "actions" | "onClose" | "onClick">> {
  id: string;
  createdAt: number;
  actions?: ToastAction[];
  onClose?: () => void;
  onClick?: () => void;
}

export interface ToastState {
  toasts: Toast[];
  position: ToastPosition;
  maxToasts: number;
}

export interface ToastManagerInterface {
  toasts: Toast[];
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
  setMaxToasts: (max: number) => void;
  add: (options: ToastOptions) => string;
  remove: (id: string) => void;
  clear: () => void;
  success: (message: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  info: (message: string, options?: Partial<ToastOptions>) => string;
  processError: (error: any, customMessage?: string) => string;
  pauseTimer: (id: string) => void;
  resumeTimer: (id: string) => void;
}
