type SizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type Direction = 'horizontal' | 'vertical' | 'both';
interface BaseSpacerProps {
    /** Element tag */
    as?: keyof HTMLElementTagNameMap;
    /** Logical direction: horizontal -> عرض، vertical -> ارتفاع، both -> هر دو */
    direction?: Direction;
    /** سایز توکنی (از توکن‌ها یا fallback) */
    size?: SizeToken;
    /** ابعاد سفارشی */
    width?: string | number;
    height?: string | number;
    /** محدودیت‌ها */
    min?: string | number;
    max?: string | number;
    /** گسترش در فلکس */
    grow?: boolean;
    /** اندازهٔ واکنشی (mobile-first)؛ مقدار هر breakpoint یک طول CSS است */
    responsive?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string | number>>;
    /** نسبت تصویر (CSS) */
    aspectRatio?: string;
    /** پراپ‌های دلخواه به‌صورت CSS Variable */
    customProperties?: Record<string, string>;
    /** کلاس اضافی */
    className?: string;
}
declare const _default: import("vue").DefineComponent<BaseSpacerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BaseSpacerProps> & Readonly<{}>, {
    size: SizeToken;
    direction: Direction;
    as: keyof HTMLElementTagNameMap;
    grow: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
