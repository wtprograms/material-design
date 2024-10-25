import { ElementRef } from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/parent-activation.directive";
import * as i2 from "../../directives/forward-focus.directive";
export type ButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text' | 'plain';
export declare class ButtonComponent extends MaterialDesignComponent {
    readonly variant: import("@angular/core").ModelSignal<ButtonVariant>;
    readonly disabled: import("@angular/core").ModelSignal<boolean>;
    readonly type: import("@angular/core").ModelSignal<FormSubmitterType>;
    readonly href: import("@angular/core").ModelSignal<string | undefined>;
    readonly anchorTarget: import("@angular/core").ModelSignal<string | undefined>;
    readonly name: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<string | undefined>;
    readonly progressIndeterminate: import("@angular/core").ModelSignal<boolean>;
    readonly progressValue: import("@angular/core").ModelSignal<number>;
    readonly progressMax: import("@angular/core").ModelSignal<number>;
    readonly button: import("@angular/core").Signal<ElementRef<HTMLButtonElement | HTMLAnchorElement> | undefined>;
    readonly leadingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly trailingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly hasElevation: import("@angular/core").Signal<boolean>;
    readonly elevationLevel: import("@angular/core").Signal<0 | 1>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ButtonComponent, "md-button", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "href": { "alias": "href"; "required": false; "isSignal": true; }; "anchorTarget": { "alias": "anchorTarget"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "progressIndeterminate": { "alias": "progressIndeterminate"; "required": false; "isSignal": true; }; "progressValue": { "alias": "progressValue"; "required": false; "isSignal": true; }; "progressMax": { "alias": "progressMax"; "required": false; "isSignal": true; }; }, { "variant": "variantChange"; "disabled": "disabledChange"; "type": "typeChange"; "href": "hrefChange"; "anchorTarget": "anchorTargetChange"; "name": "nameChange"; "value": "valueChange"; "progressIndeterminate": "progressIndeterminateChange"; "progressValue": "progressValueChange"; "progressMax": "progressMaxChange"; }, never, never, true, [{ directive: typeof i1.ParentActivationDirective; inputs: {}; outputs: {}; }, { directive: typeof i2.ForwardFocusDirective; inputs: {}; outputs: {}; }]>;
}
