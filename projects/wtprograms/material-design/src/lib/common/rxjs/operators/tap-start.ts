import { Observable, of, switchMap, tap } from 'rxjs';

export function tapStart<T>(callback: () => void) {
  return (source: Observable<T>) =>
    of({}).pipe(
      tap(() => callback()),
      switchMap(() => source)
    );
}