import { Observable } from 'rxjs';

export function animateObservable(...animations: (() => Animation | undefined)[]) {
  return new Observable<void>((subscriber) => {
    if (animations.length === 0) {
      subscriber.next();
      subscriber.complete();
    }
    let abortController: AbortController | undefined =
      new AbortController();
    const _animations = animations.map((animation) => animation()).filter((x): x is Animation => !!x);
    for (const animation of _animations) {
      abortController.signal.addEventListener('abort', () =>
        animation.cancel()
      );
    }
    Promise.all(
      _animations.map((animation) => animation.finished.catch(() => {}))
    ).then(() => {
      abortController = undefined;
      subscriber.next();
      subscriber.complete();
    });
    return () => abortController?.abort();
  });
}