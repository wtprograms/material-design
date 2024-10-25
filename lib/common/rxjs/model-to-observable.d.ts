import { ModelSignal } from '@angular/core';
import { Observable } from 'rxjs';
export declare function modelToObservable<T>(signal: ModelSignal<T>): Observable<T>;
