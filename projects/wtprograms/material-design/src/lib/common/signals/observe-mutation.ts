import { DestroyRef, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';

export function observeMutation(element: HTMLElement, options?: MutationObserverInit) {
  const _signal = signal<MutationRecord[]>([]);
  const mutationObserver = new MutationObserver((mutations) => _signal.set(mutations));
  mutationObserver.observe(element, options);
  const destroyRef = inject(DestroyRef);
  destroyRef.onDestroy(() => mutationObserver.disconnect());
  return _signal.asReadonly();
}

export function observeMutation$(element: HTMLElement, options?: MutationObserverInit) {
  const subject = new Subject<MutationRecord[]>();
  const mutationObserver = new MutationObserver((mutations) => subject.next(mutations));
  mutationObserver.observe(element, options);
  return subject.asObservable();
}

