type __VLS_Props = {
    modelValue: boolean;
    onLabel?: string;
    offLabel?: string;
    onIcon?: string;
    offIcon?: string;
    disabled?: boolean;
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'outline' | 'ghost';
    color?: 'primary' | 'success' | 'error' | 'info' | 'warning';
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    color: "primary" | "success" | "error" | "info" | "warning";
    variant: "solid" | "outline" | "ghost";
    size: "sm" | "md" | "lg";
    disabled: boolean;
    loading: boolean;
    modelValue: boolean;
    onLabel: string;
    offLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
