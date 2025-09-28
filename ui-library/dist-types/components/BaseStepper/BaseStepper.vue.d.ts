export interface StepItem {
    label?: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
    completed?: boolean;
    error?: boolean;
    optional?: boolean;
}
export interface StepperProps {
    steps: StepItem[];
    modelValue?: number;
    linear?: boolean;
    variant?: "horizontal" | "vertical";
    size?: "small" | "medium" | "large";
    showControls?: boolean;
    showIndicators?: boolean;
    showProgressBar?: boolean;
    showStepHeaders?: boolean;
    headerNavigation?: boolean;
    headerLabel?: string;
    headerConnectors?: boolean;
    allowStepValidation?: boolean;
    iconSize?: number;
    nextLabel?: string;
    backLabel?: string;
    finishLabel?: string;
    readonly?: boolean;
    disabled?: boolean;
}
declare const _default: import("vue").DefineComponent<StepperProps, {
    goNext: () => Promise<void>;
    goBack: () => Promise<void>;
    navigateToStep: (i: number) => Promise<void>;
    finish: () => void;
    markStepCompleted: (i: number) => Set<number> & Omit<Set<number>, keyof Set<any>>;
    markStepIncomplete: (i: number) => boolean;
    resetStepper: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: number) => any;
    "step-change": (payload: {
        from: number;
        to: number;
        step: StepItem;
    }) => any;
    "before-step-change": (payload: {
        from: number;
        to: number;
        step: StepItem;
    }) => any;
    "step-complete": (payload: {
        index: number;
        step: StepItem;
    }) => any;
    finish: (payload: {
        completedSteps: number[];
    }) => any;
    back: (payload: {
        from: number;
        to: number;
    }) => any;
    next: (payload: {
        from: number;
        to: number;
    }) => any;
}, string, import("vue").PublicProps, Readonly<StepperProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: number) => any) | undefined;
    "onStep-change"?: ((payload: {
        from: number;
        to: number;
        step: StepItem;
    }) => any) | undefined;
    "onBefore-step-change"?: ((payload: {
        from: number;
        to: number;
        step: StepItem;
    }) => any) | undefined;
    "onStep-complete"?: ((payload: {
        index: number;
        step: StepItem;
    }) => any) | undefined;
    onFinish?: ((payload: {
        completedSteps: number[];
    }) => any) | undefined;
    onBack?: ((payload: {
        from: number;
        to: number;
    }) => any) | undefined;
    onNext?: ((payload: {
        from: number;
        to: number;
    }) => any) | undefined;
}>, {
    variant: "horizontal" | "vertical";
    size: "small" | "medium" | "large";
    disabled: boolean;
    modelValue: number;
    readonly: boolean;
    linear: boolean;
    showControls: boolean;
    showIndicators: boolean;
    showProgressBar: boolean;
    showStepHeaders: boolean;
    headerNavigation: boolean;
    headerLabel: string;
    headerConnectors: boolean;
    allowStepValidation: boolean;
    iconSize: number;
    nextLabel: string;
    backLabel: string;
    finishLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
