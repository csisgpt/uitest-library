// فقط تایپ؛ هیچ import اجرایی
import type * as Components from "../index";

declare module "vue" {
  export interface GlobalComponents {
    BaseBadge: typeof Components.BaseBadge;
    BaseButton: typeof Components.BaseButton;
    BaseCheckbox: typeof Components.BaseCheckbox;
    BaseFormField: typeof Components.BaseFormField;
    BaseImage: typeof Components.BaseImage;
    BaseIcon: typeof Components.BaseIcon;
    BaseInput: typeof Components.BaseInput;
    BaseLabel: typeof Components.BaseLabel;
    BaseModal: typeof Components.BaseModal;
    BaseSelect: typeof Components.BaseSelect;
    BaseRadio: typeof Components.BaseRadio;
    BaseSwitch: typeof Components.BaseSwitch;
    BaseTextarea: typeof Components.BaseTextarea;
    BaseToggleButton: typeof Components.BaseToggleButton;
    BaseTooltip: typeof Components.BaseTooltip;
    BaseSplitButton: typeof Components.BaseSplitButton;
    BaseSpeedDial: typeof Components.BaseSpeedDial;
    BaseSegment: typeof Components.BaseSegment;
    BaseAlert: typeof Components.BaseAlert;
    BaseActionSheet: typeof Components.BaseActionSheet;
    BaseTab: typeof Components.BaseTab;
    BaseStepper: typeof Components.BaseStepper;
    BasePopover: typeof Components.BasePopover;
    BaseContainer: typeof Components.BaseContainer;
    BaseFlex: typeof Components.BaseFlex;
    BaseGrid: typeof Components.BaseGrid;
    BaseGridItem: typeof Components.BaseGridItem;
    BaseSpacer: typeof Components.BaseSpacer;
    BaseStack: typeof Components.BaseStack;
    // هر کامپوننتی که واقعاً export می‌کنی را اضافه کن
  }
}
export {};
