import type { Column } from '../types';
type __VLS_Props = {
    modelValue: boolean;
    title: string;
    data: Record<string, any>;
    columns: Column[];
    mode: 'create' | 'update';
    loading?: boolean;
    size?: 'small' | 'medium' | 'large';
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cancel: () => any;
    "update:modelValue": (value: boolean) => any;
    save: (data: Record<string, any>) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onSave?: ((data: Record<string, any>) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
