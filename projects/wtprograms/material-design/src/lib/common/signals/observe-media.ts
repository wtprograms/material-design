import { DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { observeMedia$ } from '../rxjs/observe-media';

export function observeMedia(query: string) {
  const platformId = inject(PLATFORM_ID);
  const destroyRef = inject(DestroyRef);
  return toSignal(observeMedia$(platformId, query).pipe(
    takeUntilDestroyed(destroyRef)
  ));
}
