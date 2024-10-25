import { Observable } from 'rxjs';
export declare function tapStart<T>(callback: () => void): (source: Observable<T>) => Observable<T>;
