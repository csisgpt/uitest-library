export interface TabItem {
    value: string | number;
    label?: string | number | any;
    icon?: string;
    disabled?: boolean;
    content?: string | number | any;
}
type __VLS_Props = {
    modelValue?: string | number;
    tabs?: TabItem[];
    variant?: 'default' | 'underline' | 'pill' | 'card';
    align?: 'start' | 'center' | 'end';
    lazy?: boolean;
    transition?: 'fade' | 'slide-left' | 'slide-up' | 'none';
    tabClass?: string;
    contentClass?: string;
    stacked?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (args_0: string | number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((args_0: string | number) => any) | undefined;
}>, {
    variant: "default" | "underline" | "pill" | "card";
    align: "start" | "center" | "end";
    transition: "fade" | "slide-left" | "slide-up" | "none";
    lazy: boolean;
    stacked: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
