import { ElementRef } from '@angular/core';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { MaterialDesignComponent } from '../material-design.component';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/forward-focus.directive";
export type FabPalette = 'surface' | 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning' | 'success';
export type FabSize = 'small' | 'medium' | 'large';
export declare class FabComponent extends MaterialDesignComponent {
    readonly palette: import("@angular/core").ModelSignal<FabPalette>;
    readonly size: import("@angular/core").ModelSignal<FabSize>;
    readonly lowered: import("@angular/core").ModelSignal<boolean>;
    readonly disabled: import("@angular/core").ModelSignal<boolean>;
    readonly type: import("@angular/core").ModelSignal<FormSubmitterType>;
    readonly href: import("@angular/core").ModelSignal<string | undefined>;
    readonly anchorTarget: import("@angular/core").ModelSignal<string | undefined>;
    readonly name: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<string | undefined>;
    readonly extended: import("@angular/core").ModelSignal<boolean>;
    readonly iconSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly labelSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly button: import("@angular/core").Signal<ElementRef<HTMLButtonElement | HTMLAnchorElement> | undefined>;
    readonly elevationLevel: import("@angular/core").Signal<1 | 3>;
    private readonly _openClose$;
    readonly state: import("@angular/core").Signal<import("../../common/rxjs/open-close").OpenCloseState>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<FabComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FabComponent, "md-fab", never, { "palette": { "alias": "palette"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "lowered": { "alias": "lowered"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "href": { "alias": "href"; "required": false; "isSignal": true; }; "anchorTarget": { "alias": "anchorTarget"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "extended": { "alias": "extended"; "required": false; "isSignal": true; }; }, { "palette": "paletteChange"; "size": "sizeChange"; "lowered": "loweredChange"; "disabled": "disabledChange"; "type": "typeChange"; "href": "hrefChange"; "anchorTarget": "anchorTargetChange"; "name": "nameChange"; "value": "valueChange"; "extended": "extendedChange"; }, never, never, true, [{ directive: typeof i1.ForwardFocusDirective; inputs: {}; outputs: {}; }]>;
}
