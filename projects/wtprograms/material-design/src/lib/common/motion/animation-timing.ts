import { Duration, durationToString } from './duration';
import { Easing, easingToFunction } from './easing';

export function animationTiming(
  duration: Duration | number = 'short4',
  easing: Easing = 'standard',
  delay: Duration | number = 0,
): string {
  return `${durationToString(duration)} ${durationToString(delay)} ${easingToFunction(easing)}`;
}
