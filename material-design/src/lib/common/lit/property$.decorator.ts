/* eslint-disable @typescript-eslint/no-explicit-any */

import { BehaviorSubject } from 'rxjs';

export function property$() {
  return function (target: any, propertyKey: string) {
    const privateKey = '_' + propertyKey;
    const observableKey = propertyKey + '$';
    const privateObservableKey = '_' + observableKey;
    Object.defineProperty(target, propertyKey, {
      get(this: any) {
        return this[privateKey];
      },
      set(this: any, value: any) {
        this[privateKey] = value;
        if (!this[privateObservableKey]) {
          this[privateObservableKey] = new BehaviorSubject(value);
        }
        this[privateObservableKey]?.next(value);
      },
      configurable: true,
      enumerable: true,
    });
    Object.defineProperty(target, observableKey, {
      get(this: any) {
        return this[privateObservableKey].asObservable();
      },
    });
  };
}
