import { map, Observable, switchMap } from 'rxjs';
import { startAnimations } from '../start-animations';

export function runAnimations<T>(
  ...animations: (() => Animation | undefined)[]
): (source: Observable<T>) => Observable<T>;
export function runAnimations<T>(
  abortController: AbortController,
  ...animations: (() => Animation | undefined)[]
): (source: Observable<T>) => Observable<T>;
export function runAnimations<T>(
  abortControllerOrAnimation: AbortController | (() => Animation | undefined),
  ...animations: (() => Animation | undefined)[]
): (source: Observable<T>) => Observable<T>;
export function runAnimations<T>(
  abortControllerOrAnimation: AbortController | (() => Animation | undefined),
  ...animations: (() => Animation | undefined)[]
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) =>
    source.pipe(
      switchMap((value) =>
        startAnimations(abortControllerOrAnimation, ...animations).pipe(
          map(() => value)
        )
      )
    );
}
