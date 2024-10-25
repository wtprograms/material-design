import { MaterialDesignComponent } from '../material-design.component';
import { OpenCloseState } from '../../common/rxjs/open-close';
import { SlotDirective } from '../../directives/slot.directive';
import * as i0 from "@angular/core";
export declare class DialogComponent extends MaterialDesignComponent {
    readonly returnValue: import("@angular/core").ModelSignal<string | undefined>;
    readonly open: import("@angular/core").ModelSignal<boolean>;
    readonly cancel: import("@angular/core").OutputEmitterRef<void>;
    private readonly _dialog;
    readonly iconSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly headlineSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly supportingtext: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly actionSlot: import("@angular/core").Signal<SlotDirective | undefined>;
    readonly bodySlot: import("@angular/core").Signal<SlotDirective | undefined>;
    private readonly _document;
    private readonly _openClose$;
    readonly state: import("@angular/core").Signal<OpenCloseState>;
    readonly stateChange: import("@angular/core").OutputEmitterRef<OpenCloseState>;
    constructor();
    private _nextClickIsFromContent;
    private _escapePressedWithoutCancel;
    onDialogCancel(event: Event): void;
    onDialogClose(): void;
    onDialogKeyDown(event: KeyboardEvent): void;
    onDialogClick(): void;
    onContainerContentClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DialogComponent, "md-dialog", never, { "returnValue": { "alias": "returnValue"; "required": false; "isSignal": true; }; "open": { "alias": "open"; "required": false; "isSignal": true; }; }, { "returnValue": "returnValueChange"; "open": "openChange"; "cancel": "cancel"; "stateChange": "stateChange"; }, never, never, true, never>;
}
