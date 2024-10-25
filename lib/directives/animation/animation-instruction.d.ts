import { Duration } from '../../common/motion/duration';
import { Easing } from '../../common/motion/easing';
export interface AnimationInstructionOptions {
    duration?: Duration | number;
    easing?: Easing | string;
    fill?: FillMode;
    iterations?: number;
    direction?: PlaybackDirection;
    delay?: Duration | number;
    endDelay?: Duration | number;
    composite?: CompositeOperation;
}
export interface AnimationInstruction {
    style?: Partial<CSSStyleDeclaration> | (() => Partial<CSSStyleDeclaration>);
    keyframes?: Keyframe[] | PropertyIndexedKeyframes | (() => Keyframe[] | PropertyIndexedKeyframes);
    options?: AnimationInstructionOptions | (() => AnimationInstructionOptions);
}
export declare function toKeyframeAnimationOptions(options?: AnimationInstructionOptions): KeyframeAnimationOptions;
