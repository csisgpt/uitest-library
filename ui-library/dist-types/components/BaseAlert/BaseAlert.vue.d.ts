interface AlertInput {
    type: "text" | "email" | "password" | "number" | "tel" | "url" | "textarea" | "radio" | "checkbox" | "select" | "date" | "time" | "datetime-local";
    name?: string;
    placeholder?: string;
    value?: any;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    rows?: number;
    multiple?: boolean;
    options?: Array<{
        text: string;
        value: any;
        disabled?: boolean;
    }>;
    validation?: {
        pattern?: string;
        minLength?: number;
        maxLength?: number;
        custom?: (value: any) => string | null;
    };
    attributes?: Record<string, any>;
}
interface AlertButton {
    text: string;
    role?: "cancel" | "destructive" | "confirm" | "default";
    cssClass?: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    handler?: (data?: any) => boolean | void | Promise<boolean | void>;
}
interface Props {
    isOpen: boolean;
    header?: string;
    subHeader?: string;
    message?: string;
    variant?: "default" | "success" | "error" | "warning" | "info";
    backdropDismiss?: boolean;
    showCloseButton?: boolean;
    inputs?: AlertInput[];
    buttons?: AlertButton[];
    keyboardClose?: boolean;
    htmlAttributes?: Record<string, any>;
    animated?: boolean;
    persistent?: boolean;
    size?: "small" | "medium" | "large";
    position?: "center" | "top" | "bottom";
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:isOpen": (value: boolean) => any;
    didOpen: () => any;
    willClose: () => any;
    didClose: () => any;
    buttonClick: (button: AlertButton, data?: any) => any;
    inputChange: (name: string, value: any) => any;
    inputValidate: (name: string, isValid: boolean, errorMessage?: string | undefined) => any;
    backdropClick: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:isOpen"?: ((value: boolean) => any) | undefined;
    onDidOpen?: (() => any) | undefined;
    onWillClose?: (() => any) | undefined;
    onDidClose?: (() => any) | undefined;
    onButtonClick?: ((button: AlertButton, data?: any) => any) | undefined;
    onInputChange?: ((name: string, value: any) => any) | undefined;
    onInputValidate?: ((name: string, isValid: boolean, errorMessage?: string | undefined) => any) | undefined;
    onBackdropClick?: (() => any) | undefined;
}>, {
    variant: "default" | "success" | "error" | "warning" | "info";
    size: "small" | "medium" | "large";
    buttons: AlertButton[];
    position: "center" | "top" | "bottom";
    backdropDismiss: boolean;
    showCloseButton: boolean;
    keyboardClose: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
