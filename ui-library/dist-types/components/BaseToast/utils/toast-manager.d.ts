import type { ToastOptions, ToastPosition, ToastManagerInterface } from "../types";
declare class ToastManager implements ToastManagerInterface {
    private state;
    private timers;
    get toasts(): {
        id: string;
        createdAt: number;
        actions?: {
            label: string;
            handler: () => void;
            style?: "primary" | "secondary" | "danger" | undefined;
        }[] | undefined;
        onClose?: (() => void) | undefined;
        onClick?: (() => void) | undefined;
        type: import("..").ToastType;
        title: string;
        position: ToastPosition;
        message: string;
        persistent: boolean;
        animation: import("..").ToastAnimation;
        icon: string;
        duration: number;
        showProgress: boolean;
        customClass: string;
    }[];
    get position(): ToastPosition;
    setPosition(position: ToastPosition): void;
    setMaxToasts(max: number): void;
    private generateId;
    private createToast;
    private manageQueue;
    private setAutoRemove;
    add(options: ToastOptions): string;
    remove(id: string): void;
    clear(): void;
    private clearTimer;
    pauseTimer(id: string): void;
    resumeTimer(id: string): void;
    success(message: string, options?: Partial<ToastOptions>): string;
    error(message: string, options?: Partial<ToastOptions>): string;
    warning(message: string, options?: Partial<ToastOptions>): string;
    info(message: string, options?: Partial<ToastOptions>): string;
    processError(error: any, customMessage?: string): string;
}
export declare const toastManager: ToastManager;
export { ToastManager };
