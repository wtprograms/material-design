import { isPlatformServer } from '@angular/common';
import { Subject } from 'rxjs';

export function observeMutation$(
  element: HTMLElement,
  platformId: Object,
  options?: MutationObserverInit
) {
  const subject = new Subject<MutationRecord[]>();
  if (isPlatformServer(platformId)) {
    const mutationObserver = new MutationObserver((mutations) =>
      subject.next(mutations)
    );
    mutationObserver.observe(element, options);
  }
  return subject.asObservable();
}
