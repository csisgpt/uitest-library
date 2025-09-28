interface SpeedDialItem {
    icon: string;
    command?: () => void;
    tooltip?: string;
}
type __VLS_Props = {
    model: SpeedDialItem[];
    direction?: "up" | "down" | "left" | "right";
    type?: "linear" | "circle";
    icon?: string;
    transition?: boolean;
    position?: string;
    tooltip?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: MouseEvent) => any;
    close: () => any;
    open: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
    onClose?: (() => any) | undefined;
    onOpen?: (() => any) | undefined;
}>, {
    type: "linear" | "circle";
    position: string;
    icon: string;
    model: SpeedDialItem[];
    direction: "up" | "down" | "left" | "right";
    transition: boolean;
    tooltip: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
