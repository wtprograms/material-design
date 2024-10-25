import { ElementRef } from '@angular/core';
import { FormSubmitterType } from '../../common/forms/form-submitted-type';
import { MaterialDesignComponent } from '../material-design.component';
import { NavigationLayout, NavigationComponent } from '../navigation/navigation.component';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
export declare class NavigationItemComponent extends MaterialDesignComponent {
    readonly selected: import("@angular/core").ModelSignal<boolean>;
    readonly custom: import("@angular/core").ModelSignal<boolean>;
    readonly layout: import("@angular/core").ModelSignal<NavigationLayout>;
    readonly disabled: import("@angular/core").ModelSignal<boolean>;
    readonly type: import("@angular/core").ModelSignal<FormSubmitterType>;
    readonly href: import("@angular/core").ModelSignal<string | undefined>;
    readonly anchorTarget: import("@angular/core").ModelSignal<string | undefined>;
    readonly name: import("@angular/core").ModelSignal<string | undefined>;
    readonly value: import("@angular/core").ModelSignal<string | undefined>;
    readonly progressIndeterminate: import("@angular/core").ModelSignal<boolean>;
    readonly progressValue: import("@angular/core").ModelSignal<number>;
    readonly progressMax: import("@angular/core").ModelSignal<number>;
    readonly badgeDot: import("@angular/core").ModelSignal<boolean>;
    readonly badgeNumber: import("@angular/core").ModelSignal<number | undefined>;
    readonly labelSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly iconSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly button: import("@angular/core").Signal<ElementRef<HTMLButtonElement | HTMLAnchorElement> | undefined>;
    readonly _parent: NavigationComponent | null;
    readonly parentLayout: import("@angular/core").Signal<NavigationLayout>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavigationItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NavigationItemComponent, "md-navigation-item", never, { "selected": { "alias": "selected"; "required": false; "isSignal": true; }; "custom": { "alias": "custom"; "required": false; "isSignal": true; }; "layout": { "alias": "layout"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "type": { "alias": "type"; "required": false; "isSignal": true; }; "href": { "alias": "href"; "required": false; "isSignal": true; }; "anchorTarget": { "alias": "anchorTarget"; "required": false; "isSignal": true; }; "name": { "alias": "name"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "progressIndeterminate": { "alias": "progressIndeterminate"; "required": false; "isSignal": true; }; "progressValue": { "alias": "progressValue"; "required": false; "isSignal": true; }; "progressMax": { "alias": "progressMax"; "required": false; "isSignal": true; }; "badgeDot": { "alias": "badgeDot"; "required": false; "isSignal": true; }; "badgeNumber": { "alias": "badgeNumber"; "required": false; "isSignal": true; }; }, { "selected": "selectedChange"; "custom": "customChange"; "layout": "layoutChange"; "disabled": "disabledChange"; "type": "typeChange"; "href": "hrefChange"; "anchorTarget": "anchorTargetChange"; "name": "nameChange"; "value": "valueChange"; "progressIndeterminate": "progressIndeterminateChange"; "progressValue": "progressValueChange"; "progressMax": "progressMaxChange"; "badgeDot": "badgeDotChange"; "badgeNumber": "badgeNumberChange"; }, never, never, true, never>;
}
