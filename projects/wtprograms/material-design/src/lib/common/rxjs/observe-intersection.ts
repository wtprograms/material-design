import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';

export function observeIntersection$(
  element: HTMLElement,
  platformId: Object,
  options?: IntersectionObserverInit
) {
  return new Observable<IntersectionObserverEntry[]>((subscriber) => {
    if (isPlatformServer(platformId)) {
      return;
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
      subscriber.next(entries);
    }, options);
    intersectionObserver.observe(element);

    subscriber.next(
      intersectionObserver
        .takeRecords()
        .filter((entry) => entry.target === element)
    );
    return () => intersectionObserver.disconnect();
  });
}
