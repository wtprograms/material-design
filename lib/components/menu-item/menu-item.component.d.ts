import { ElementRef } from '@angular/core';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { MaterialDesignComponent } from '../material-design.component';
import { MenuComponent } from '../menu/menu.component';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
export declare class MenuItemComponent extends MaterialDesignComponent {
    readonly checkOnSelected: import("@angular/core").ModelSignal<boolean>;
    readonly disabled: import("@angular/core").ModelSignal<boolean>;
    readonly type: import("@angular/core").ModelSignal<FormSubmitterType>;
    readonly href: import("@angular/core").ModelSignal<string | undefined>;
    readonly anchorTarget: import("@angular/core").ModelSignal<string | undefined>;
    readonly name: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<string | undefined>;
    readonly selected: import("@angular/core").ModelSignal<boolean>;
    readonly leadingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly trailingSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly itemSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly button: import("@angular/core").Signal<ElementRef<HTMLButtonElement | HTMLAnchorElement> | undefined>;
    readonly subMenu: import("@angular/core").Signal<MenuComponent | undefined>;
    readonly dir: import("@angular/core").Signal<import("../../common/rxjs/text-direction").Direction>;
    readonly placement: import("@angular/core").Signal<"right-start" | "left-start">;
    constructor();
    onClick(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuItemComponent, "md-menu-item", never, { "checkOnSelected": { "alias": "checkOnSelected"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "href": { "alias": "href"; "required": false; "isSignal": true; }; "anchorTarget": { "alias": "anchorTarget"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "selected": { "alias": "selected"; "required": false; "isSignal": true; }; }, { "checkOnSelected": "checkOnSelectedChange"; "disabled": "disabledChange"; "type": "typeChange"; "href": "hrefChange"; "anchorTarget": "anchorTargetChange"; "name": "nameChange"; "value": "valueChange"; "selected": "selectedChange"; }, never, never, true, never>;
}
