import { inject, isSignal, PLATFORM_ID, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  delay,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { Duration, durationToMilliseconds } from '../motion/duration';
import { isPlatformServer } from '@angular/common';

export type OpenCloseState = 'closed' | 'opening' | 'opened' | 'closing';

export function openClose(
  trigger: Observable<boolean> | Signal<boolean>,
  openDelay: Duration | number = 'short4',
  closeDelay?: Duration | number
): Observable<OpenCloseState> {
  closeDelay = closeDelay ?? openDelay;
  let lastState: OpenCloseState = 'closed';
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {
    return of(lastState);
  }
  if (isSignal(trigger)) {
    trigger = toObservable(trigger);
  }
  const cancelTimer = new Subject<void>();
  return trigger.pipe(
    switchMap((open) => {
      if (!open && lastState === 'opening') {
        cancelTimer.next();
        lastState = 'opened';
      }
      if (open && lastState === 'closing') {
        cancelTimer.next();
        lastState = 'closed';
      }
      if (open && lastState === 'closed') {
        return merge(
          of('opening' as OpenCloseState),
          of('opened' as OpenCloseState).pipe(
            delay(durationToMilliseconds(openDelay)),
            takeUntil(cancelTimer)
          )
        );
      }
      if (!open && lastState === 'opened') {
        return merge(
          of('closing' as OpenCloseState),
          of('closed' as OpenCloseState).pipe(
            delay(durationToMilliseconds(closeDelay)),
            takeUntil(cancelTimer)
          )
        );
      }
      return of(lastState);
    }),
    tap((state) => (lastState = state))
  );
}
