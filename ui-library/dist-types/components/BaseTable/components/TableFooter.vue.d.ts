import type { Column, SummaryMethodParams } from "../types";
type __VLS_Props = {
    columns: Column[];
    data: any[];
    summaryMethod?: (params: SummaryMethodParams) => any[];
    selectable?: boolean;
    hasActions?: boolean;
    sumText?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
