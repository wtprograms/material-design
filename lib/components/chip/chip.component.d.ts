import { ElementRef } from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
export declare class ChipComponent extends MaterialDesignComponent {
    readonly closable: import("@angular/core").ModelSignal<boolean>;
    readonly pill: import("@angular/core").ModelSignal<boolean>;
    readonly disabled: import("@angular/core").ModelSignal<boolean>;
    readonly selected: import("@angular/core").ModelSignal<boolean>;
    readonly href: import("@angular/core").ModelSignal<string | undefined>;
    readonly anchorTarget: import("@angular/core").ModelSignal<string | undefined>;
    readonly name: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<string | undefined>;
    readonly close: import("@angular/core").OutputEmitterRef<void>;
    readonly leadingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly trailingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly button: import("@angular/core").Signal<ElementRef<HTMLButtonElement | HTMLAnchorElement> | undefined>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ChipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChipComponent, "md-chip", never, { "closable": { "alias": "closable"; "required": false; "isSignal": true; }; "pill": { "alias": "pill"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "selected": { "alias": "selected"; "required": false; "isSignal": true; }; "href": { "alias": "href"; "required": false; "isSignal": true; }; "anchorTarget": { "alias": "anchorTarget"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; }, { "closable": "closableChange"; "pill": "pillChange"; "disabled": "disabledChange"; "selected": "selectedChange"; "href": "hrefChange"; "anchorTarget": "anchorTargetChange"; "name": "nameChange"; "value": "valueChange"; "close": "close"; }, never, never, true, never>;
}
