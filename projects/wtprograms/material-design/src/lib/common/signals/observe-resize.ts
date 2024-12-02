import { Observable } from 'rxjs';
import { DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export function observeResize$(element: HTMLElement) {
  return new Observable<DOMRect>((observer) => {
    observer.next(element.getBoundingClientRect());
    const resizeObserver = new ResizeObserver((entries) =>
      observer.next(entries[0].contentRect)
    );
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  });
}


export function observeResize(element: HTMLElement) {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {
    return signal(undefined).asReadonly();
  }
  const destroyRef = inject(DestroyRef);
  const _signal = signal(element.getBoundingClientRect());

  const resizeObserver = new ResizeObserver((entries) =>
    _signal.set(entries[0].contentRect)
  );
  resizeObserver.observe(element);
  destroyRef.onDestroy(() => resizeObserver.disconnect());
  return _signal.asReadonly();
}
