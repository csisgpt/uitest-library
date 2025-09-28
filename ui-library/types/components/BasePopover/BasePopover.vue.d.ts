import { type Component } from "vue";
import { type Placement } from "@popperjs/core";
export interface PopoverAction {
    id?: string | number;
    text: string;
    icon?: Component | string;
    variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error";
    disabled?: boolean;
    handler?: () => void | Promise<void>;
}
type TriggerType = "click" | "hover" | "focus" | "manual";
type Size = "sm" | "md" | "lg";
interface Props {
    modelValue?: boolean;
    trigger?: TriggerType;
    placement?: Placement;
    disabled?: boolean;
    title?: string;
    content?: string;
    triggerText?: string;
    actions?: PopoverAction[];
    size?: Size;
    showArrow?: boolean;
    showClose?: boolean;
    showBackdrop?: boolean;
    modal?: boolean;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    shouldTeleport?: boolean;
    teleportTo?: string;
    openDelay?: number;
    closeDelay?: number;
    triggerClass?: string;
    popoverClass?: string;
    closeLabel?: string;
    transitionName?: string;
    offset?: number;
    boundary?: string | Element;
}
declare const _default: import("vue").DefineComponent<Props, {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: import("vue").ComputedRef<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => any;
    "update:modelValue": (value: boolean) => any;
    open: () => any;
    "before-open": () => any;
    "after-open": () => any;
    "before-close": () => any;
    "after-close": () => any;
    "action-click": (action: PopoverAction) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onOpen?: (() => any) | undefined;
    "onBefore-open"?: (() => any) | undefined;
    "onAfter-open"?: (() => any) | undefined;
    "onBefore-close"?: (() => any) | undefined;
    "onAfter-close"?: (() => any) | undefined;
    "onAction-click"?: ((action: PopoverAction) => any) | undefined;
}>, {
    size: Size;
    disabled: boolean;
    modelValue: boolean;
    closeOnEscape: boolean;
    closeLabel: string;
    trigger: TriggerType;
    offset: number;
    closeOnClickOutside: boolean;
    shouldTeleport: boolean;
    placement: Placement;
    showArrow: boolean;
    showClose: boolean;
    showBackdrop: boolean;
    modal: boolean;
    teleportTo: string;
    openDelay: number;
    closeDelay: number;
    transitionName: string;
    boundary: string | Element;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
