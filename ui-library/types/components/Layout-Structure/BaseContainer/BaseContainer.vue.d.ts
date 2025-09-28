type SizeKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none';
type PadKey = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
interface BaseContainerProps {
    /** حداکثر عرض */
    maxWidth?: SizeKey;
    /** فاصله افقی */
    paddingX?: PadKey;
    /** فاصله عمودی */
    paddingY?: PadKey;
    /** شورت‌کات برای هر دو محور */
    padding?: PadKey;
    /** مرکز کردن کانتینر به صورت افقی */
    centered?: boolean;
    /** بدون محدودیت max-width */
    fluid?: boolean;
    /** شکست از محدودیت والد تا لبه‌های viewport */
    breakout?: boolean;
    /** تگ HTML */
    as?: string;
    /** مقدار سفارشی حداکثر عرض (مثل '68rem' یا '1024px') */
    customMaxWidth?: string;
}
declare const _default: import("vue").DefineComponent<BaseContainerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BaseContainerProps> & Readonly<{}>, {
    maxWidth: SizeKey;
    as: string;
    padding: PadKey;
    paddingX: PadKey;
    paddingY: PadKey;
    centered: boolean;
    fluid: boolean;
    breakout: boolean;
    customMaxWidth: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
