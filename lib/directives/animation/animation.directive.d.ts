import { OnDestroy, Signal } from '@angular/core';
import { Animator } from './animator';
import * as i0 from "@angular/core";
export declare class AnimationDirective implements OnDestroy {
    readonly mdAnimation: import("@angular/core").ModelSignal<string | undefined>;
    readonly mdAnimationAnimators: import("@angular/core").ModelSignal<Animator[]>;
    readonly mdAnimationState: import("@angular/core").ModelSignal<unknown>;
    private readonly _context;
    private readonly _hostElement;
    private readonly platformId;
    constructor();
    ngOnDestroy(): void;
    stop(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AnimationDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AnimationDirective, "[mdAnimation]", never, { "mdAnimation": { "alias": "mdAnimation"; "required": false; "isSignal": true; }; "mdAnimationAnimators": { "alias": "mdAnimationAnimators"; "required": false; "isSignal": true; }; "mdAnimationState": { "alias": "mdAnimationState"; "required": false; "isSignal": true; }; }, { "mdAnimation": "mdAnimationChange"; "mdAnimationAnimators": "mdAnimationAnimatorsChange"; "mdAnimationState": "mdAnimationStateChange"; }, never, never, true, never>;
}
export declare function animation(state: Signal<unknown>, animators: Animator[] | Signal<Animator[]>): AnimationDirective;
