import { type PropType } from "vue";
interface MenuItem {
    label?: string;
    icon?: string;
    command?: (event: {
        originalEvent: Event;
        item: MenuItem;
    }) => void;
    url?: string;
    target?: string;
    disabled?: boolean;
    visible?: boolean;
    separator?: boolean;
    style?: any;
    class?: any;
    [key: string]: any;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    label: {
        type: StringConstructor;
        default: null;
    };
    icon: {
        type: StringConstructor;
        default: null;
    };
    model: {
        type: PropType<MenuItem[]>;
        default: () => never[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    tabindex: {
        type: StringConstructor;
        default: string;
    };
    autoZIndex: {
        type: BooleanConstructor;
        default: boolean;
    };
    baseZIndex: {
        type: NumberConstructor;
        default: number;
    };
    appendTo: {
        type: StringConstructor;
        default: string;
    };
    dropdownIcon: {
        type: StringConstructor;
        default: string;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadingIcon: {
        type: StringConstructor;
        default: string;
    };
    severity: {
        type: PropType<"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger">;
        default: string;
        validator: (value: string) => boolean;
    };
    raised: {
        type: BooleanConstructor;
        default: boolean;
    };
    rounded: {
        type: BooleanConstructor;
        default: boolean;
    };
    text: {
        type: BooleanConstructor;
        default: boolean;
    };
    outlined: {
        type: BooleanConstructor;
        default: boolean;
    };
    size: {
        type: PropType<"small" | "large">;
        default: null;
        validator: (value: string) => boolean;
    };
    plain: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {
    show: (event?: Event) => void;
    hide: () => void;
    toggle: (event?: Event) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (event: Event) => any;
    "dropdown-click": (event: Event) => any;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    label: {
        type: StringConstructor;
        default: null;
    };
    icon: {
        type: StringConstructor;
        default: null;
    };
    model: {
        type: PropType<MenuItem[]>;
        default: () => never[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    tabindex: {
        type: StringConstructor;
        default: string;
    };
    autoZIndex: {
        type: BooleanConstructor;
        default: boolean;
    };
    baseZIndex: {
        type: NumberConstructor;
        default: number;
    };
    appendTo: {
        type: StringConstructor;
        default: string;
    };
    dropdownIcon: {
        type: StringConstructor;
        default: string;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadingIcon: {
        type: StringConstructor;
        default: string;
    };
    severity: {
        type: PropType<"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger">;
        default: string;
        validator: (value: string) => boolean;
    };
    raised: {
        type: BooleanConstructor;
        default: boolean;
    };
    rounded: {
        type: BooleanConstructor;
        default: boolean;
    };
    text: {
        type: BooleanConstructor;
        default: boolean;
    };
    outlined: {
        type: BooleanConstructor;
        default: boolean;
    };
    size: {
        type: PropType<"small" | "large">;
        default: null;
        validator: (value: string) => boolean;
    };
    plain: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    onClick?: ((event: Event) => any) | undefined;
    "onDropdown-click"?: ((event: Event) => any) | undefined;
}>, {
    text: boolean;
    size: "small" | "large";
    rounded: boolean;
    disabled: boolean;
    loading: boolean;
    label: string;
    outlined: boolean;
    icon: string;
    model: MenuItem[];
    tabindex: string;
    autoZIndex: boolean;
    baseZIndex: number;
    appendTo: string;
    dropdownIcon: string;
    loadingIcon: string;
    severity: "primary" | "success" | "warning" | "info" | "secondary" | "danger" | "help";
    raised: boolean;
    plain: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
