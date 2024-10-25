import { ElementRef } from '@angular/core';
import { MaterialDesignComponent } from '../material-design.component';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
export declare class TabComponent extends MaterialDesignComponent {
    readonly secondary: import("@angular/core").ModelSignal<boolean>;
    readonly disabled: import("@angular/core").ModelSignal<boolean>;
    readonly href: import("@angular/core").ModelSignal<string | undefined>;
    readonly anchorTarget: import("@angular/core").ModelSignal<string | undefined>;
    readonly name: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<string | undefined>;
    readonly selected: import("@angular/core").ModelSignal<boolean>;
    readonly selected$: import("rxjs").Observable<boolean>;
    readonly labelSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    private readonly _label;
    readonly contentWidth: import("@angular/core").Signal<number>;
    readonly button: import("@angular/core").Signal<ElementRef<HTMLButtonElement | HTMLAnchorElement> | undefined>;
    click(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TabComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TabComponent, "md-tab", never, { "secondary": { "alias": "secondary"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "href": { "alias": "href"; "required": false; "isSignal": true; }; "anchorTarget": { "alias": "anchorTarget"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "selected": { "alias": "selected"; "required": false; "isSignal": true; }; }, { "secondary": "secondaryChange"; "disabled": "disabledChange"; "href": "hrefChange"; "anchorTarget": "anchorTargetChange"; "name": "nameChange"; "value": "valueChange"; "selected": "selectedChange"; }, never, never, true, never>;
}
