import { Observable, tap } from 'rxjs';

export function tapIf<T>(predicate: (value: T) => boolean, callback: (value: T) => void) {
  return (source: Observable<T>) => source.pipe(
    tap(value => {
      if (predicate(value)) {
        callback(value);
      }
    }),
  );
}