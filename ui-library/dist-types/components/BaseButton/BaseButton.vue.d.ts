export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link' | 'text';
export type ButtonTone = 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'neutral';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'rounded' | 'pill' | 'square' | 'circle';
interface Props {
    variant?: ButtonVariant;
    tone?: ButtonTone;
    size?: ButtonSize;
    shape?: ButtonShape;
    type?: 'button' | 'submit' | 'reset';
    block?: boolean;
    disabled?: boolean;
    loading?: boolean;
    iconOnly?: boolean;
    elevation?: 'none' | 'sm' | 'md' | 'lg';
    ripple?: boolean;
    ariaLabel?: string;
    href?: string;
    target?: string;
    rel?: string;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {
    variant: ButtonVariant;
    size: ButtonSize;
    type: "button" | "submit" | "reset";
    tone: ButtonTone;
    shape: ButtonShape;
    block: boolean;
    disabled: boolean;
    loading: boolean;
    iconOnly: boolean;
    elevation: "none" | "sm" | "md" | "lg";
    ripple: boolean;
    ariaLabel: string;
    href: string;
    target: string;
    rel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
