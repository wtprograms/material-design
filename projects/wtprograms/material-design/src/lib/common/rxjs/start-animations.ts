import { Observable } from 'rxjs';

export function startAnimations(
  ...animations: (() => Animation | undefined)[]
): Observable<void>;
export function startAnimations(
  abortController: AbortController,
  ...animations: (() => Animation | undefined)[]
): Observable<void>;
export function startAnimations(
  abortControllerOrAnimation: AbortController | (() => Animation | undefined),
  ...animations: (() => Animation | undefined)[]
): Observable<void>;
export function startAnimations(
  abortControllerOrAnimation: AbortController | (() => Animation | undefined),
  ...animations: (() => Animation | undefined)[]
): Observable<void> {
  return new Observable<void>((subscriber) => {
    let abortController: AbortController | undefined = undefined;
    if (abortControllerOrAnimation instanceof AbortController) {
      abortController = abortControllerOrAnimation;
    } else {
      abortController = new AbortController();
      animations.unshift(abortControllerOrAnimation);
    }

    if (animations.length === 0) {
      subscriber.next();
      subscriber.complete();
    }
    const _animations = animations
      .map((animation) => animation())
      .filter((x): x is Animation => !!x);
    for (const animation of _animations) {
      abortController.signal.addEventListener('abort', () =>
        animation.cancel()
      );
    }
    Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      _animations.map((animation) => animation.finished.catch(() => {}))
    ).then(() => {
      abortController = undefined;
      subscriber.next();
      subscriber.complete();
    });
  });
}
