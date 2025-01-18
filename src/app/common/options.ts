import { Signal, signal } from '@angular/core';

export function options<T>(...options: T[]): Signal<T> & { options: T[] } {
  const _signal = signal<T>(options[0]);
  (_signal as any).options = options;
  return _signal as any;
}