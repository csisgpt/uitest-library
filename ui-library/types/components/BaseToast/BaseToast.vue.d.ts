import type { Toast, ToastAction } from "./types";
interface Props {
    toast: Toast;
    onClose?: (id: string) => void;
    onAction?: (action: ToastAction, toast: Toast) => void;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
