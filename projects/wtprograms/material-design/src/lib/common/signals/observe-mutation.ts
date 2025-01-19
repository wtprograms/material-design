import {
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { observeMutation$ } from '../rxjs/observe-mutation';

export function observeMutation(
  options?: MutationObserverInit,
  element?: HTMLElement
) {
  const platformId = inject(PLATFORM_ID);
  const destroyRef = inject(DestroyRef);
  element ??= inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  return toSignal(
    observeMutation$(element, platformId, options).pipe(
      takeUntilDestroyed(destroyRef)
    )
  );
}
