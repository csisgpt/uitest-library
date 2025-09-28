export interface BaseFlexProps {
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    wrap?: "nowrap" | "wrap" | "wrap-reverse";
    align?: "start" | "center" | "end" | "baseline" | "stretch";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | string;
    rowGap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    columnGap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    grow?: boolean;
    shrink?: boolean;
    basis?: "auto" | "full" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4" | string;
    inline?: boolean;
    as?: string;
    customGap?: string;
    responsive?: Record<string, any>;
}
declare const _default: import("vue").DefineComponent<BaseFlexProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BaseFlexProps> & Readonly<{}>, {
    align: "start" | "center" | "end" | "baseline" | "stretch";
    inline: boolean;
    direction: "row" | "column" | "row-reverse" | "column-reverse";
    as: string;
    columnGap: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    rowGap: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    gap: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | string;
    wrap: "nowrap" | "wrap" | "wrap-reverse";
    justify: "start" | "center" | "end" | "between" | "around" | "evenly";
    grow: boolean;
    shrink: boolean;
    basis: "auto" | "full" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4" | string;
    customGap: string;
    responsive: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
