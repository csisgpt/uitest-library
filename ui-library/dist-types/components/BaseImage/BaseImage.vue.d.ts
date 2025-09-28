type __VLS_Props = {
    src: string;
    alt?: string;
    width?: string | number;
    maxWidth?: string | number;
    height?: string | number;
    fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    radius?: "none" | "sm" | "md" | "lg" | "full";
    lazy?: boolean;
    placeholder?: string;
    fallback?: string;
    loadingIndicator?: boolean;
    transition?: boolean;
    aspectRatio?: string;
    objectPosition?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    error: (event: Event) => any;
    load: (event: Event) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onError?: ((event: Event) => any) | undefined;
    onLoad?: ((event: Event) => any) | undefined;
}>, {
    placeholder: string;
    width: string | number;
    maxWidth: string | number;
    transition: boolean;
    alt: string;
    fit: "cover" | "contain" | "fill" | "none" | "scale-down";
    radius: "none" | "sm" | "md" | "lg" | "full";
    lazy: boolean;
    fallback: string;
    loadingIndicator: boolean;
    aspectRatio: string;
    objectPosition: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
