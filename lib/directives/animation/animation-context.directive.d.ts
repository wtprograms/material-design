import { OnDestroy, Signal } from '@angular/core';
import { Animator } from './animator';
import * as i0 from "@angular/core";
export type AnimationTriggers = Record<string, Animator[]>;
export declare class AnimationContextDirective implements OnDestroy {
    readonly animationTriggers: import("@angular/core").ModelSignal<AnimationTriggers>;
    ngOnDestroy(): void;
    stop(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AnimationContextDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AnimationContextDirective, "[mdAnimationContext]", never, { "animationTriggers": { "alias": "animationTriggers"; "required": false; "isSignal": true; }; }, { "animationTriggers": "animationTriggersChange"; }, never, never, true, never>;
}
export declare function animationContext(triggers: AnimationTriggers | Signal<AnimationTriggers>): AnimationContextDirective;
