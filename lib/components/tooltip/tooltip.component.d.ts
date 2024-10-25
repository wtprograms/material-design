import { MaterialDesignComponent } from '../material-design.component';
import { PopoverComponent, PopoverTrigger } from '../popover/popover.component';
import { Placement } from '@floating-ui/dom';
import { AttachableDirective } from '../../directives/attachable.directive';
import { Animator } from '../../directives/animation/animator';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/attachable.directive";
export type TooltipVariant = 'plain' | 'rich';
export declare class TooltipComponent extends MaterialDesignComponent {
    readonly variant: import("@angular/core").ModelSignal<TooltipVariant>;
    readonly placement: import("@angular/core").ModelSignal<Placement>;
    readonly trigger: import("@angular/core").ModelSignal<PopoverTrigger>;
    readonly offset: import("@angular/core").ModelSignal<number>;
    readonly manualClose: import("@angular/core").ModelSignal<boolean>;
    readonly popover: import("@angular/core").Signal<PopoverComponent | undefined>;
    readonly attachableDirective: AttachableDirective;
    readonly modal: import("@angular/core").ModelSignal<boolean>;
    readonly state: import("@angular/core").Signal<import("@wtprograms/material-design").OpenCloseState>;
    readonly headlineSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly actionSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly scrimAnimation: Animator[];
    constructor();
    openTooltip(): void;
    closeTooltip(): void;
    onActionClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TooltipComponent, "md-tooltip", never, { "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "placement": { "alias": "placement"; "required": false; "isSignal": true; }; "trigger": { "alias": "trigger"; "required": false; "isSignal": true; }; "offset": { "alias": "offset"; "required": false; "isSignal": true; }; "manualClose": { "alias": "manualClose"; "required": false; "isSignal": true; }; "modal": { "alias": "modal"; "required": false; "isSignal": true; }; }, { "variant": "variantChange"; "placement": "placementChange"; "trigger": "triggerChange"; "offset": "offsetChange"; "manualClose": "manualCloseChange"; "modal": "modalChange"; }, never, never, true, [{ directive: typeof i1.AttachableDirective; inputs: { "target": "target"; }; outputs: {}; }]>;
}
