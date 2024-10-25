import { Observable } from 'rxjs';
import { Duration } from '../motion/duration';
import { Signal } from '@angular/core';
export type OpenCloseState = 'closed' | 'init-opening' | 'opening' | 'opened' | 'init-closing' | 'closing';
export declare function openClose(openTrigger: Observable<boolean> | Signal<boolean>, openingDelay?: Duration | number, closingDelay?: Duration | number): Observable<OpenCloseState>;
