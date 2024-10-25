import { Duration, durationToMilliseconds } from '../../common/motion/duration';
import { Easing, easingToFunction } from '../../common/motion/easing';

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
  keyframes?:
    | Keyframe[]
    | PropertyIndexedKeyframes
    | (() => Keyframe[] | PropertyIndexedKeyframes);
  options?: AnimationInstructionOptions | (() => AnimationInstructionOptions);
}

export function toKeyframeAnimationOptions(
  options?: AnimationInstructionOptions
): KeyframeAnimationOptions {
  if (!options) {
    return {};
  }
  options.easing ??= 'standard';
  options.duration ??= 'short4';
  options.fill ??= 'forwards';
  return {
    duration: durationToMilliseconds(options.duration),
    easing: easingToFunction(options.easing),
    fill: options.fill,
    iterations: options.iterations,
    direction: options.direction,
    delay: durationToMilliseconds(options.delay),
    endDelay: durationToMilliseconds(options.endDelay),
    composite: options.composite,
  };
}
