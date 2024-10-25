import { MaterialDesignComponent } from '../material-design.component';
import { PopoverComponent, PopoverTrigger } from '../popover/popover.component';
import { Placement } from '@floating-ui/dom';
import { AttachableDirective } from '../../directives/attachable.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/attachable.directive";
export declare class MenuComponent extends MaterialDesignComponent {
    readonly placement: import("@angular/core").ModelSignal<Placement>;
    readonly trigger: import("@angular/core").ModelSignal<PopoverTrigger>;
    readonly offset: import("@angular/core").ModelSignal<number>;
    readonly popover: import("@angular/core").Signal<PopoverComponent | undefined>;
    readonly attachableDirective: AttachableDirective;
    readonly useContainerWidth: import("@angular/core").ModelSignal<boolean>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuComponent, "md-menu", never, { "placement": { "alias": "placement"; "required": false; "isSignal": true; }; "trigger": { "alias": "trigger"; "required": false; "isSignal": true; }; "offset": { "alias": "offset"; "required": false; "isSignal": true; }; "useContainerWidth": { "alias": "useContainerWidth"; "required": false; "isSignal": true; }; }, { "placement": "placementChange"; "trigger": "triggerChange"; "offset": "offsetChange"; "useContainerWidth": "useContainerWidthChange"; }, never, never, true, [{ directive: typeof i1.AttachableDirective; inputs: { "target": "target"; }; outputs: {}; }]>;
}
