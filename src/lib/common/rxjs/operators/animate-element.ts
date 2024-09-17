import { map, Observable, switchMap } from 'rxjs';
import { animateObservable } from '../animate-observable';

export function animateElement<T>(...animations: (() => Animation | undefined)[]) {
  return (source: Observable<T>) =>
    source.pipe(
      switchMap((value) =>
        animateObservable(...animations).pipe(map(() => value))
      )
    );
}
