import { isPlatformServer } from '@angular/common';
import { DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';

export function observeIntersection(
  element: HTMLElement,
  options?: IntersectionObserverInit
) {
  const platfromId = inject(PLATFORM_ID);

  if (isPlatformServer(platfromId)) {
    return signal<IntersectionObserverEntry | undefined>(
      undefined
    ).asReadonly();
  }

  const destroyRef = inject(DestroyRef);
  const intersectionObserver = new IntersectionObserver((entries) => {
    _signal.set(entries[0]);
  }, options);
  intersectionObserver.observe(element);

  const _signal = signal<IntersectionObserverEntry | undefined>(
    intersectionObserver.takeRecords().find((entry) => entry.target === element)
  );

  destroyRef.onDestroy(() => intersectionObserver.disconnect());
  return _signal.asReadonly();
}
