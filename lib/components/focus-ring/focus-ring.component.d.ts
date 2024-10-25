import { AttachableDirective } from '../../directives/attachable.directive';
import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/attachable.directive";
export declare class FocusRingComponent extends MaterialDesignComponent {
    readonly focusVisible: import("@angular/core").ModelSignal<boolean>;
    readonly attachableDirective: AttachableDirective;
    readonly focused: import("@angular/core").Signal<boolean | undefined>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusRingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FocusRingComponent, "md-focus-ring", never, { "focusVisible": { "alias": "focusVisible"; "required": false; "isSignal": true; }; }, { "focusVisible": "focusVisibleChange"; }, never, never, true, [{ directive: typeof i1.AttachableDirective; inputs: { "events": "events"; "for": "for"; "target": "target"; }; outputs: {}; }]>;
}
