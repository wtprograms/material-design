import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/parent-activation.directive";
import * as i2 from "../../directives/forward-focus.directive";
export type CheckType = 'checkbox' | 'radio';
export declare class CheckComponent extends MaterialDesignValueAccessorComponent<boolean | undefined> {
    readonly type: import("@angular/core").ModelSignal<CheckType>;
    readonly switch: import("@angular/core").ModelSignal<boolean>;
    readonly supportingText: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<boolean | undefined>;
    private readonly _input;
    readonly uncheckedIconSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly checkedIconSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly labelSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly checked: import("@angular/core").Signal<boolean>;
    readonly indeterminate: import("@angular/core").Signal<boolean>;
    private readonly _checkboxIcon;
    private readonly _radioIcon;
    readonly icon: import("@angular/core").Signal<"check_box_outline_blank" | "check_box" | "indeterminate_check_box" | "radio_button_checked" | "radio_button_unchecked">;
    constructor();
    onInput(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CheckComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CheckComponent, "md-check", never, { "type": { "alias": "type"; "required": false; "isSignal": true; }; "switch": { "alias": "switch"; "required": false; "isSignal": true; }; "supportingText": { "alias": "supportingText"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; }, { "type": "typeChange"; "switch": "switchChange"; "supportingText": "supportingTextChange"; "value": "valueChange"; }, never, never, true, [{ directive: typeof i1.ParentActivationDirective; inputs: {}; outputs: {}; }, { directive: typeof i2.ForwardFocusDirective; inputs: {}; outputs: {}; }]>;
}
