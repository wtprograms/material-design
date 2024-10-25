import { ElementRef } from '@angular/core';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/forward-focus.directive";
export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard';
export declare class IconButtonComponent extends MaterialDesignComponent {
    readonly disabled: import("@angular/core").ModelSignal<boolean>;
    readonly type: import("@angular/core").ModelSignal<FormSubmitterType>;
    readonly href: import("@angular/core").ModelSignal<string | undefined>;
    readonly anchorTarget: import("@angular/core").ModelSignal<string | undefined>;
    readonly name: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<string | undefined>;
    readonly progressIndeterminate: import("@angular/core").ModelSignal<boolean>;
    readonly progressValue: import("@angular/core").ModelSignal<number>;
    readonly progressMax: import("@angular/core").ModelSignal<number>;
    readonly variant: import("@angular/core").ModelSignal<IconButtonVariant>;
    readonly selected: import("@angular/core").ModelSignal<boolean>;
    readonly custom: import("@angular/core").ModelSignal<boolean>;
    readonly badgeDot: import("@angular/core").ModelSignal<boolean>;
    readonly badgeNumber: import("@angular/core").ModelSignal<number | undefined>;
    readonly button: import("@angular/core").Signal<ElementRef<HTMLButtonElement | HTMLAnchorElement> | undefined>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<IconButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IconButtonComponent, "md-icon-button", never, { "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "href": { "alias": "href"; "required": false; "isSignal": true; }; "anchorTarget": { "alias": "anchorTarget"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "progressIndeterminate": { "alias": "progressIndeterminate"; "required": false; "isSignal": true; }; "progressValue": { "alias": "progressValue"; "required": false; "isSignal": true; }; "progressMax": { "alias": "progressMax"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "selected": { "alias": "selected"; "required": false; "isSignal": true; }; "custom": { "alias": "custom"; "required": false; "isSignal": true; }; "badgeDot": { "alias": "badgeDot"; "required": false; "isSignal": true; }; "badgeNumber": { "alias": "badgeNumber"; "required": false; "isSignal": true; }; }, { "disabled": "disabledChange"; "type": "typeChange"; "href": "hrefChange"; "anchorTarget": "anchorTargetChange"; "name": "nameChange"; "value": "valueChange"; "progressIndeterminate": "progressIndeterminateChange"; "progressValue": "progressValueChange"; "progressMax": "progressMaxChange"; "variant": "variantChange"; "selected": "selectedChange"; "custom": "customChange"; "badgeDot": "badgeDotChange"; "badgeNumber": "badgeNumberChange"; }, never, never, true, [{ directive: typeof i1.ForwardFocusDirective; inputs: {}; outputs: {}; }]>;
}
