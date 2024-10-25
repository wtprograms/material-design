import { ElementRef, OnDestroy, Signal, Type } from '@angular/core';
import { MaterialDesignComponent } from '../components/material-design.component';
import * as i0 from "@angular/core";
export type TargetType = HTMLElement | ElementRef<HTMLElement> | undefined | MaterialDesignComponent;
export declare class AttachableDirective implements OnDestroy {
    readonly events: import("@angular/core").ModelSignal<string[]>;
    readonly target: import("@angular/core").ModelSignal<TargetType>;
    readonly for: import("@angular/core").ModelSignal<string | undefined>;
    readonly hostElement: HTMLElement;
    private readonly _forElement;
    readonly targetElement: Signal<HTMLElement | undefined>;
    readonly targetElement$: import("rxjs").Observable<HTMLElement | undefined>;
    get event$(): import("rxjs").Observable<Event>;
    private readonly _event$;
    readonly event: import("@angular/core").OutputRef<Event>;
    private _subscription?;
    constructor();
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AttachableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AttachableDirective, never, never, { "events": { "alias": "events"; "required": false; "isSignal": true; }; "target": { "alias": "target"; "required": false; "isSignal": true; }; "for": { "alias": "for"; "required": false; "isSignal": true; }; }, { "events": "eventsChange"; "target": "targetChange"; "for": "forChange"; "event": "event"; }, never, never, true, never>;
}
export declare function attachTarget<T extends AttachableDirective>(type: Type<T>, element: TargetType | Signal<TargetType>): T;
export declare function attach(...events: string[]): AttachableDirective;
