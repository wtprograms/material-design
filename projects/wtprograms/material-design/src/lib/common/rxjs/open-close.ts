import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  filter,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { Duration, durationToMilliseconds } from '../motion/duration';
import { DestroyRef, inject, isSignal, Signal } from '@angular/core';

export type OpenCloseState = 'closed' | 'init-opening' | 'opening' | 'opened' | 'init-closing' | 'closing';

export function openClose(
  openTrigger: Observable<boolean> | Signal<boolean>,
  openingDelay: Duration | number = 'short4',
  closingDelay?: Duration | number
) {
  closingDelay ??= openingDelay;
  const destroyRef = inject(DestroyRef);
  const _cancelTimer = new Subject<void>();
  let lastState: OpenCloseState = 'closed';
  if (isSignal(openTrigger)) {
    openTrigger = toObservable(openTrigger);
  }
  return openTrigger.pipe(
    takeUntilDestroyed(destroyRef),
    switchMap((open) => {
      let state = lastState;
      if (!open && state === 'opening') {
        _cancelTimer.next();
        state = 'opened';
      }
      if (open && state === 'closing') {
        _cancelTimer.next();
        state = 'closed';
      }

      if (open && state === 'closed') {
        return merge(
          of<OpenCloseState>('opening'),
          timer(durationToMilliseconds(openingDelay) ?? 50).pipe(
            takeUntilDestroyed(destroyRef),
            takeUntil(_cancelTimer),
            map((): OpenCloseState => 'opened')
          )
        );
      }
      if (!open && state === 'opened') {
        return merge(
          of<OpenCloseState>('closing'),
          timer(durationToMilliseconds(closingDelay) ?? 50).pipe(
            takeUntilDestroyed(destroyRef),
            takeUntil(_cancelTimer),
            map((): OpenCloseState => 'closed')
          )
        );
      }
      return of({});
    }),
    filter((state): state is OpenCloseState => typeof state === 'string'),
    tap((state) => (lastState = state))
  );
}
