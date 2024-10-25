import { AttachableDirective } from '../../directives/attachable.directive';
import { MaterialDesignComponent } from '../material-design.component';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/attachable.directive";
export declare class ElevationComponent extends MaterialDesignComponent {
    readonly level: import("@angular/core").ModelSignal<number>;
    readonly hoverable: import("@angular/core").ModelSignal<boolean>;
    readonly interactive: import("@angular/core").ModelSignal<boolean>;
    readonly dragging: import("@angular/core").ModelSignal<boolean>;
    readonly attachableDirective: AttachableDirective;
    readonly hovering: import("@angular/core").Signal<boolean | undefined>;
    readonly activated: import("@angular/core").Signal<boolean | undefined>;
    readonly levelVariable: import("@angular/core").Signal<string>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ElevationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ElevationComponent, "md-elevation", never, { "level": { "alias": "level"; "required": false; "isSignal": true; }; "hoverable": { "alias": "hoverable"; "required": false; "isSignal": true; }; "interactive": { "alias": "interactive"; "required": false; "isSignal": true; }; "dragging": { "alias": "dragging"; "required": false; "isSignal": true; }; }, { "level": "levelChange"; "hoverable": "hoverableChange"; "interactive": "interactiveChange"; "dragging": "draggingChange"; }, never, never, true, [{ directive: typeof i1.AttachableDirective; inputs: { "events": "events"; "for": "for"; "target": "target"; }; outputs: {}; }]>;
}
