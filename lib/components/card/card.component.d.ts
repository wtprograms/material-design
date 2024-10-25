import { ElementRef } from '@angular/core';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { MaterialDesignComponent } from '../material-design.component';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
export type CardVariant = 'elevated' | 'filled' | 'outlined';
export declare class CardComponent extends MaterialDesignComponent {
    readonly variant: import("@angular/core").ModelSignal<CardVariant>;
    readonly disabled: import("@angular/core").ModelSignal<boolean>;
    readonly type: import("@angular/core").ModelSignal<FormSubmitterType | undefined>;
    readonly href: import("@angular/core").ModelSignal<string | undefined>;
    readonly anchorTarget: import("@angular/core").ModelSignal<string | undefined>;
    readonly name: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<string | undefined>;
    readonly progressIndeterminate: import("@angular/core").ModelSignal<boolean>;
    readonly progressValue: import("@angular/core").ModelSignal<number>;
    readonly progressMax: import("@angular/core").ModelSignal<number>;
    readonly progressBuffer: import("@angular/core").ModelSignal<number>;
    readonly leadingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly trailingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly button: import("@angular/core").Signal<ElementRef<HTMLButtonElement | HTMLAnchorElement> | undefined>;
    readonly hasElevation: import("@angular/core").Signal<boolean>;
    readonly elevationLevel: import("@angular/core").Signal<0 | 1>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CardComponent, "md-card", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "href": { "alias": "href"; "required": false; "isSignal": true; }; "anchorTarget": { "alias": "anchorTarget"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "progressIndeterminate": { "alias": "progressIndeterminate"; "required": false; "isSignal": true; }; "progressValue": { "alias": "progressValue"; "required": false; "isSignal": true; }; "progressMax": { "alias": "progressMax"; "required": false; "isSignal": true; }; "progressBuffer": { "alias": "progressBuffer"; "required": false; "isSignal": true; }; }, { "variant": "variantChange"; "disabled": "disabledChange"; "type": "typeChange"; "href": "hrefChange"; "anchorTarget": "anchorTargetChange"; "name": "nameChange"; "value": "valueChange"; "progressIndeterminate": "progressIndeterminateChange"; "progressValue": "progressValueChange"; "progressMax": "progressMaxChange"; "progressBuffer": "progressBufferChange"; }, never, never, true, never>;
}
