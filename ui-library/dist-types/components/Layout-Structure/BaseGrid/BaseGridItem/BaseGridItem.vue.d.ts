type AlignSelf = 'start' | 'center' | 'end' | 'stretch';
type JustifySelf = 'start' | 'center' | 'end' | 'stretch';
export interface BaseGridItemProps {
    as?: keyof HTMLElementTagNameMap;
    colSpan?: number | 'full';
    rowSpan?: number | 'full';
    area?: string;
    colStart?: number;
    colEnd?: number;
    rowStart?: number;
    rowEnd?: number;
    responsive?: Partial<Record<'sm' | 'md' | 'lg' | 'xl', number | 'full'>>;
    alignSelf?: AlignSelf;
    justifySelf?: JustifySelf;
    order?: number;
    className?: string;
}
declare const _default: import("vue").DefineComponent<BaseGridItemProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BaseGridItemProps> & Readonly<{}>, {
    as: keyof HTMLElementTagNameMap;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
