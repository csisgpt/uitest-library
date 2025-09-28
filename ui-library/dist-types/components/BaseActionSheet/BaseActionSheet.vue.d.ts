import { type Component } from "vue";
type Trigger = "click" | "manual";
type ActionRole = "default" | "destructive" | "cancel";
export interface ActionSheetAction {
    id?: string | number;
    text: string;
    description?: string;
    icon?: string | Component;
    badge?: string;
    role?: ActionRole;
    disabled?: boolean;
    handler?: () => void | Promise<void>;
    preventClose?: boolean;
}
interface Props {
    modelValue?: boolean;
    trigger?: Trigger;
    disabled?: boolean;
    title?: string;
    subtitle?: string;
    triggerText?: string;
    actions?: ActionSheetAction[];
    showCloseButton?: boolean;
    showCancel?: boolean;
    cancelText?: string;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    shouldTeleport?: boolean;
    transition?: string;
    triggerClass?: string;
    actionSheetClass?: string;
    headerClass?: string;
}
declare const _default: import("vue").DefineComponent<Props, {
    open: () => void;
    close: () => void;
    isOpen: import("vue").ComputedRef<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => any;
    "update:modelValue": (value: boolean) => any;
    open: () => any;
    "before-open": () => any;
    "after-open": () => any;
    "before-close": () => any;
    "after-close": () => any;
    "action-click": (action: ActionSheetAction) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onOpen?: (() => any) | undefined;
    "onBefore-open"?: (() => any) | undefined;
    "onAfter-open"?: (() => any) | undefined;
    "onBefore-close"?: (() => any) | undefined;
    "onAfter-close"?: (() => any) | undefined;
    "onAction-click"?: ((action: ActionSheetAction) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: boolean;
    closeOnEscape: boolean;
    trigger: Trigger;
    transition: string;
    showCloseButton: boolean;
    actions: ActionSheetAction[];
    showCancel: boolean;
    cancelText: string;
    closeOnOverlayClick: boolean;
    shouldTeleport: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
