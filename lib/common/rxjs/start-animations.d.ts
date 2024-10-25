import { Observable } from 'rxjs';
export declare function startAnimations(...animations: (() => Animation | undefined)[]): Observable<void>;
export declare function startAnimations(abortController: AbortController, ...animations: (() => Animation | undefined)[]): Observable<void>;
export declare function startAnimations(abortControllerOrAnimation: AbortController | (() => Animation | undefined), ...animations: (() => Animation | undefined)[]): Observable<void>;
