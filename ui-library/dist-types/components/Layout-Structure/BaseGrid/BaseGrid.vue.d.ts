type GapToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AlignItem = 'start' | 'center' | 'end' | 'stretch';
type JustifyItem = 'start' | 'center' | 'end' | 'stretch';
type Flow = 'row' | 'column' | 'row-dense' | 'column-dense';
export interface BaseGridProps {
    /** عنصر ریشه */
    as?: keyof HTMLElementTagNameMap;
    /** تعداد ستون‌ها (۱..۱۲) یا 'auto' */
    cols?: number | 'auto';
    /** فاصله بین آیتم‌ها (توکن یا طول سفارشی) */
    gap?: GapToken | string;
    /** هم‌ترازی عمودی آیتم‌ها */
    align?: AlignItem;
    /** هم‌ترازی افقی آیتم‌ها */
    justify?: JustifyItem;
    /** جریان چیدمان خودکار گرید */
    flow?: Flow;
    /** ریسپانسیو: تعداد ستون‌ها در bpها */
    responsive?: Partial<Record<'sm' | 'md' | 'lg' | 'xl', number | 'auto'>>;
    /** auto-fit با حداقل/حداکثر عرض */
    autoFit?: {
        minWidth: string;
        maxWidth?: string;
    };
    /** CSS vars سفارشی */
    customProperties?: Record<string, string>;
    /** کلاس اضافه */
    className?: string;
}
declare const _default: import("vue").DefineComponent<BaseGridProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BaseGridProps> & Readonly<{}>, {
    as: keyof HTMLElementTagNameMap;
    gap: GapToken | string;
    flow: Flow;
    cols: number | "auto";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
