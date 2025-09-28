export interface BaseSwitchProps {
    /** Current checked state */
    modelValue?: boolean;
    /** Switch label */
    label?: string;
    /** Helper text */
    helperText?: string;
    /** Error message */
    errorMessage?: string;
    /** Switch size */
    size?: "sm" | "md" | "lg";
    /** Switch variant */
    variant?: "default" | "success" | "warning" | "danger";
    /** Disabled state */
    disabled?: boolean;
    /** Loading state */
    loading?: boolean;
    /** Invalid/error state */
    invalid?: boolean;
    /** Readonly state */
    readonly?: boolean;
    /** Required field */
    required?: boolean;
    /** Input name attribute */
    name?: string;
    /** Input value attribute */
    value?: string | number;
    /** Input id */
    id?: string;
    /** Aria label */
    ariaLabel?: string;
    /** Aria labelledby */
    labelledBy?: string;
    /** Aria describedby */
    describedBy?: string;
    /** Show icons in track */
    showTrackIcons?: boolean;
    /** Thumb icon component */
    thumbIcon?: any;
    /** Auto focus */
    autofocus?: boolean;
    /** Data test id */
    dataTestId?: string;
}
export interface BaseSwitchEmits {
    /** Update model value */
    "update:modelValue": [value: boolean];
    /** Change event */
    change: [event: Event, value: boolean];
    /** Focus event */
    focus: [event: FocusEvent];
    /** Blur event */
    blur: [event: FocusEvent];
    /** Click event */
    click: [event: MouseEvent];
}
declare const _default: import("vue").DefineComponent<BaseSwitchProps, {
    focus: () => void;
    blur: () => void;
    toggle: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (event: MouseEvent) => any;
    blur: (event: FocusEvent) => any;
    change: (event: Event, value: boolean) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<BaseSwitchProps> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((event: Event, value: boolean) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    variant: "default" | "success" | "warning" | "danger";
    size: "sm" | "md" | "lg";
    disabled: boolean;
    loading: boolean;
    invalid: boolean;
    modelValue: boolean;
    readonly: boolean;
    required: boolean;
    showTrackIcons: boolean;
    autofocus: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
