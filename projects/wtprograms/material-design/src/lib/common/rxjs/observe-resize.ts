import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';

export function observeResize$(element: HTMLElement, platformId: Object) {
  return new Observable<DOMRect>((subscriber) => {
    if (isPlatformServer(platformId)) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) =>
      subscriber.next(entries[0].contentRect)
    );
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  });
}
