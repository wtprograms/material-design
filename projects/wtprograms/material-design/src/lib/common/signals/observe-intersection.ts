import { DestroyRef, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { observeIntersection$ } from '../rxjs/observe-intersection';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

export function observeIntersection(
  options?: IntersectionObserverInit,
  element?: HTMLElement
) {
  const platformId = inject(PLATFORM_ID);
  const destroyRef = inject(DestroyRef);
  element ??= inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  return toSignal(
    observeIntersection$(element, platformId, options).pipe(
      takeUntilDestroyed(destroyRef)
    )
  );
}
