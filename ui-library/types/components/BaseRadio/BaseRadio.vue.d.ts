type __VLS_Props = {
    modelValue: string | number | boolean;
    value: string | number | boolean;
    label?: string;
    name?: string;
    disabled?: boolean;
    error?: boolean;
    required?: boolean;
    inline?: boolean;
    id?: string;
    ariaLabel?: string;
    size?: 'sm' | 'md' | 'lg';
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (event: Event) => any;
    "update:modelValue": (value: string | number | boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((event: Event) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | number | boolean) => any) | undefined;
}>, {
    error: boolean;
    size: "sm" | "md" | "lg";
    disabled: boolean;
    required: boolean;
    inline: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
