interface Props {
    visible?: boolean;
    header?: string;
    size?: "sm" | "md" | "lg" | "xl";
    maximized?: boolean;
    closable?: boolean;
    closeOnEscape?: boolean;
    closeOnOverlay?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
    closeLabel?: string;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    "update:visible": (value: boolean) => any;
    show: () => any;
    hide: () => any;
    confirm: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    "onUpdate:visible"?: ((value: boolean) => any) | undefined;
    onShow?: (() => any) | undefined;
    onHide?: (() => any) | undefined;
    onConfirm?: (() => any) | undefined;
}>, {
    size: "sm" | "md" | "lg" | "xl";
    header: string;
    visible: boolean;
    maximized: boolean;
    closable: boolean;
    closeOnEscape: boolean;
    closeOnOverlay: boolean;
    showHeader: boolean;
    showFooter: boolean;
    showCancelButton: boolean;
    showConfirmButton: boolean;
    cancelLabel: string;
    confirmLabel: string;
    closeLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
