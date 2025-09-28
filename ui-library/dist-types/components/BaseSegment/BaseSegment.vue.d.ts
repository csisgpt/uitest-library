export interface SegmentItem {
    value: string | number;
    label?: string;
    icon?: string;
    disabled?: boolean;
}
export interface Props {
    modelValue?: string | number;
    items?: (string | number | SegmentItem)[];
    color?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark" | "light";
    size?: "small" | "default" | "large";
    disabled?: boolean;
    scrollable?: boolean;
    swipeGesture?: boolean;
    selectOnFocus?: boolean;
    value?: string | number;
}
export interface Emits {
    (e: "update:modelValue", value: string | number): void;
    (e: "change", event: {
        value: string | number;
        index: number;
    }): void;
    (e: "select", event: {
        value: string | number;
        index: number;
    }): void;
    (e: "focus", event: {
        value: string | number;
        index: number;
    }): void;
    (e: "blur", event: {
        value: string | number;
        index: number;
    }): void;
}
declare const _default: import("vue").DefineComponent<Props, {
    selectSegment: (value: string | number, index: number) => void;
    updateIndicator: () => Promise<void>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (event: {
        value: string | number;
        index: number;
    }) => any;
    blur: (event: {
        value: string | number;
        index: number;
    }) => any;
    change: (event: {
        value: string | number;
        index: number;
    }) => any;
    focus: (event: {
        value: string | number;
        index: number;
    }) => any;
    "update:modelValue": (value: string | number) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSelect?: ((event: {
        value: string | number;
        index: number;
    }) => any) | undefined;
    onBlur?: ((event: {
        value: string | number;
        index: number;
    }) => any) | undefined;
    onChange?: ((event: {
        value: string | number;
        index: number;
    }) => any) | undefined;
    onFocus?: ((event: {
        value: string | number;
        index: number;
    }) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | number) => any) | undefined;
}>, {
    color: "primary" | "secondary" | "success" | "warning" | "danger" | "dark" | "light";
    size: "small" | "default" | "large";
    disabled: boolean;
    items: (string | number | SegmentItem)[];
    scrollable: boolean;
    swipeGesture: boolean;
    selectOnFocus: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
