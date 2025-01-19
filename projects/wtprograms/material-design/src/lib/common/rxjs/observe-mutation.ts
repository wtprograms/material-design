import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';

export function observeMutation$(
  element: HTMLElement,
  platformId: Object,
  options?: MutationObserverInit
) {
  return new Observable<MutationRecord[]>((subscriber) => {
    if (isPlatformServer(platformId)) {
      return;
    }
    const mutationObserver = new MutationObserver((mutations) =>
      subscriber.next(mutations)
    );
    mutationObserver.observe(element, options);
    return () => mutationObserver.disconnect();
  });
}
