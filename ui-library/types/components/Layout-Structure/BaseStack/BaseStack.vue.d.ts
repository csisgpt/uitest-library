export type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type PadToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type Justify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
export interface BaseStackProps {
    /** HTML tag to render */
    as?: keyof HTMLElementTagNameMap;
    /** (Deprecated) alias for `as` to keep backward-compat */
    tag?: keyof HTMLElementTagNameMap;
    /** Stack direction */
    direction?: Direction;
    /** Spacing between items. Accepts design tokens or any CSS length (e.g. '12px', '1.25rem') */
    spacing?: PadToken | string;
    /** Cross-axis alignment */
    align?: Align;
    /** Main-axis justification */
    justify?: Justify;
    /** Allow items to wrap */
    wrap?: boolean;
    /** Add dividers between items */
    divider?: {
        color?: string;
        thickness?: string;
        style?: 'solid' | 'dashed' | 'dotted';
    } | false;
    /** Responsive overrides per breakpoint */
    responsive?: {
        sm?: Partial<Pick<BaseStackProps, 'direction' | 'spacing' | 'align' | 'justify'>>;
        md?: Partial<Pick<BaseStackProps, 'direction' | 'spacing' | 'align' | 'justify'>>;
        lg?: Partial<Pick<BaseStackProps, 'direction' | 'spacing' | 'align' | 'justify'>>;
        xl?: Partial<Pick<BaseStackProps, 'direction' | 'spacing' | 'align' | 'justify'>>;
    };
    /** Minimum item size when wrapping (row: min-width, column: min-height) */
    minItemSize?: string;
    /** Maximum number of items to render (visually hides the rest) */
    maxItems?: number;
    /** Additional CSS class */
    className?: string;
    /** Enable subtle child transitions (opt-in) */
    animated?: boolean;
}
declare const _default: import("vue").DefineComponent<BaseStackProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BaseStackProps> & Readonly<{}>, {
    align: Align;
    direction: Direction;
    as: keyof HTMLElementTagNameMap;
    animated: boolean;
    wrap: boolean;
    justify: Justify;
    responsive: {
        sm?: Partial<Pick<BaseStackProps, "direction" | "spacing" | "align" | "justify">>;
        md?: Partial<Pick<BaseStackProps, "direction" | "spacing" | "align" | "justify">>;
        lg?: Partial<Pick<BaseStackProps, "direction" | "spacing" | "align" | "justify">>;
        xl?: Partial<Pick<BaseStackProps, "direction" | "spacing" | "align" | "justify">>;
    };
    className: string;
    spacing: PadToken | string;
    tag: keyof HTMLElementTagNameMap;
    divider: {
        color?: string;
        thickness?: string;
        style?: "solid" | "dashed" | "dotted";
    } | false;
    minItemSize: string;
    maxItems: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
