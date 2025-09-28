interface Option {
    [key: string]: any;
}
interface BaseSelectProps {
    modelValue?: any;
    options?: Option[];
    optionLabel?: string | ((option: Option) => string);
    optionValue?: string | ((option: Option) => any);
    optionDisabled?: string | ((option: Option) => boolean);
    multiple?: boolean;
    filterable?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    loading?: boolean;
    required?: boolean;
    invalid?: boolean;
    label?: string;
    placeholder?: string;
    helpText?: string;
    errorMessage?: string;
    emptyMessage?: string;
    clearLabel?: string;
    variant?: "default" | "filled" | "outlined";
    size?: "small" | "medium" | "large";
    filter?: "contains" | "startsWith" | "endsWith" | ((value: string, option: Option) => boolean);
    filterPlaceholder?: string;
    maxSelectedLabels?: number;
    virtualScroll?: boolean;
    scrollHeight?: string;
}
declare const _default: import("vue").DefineComponent<BaseSelectProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    filter: (value: string) => any;
    blur: (event: FocusEvent) => any;
    change: (value: any) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: any) => any;
    clear: () => any;
    show: () => any;
    hide: () => any;
}, string, import("vue").PublicProps, Readonly<BaseSelectProps> & Readonly<{
    onFilter?: ((value: string) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((value: any) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
    onClear?: (() => any) | undefined;
    onShow?: (() => any) | undefined;
    onHide?: (() => any) | undefined;
}>, {
    variant: "default" | "filled" | "outlined";
    size: "small" | "medium" | "large";
    filter: "contains" | "startsWith" | "endsWith" | ((value: string, option: Option) => boolean);
    disabled: boolean;
    loading: boolean;
    invalid: boolean;
    placeholder: string;
    clearable: boolean;
    required: boolean;
    options: Option[];
    optionLabel: string | ((option: Option) => string);
    optionValue: string | ((option: Option) => any);
    optionDisabled: string | ((option: Option) => boolean);
    multiple: boolean;
    filterable: boolean;
    emptyMessage: string;
    clearLabel: string;
    filterPlaceholder: string;
    maxSelectedLabels: number;
    scrollHeight: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
