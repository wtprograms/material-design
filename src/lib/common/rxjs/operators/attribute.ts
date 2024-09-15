import { Observable, tap } from 'rxjs';

export function attribute<T>(element: HTMLElement, key: string) {
  return (source: Observable<T>) =>
    source.pipe(
      tap((value) => {
        if (!!value) {
          if (typeof value === 'boolean') {
            element.setAttribute(key, '');
          } else {
            element.setAttribute(key, value.toString());
          }
        } else {
          element.removeAttribute(key);
        }
      })
    );
}
