type __VLS_Props = {
    modelValue: boolean;
    title: string;
    message: string;
    variant?: 'info' | 'success' | 'warning' | 'danger';
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cancel: () => any;
    "update:modelValue": (value: boolean) => any;
    confirm: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onConfirm?: (() => any) | undefined;
}>, {
    variant: "info" | "success" | "warning" | "danger";
    cancelText: string;
    confirmText: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
