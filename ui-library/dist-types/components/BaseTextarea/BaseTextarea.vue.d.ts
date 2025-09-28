type __VLS_Props = {
    modelValue: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    rows?: number;
    maxLength?: number;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
    autoResize?: boolean;
    error?: string | boolean;
    hint?: string;
    name?: string;
    id?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    input: (event: Event) => any;
    blur: (event: FocusEvent) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onInput?: ((event: Event) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    disabled: boolean;
    resize: "none" | "both" | "horizontal" | "vertical";
    readonly: boolean;
    rows: number;
    autoResize: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
