import { MaterialDesignComponent } from '../material-design.component';
import { AnimationTriggers } from '../../directives/animation/animation-context.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../directives/animation/animation-context.directive";
export declare class SnackBarComponent extends MaterialDesignComponent {
    readonly multiline: import("@angular/core").ModelSignal<boolean>;
    readonly closeButton: import("@angular/core").ModelSignal<boolean>;
    readonly open: import("@angular/core").ModelSignal<boolean>;
    readonly autoDissmissTimeout: import("@angular/core").ModelSignal<number>;
    readonly actionSlot: import("@angular/core").Signal<import("@wtprograms/material-design").SlotDirective | undefined>;
    readonly animationTriggers: AnimationTriggers;
    private readonly _platformId;
    private readonly _closing$;
    private readonly _openClose;
    readonly state: import("@angular/core").Signal<import("../../common/rxjs/open-close").OpenCloseState | undefined>;
    constructor();
    onActionClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SnackBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SnackBarComponent, "md-snack-bar", never, { "multiline": { "alias": "multiline"; "required": false; "isSignal": true; }; "closeButton": { "alias": "closeButton"; "required": false; "isSignal": true; }; "open": { "alias": "open"; "required": false; "isSignal": true; }; "autoDissmissTimeout": { "alias": "autoDissmissTimeout"; "required": false; "isSignal": true; }; }, { "multiline": "multilineChange"; "closeButton": "closeButtonChange"; "open": "openChange"; "autoDissmissTimeout": "autoDissmissTimeoutChange"; }, never, never, true, [{ directive: typeof i1.AnimationContextDirective; inputs: {}; outputs: {}; }]>;
}
