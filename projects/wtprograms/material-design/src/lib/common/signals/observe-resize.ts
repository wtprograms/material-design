import {
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { observeResize$ } from '../rxjs/observe-resize';

export function observeResize(element?: HTMLElement) {
  const platformId = inject(PLATFORM_ID);
  const destroyRef = inject(DestroyRef);
  element ??= inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  return toSignal(
    observeResize$(element, platformId).pipe(takeUntilDestroyed(destroyRef))
  );
}
