type __VLS_Props = {
    text?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    trigger?: 'hover' | 'click' | 'focus' | 'manual';
    delay?: number;
    hideDelay?: number;
    disabled?: boolean;
    persistent?: boolean;
    offset?: number;
    animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'none';
    id?: string;
    open?: boolean;
    closeOnClickOutside?: boolean;
    zIndex?: number;
    maxWidth?: string | number;
    interactive?: boolean;
    flipOnOverflow?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    show: () => any;
    hide: () => any;
    "update:open": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onShow?: (() => any) | undefined;
    onHide?: (() => any) | undefined;
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    position: "top" | "bottom" | "left" | "right";
    trigger: "hover" | "click" | "focus" | "manual";
    delay: number;
    hideDelay: number;
    persistent: boolean;
    offset: number;
    animation: "fade" | "scale" | "slide-up" | "slide-down" | "none";
    closeOnClickOutside: boolean;
    interactive: boolean;
    flipOnOverflow: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
