type __VLS_Props = {
    current: number;
    pageSize: number;
    total: number;
    pageSizes?: number[];
    layout?: string;
    background?: boolean;
    small?: boolean;
    hideOnSinglePage?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (page: number) => any;
    "size-change": (size: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((page: number) => any) | undefined;
    "onSize-change"?: ((size: number) => any) | undefined;
}>, {
    small: boolean;
    background: boolean;
    current: number;
    pageSize: number;
    total: number;
    pageSizes: number[];
    hideOnSinglePage: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
