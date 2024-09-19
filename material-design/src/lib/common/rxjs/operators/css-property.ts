import { Observable, tap } from 'rxjs';

export function cssProperty<T>(
  element: HTMLElement,
  key: string
) {
  return (source: Observable<T>) =>
    source.pipe(
      tap((value) => {
        if (!!value) {
          element.style.setProperty(key, value.toString());
        } else {
          element.style.removeProperty(key);
        }
      })
    );
}
