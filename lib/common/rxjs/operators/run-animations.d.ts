import { Observable } from 'rxjs';
export declare function runAnimations<T>(...animations: (() => Animation | undefined)[]): (source: Observable<T>) => Observable<T>;
export declare function runAnimations<T>(abortController: AbortController, ...animations: (() => Animation | undefined)[]): (source: Observable<T>) => Observable<T>;
export declare function runAnimations<T>(abortControllerOrAnimation: AbortController | (() => Animation | undefined), ...animations: (() => Animation | undefined)[]): (source: Observable<T>) => Observable<T>;
