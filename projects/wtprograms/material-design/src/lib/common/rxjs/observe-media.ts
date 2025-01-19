import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';

export function observeMedia$(platformId: Object, query: string) {
  return new Observable<boolean>((subscriber) => {
    if (isPlatformServer(platformId)) {
      return;
    }
    const mediaQuery = window.matchMedia(query);
    const listener = () => subscriber.next(mediaQuery.matches);
    mediaQuery.addEventListener('change', listener);
    listener();
    return mediaQuery.removeEventListener('change', listener);
  });
}
