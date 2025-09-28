type __VLS_Props = {
    modelValue: string;
    label?: string;
    placeholder?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error' | 'success' | 'warning' | 'info';
    size?: 'sm' | 'md' | 'lg';
    type?: 'text' | 'password' | 'email' | 'number';
    block?: boolean;
    rounded?: boolean;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    iconLeft?: string;
    iconRight?: string;
    clearable?: boolean;
    errorMessage?: string;
    successMessage?: string;
    hint?: string;
    name?: string;
    autocomplete?: string;
    id?: string;
    /** 'rtl' | 'ltr' | 'auto' */
    dir?: 'rtl' | 'ltr' | 'auto';
    /** دکمهٔ نمایش/مخفی‌سازی پسورد */
    showPasswordToggle?: boolean;
};
declare function focus(): void;
declare function blur(): void;
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    focus: typeof focus;
    blur: typeof blur;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    blur: () => any;
    focus: () => any;
    "update:modelValue": (value: string) => any;
    clear: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onBlur?: (() => any) | undefined;
    onFocus?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
}>, {
    variant: "primary" | "secondary" | "outline" | "ghost" | "error" | "success" | "warning" | "info";
    size: "sm" | "md" | "lg";
    rounded: boolean;
    type: "text" | "password" | "email" | "number";
    block: boolean;
    disabled: boolean;
    loading: boolean;
    fullWidth: boolean;
    readonly: boolean;
    clearable: boolean;
    dir: "rtl" | "ltr" | "auto";
    showPasswordToggle: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
