import { ElementRef } from '@angular/core';
import { MaterialDesignValueAccessorComponent } from '../material-design-value-accessor.component';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/parent-activation.directive";
import * as i2 from "../../directives/forward-focus.directive";
export type SegmentedButtonType = 'button' | 'checkbox' | 'radio';
export declare class SegmentedButtonComponent extends MaterialDesignValueAccessorComponent<boolean> {
    readonly selected: import("@angular/core").ModelSignal<boolean>;
    readonly type: import("@angular/core").ModelSignal<SegmentedButtonType>;
    readonly name: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<boolean | undefined>;
    readonly badgeDot: import("@angular/core").ModelSignal<boolean>;
    readonly badgeNumber: import("@angular/core").ModelSignal<number | undefined>;
    readonly checkOnSelected: import("@angular/core").ModelSignal<boolean>;
    readonly checked: import("@angular/core").Signal<boolean>;
    readonly selectedOrChecked: import("@angular/core").Signal<boolean>;
    readonly leadingSlot: import("@angular/core").Signal<import("@wtprograms/material-design").SlotDirective | undefined>;
    readonly trailingSlot: import("@angular/core").Signal<import("@wtprograms/material-design").SlotDirective | undefined>;
    private readonly _button;
    private readonly _input;
    readonly input: import("@angular/core").Signal<ElementRef<HTMLInputElement> | ElementRef<HTMLButtonElement> | undefined>;
    constructor();
    onInput(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SegmentedButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SegmentedButtonComponent, "md-segmented-button", never, { "selected": { "alias": "selected"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "badgeDot": { "alias": "badgeDot"; "required": false; "isSignal": true; }; "badgeNumber": { "alias": "badgeNumber"; "required": false; "isSignal": true; }; "checkOnSelected": { "alias": "checkOnSelected"; "required": false; "isSignal": true; }; }, { "selected": "selectedChange"; "type": "typeChange"; "name": "nameChange"; "value": "valueChange"; "badgeDot": "badgeDotChange"; "badgeNumber": "badgeNumberChange"; "checkOnSelected": "checkOnSelectedChange"; }, never, never, true, [{ directive: typeof i1.ParentActivationDirective; inputs: {}; outputs: {}; }, { directive: typeof i2.ForwardFocusDirective; inputs: {}; outputs: {}; }]>;
}
