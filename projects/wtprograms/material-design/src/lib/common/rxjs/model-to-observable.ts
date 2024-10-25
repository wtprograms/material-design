import { ModelSignal } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';

export function modelToObservable<T>(signal: ModelSignal<T>): Observable<T> {
  const subject = new BehaviorSubject<T>(signal());
  const outputRef = signal.subscribe((x) => subject.next(x));
  return subject.asObservable().pipe(finalize(() => outputRef.unsubscribe()));
}
