import { signal, WritableSignal } from '@angular/core';

export function options<T>(...values: T[]): WritableSignal<T> & { values: T[] } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _signal = signal<T>(values[0]) as any;
  _signal.values = values;
  return _signal;
}